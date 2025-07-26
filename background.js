// Background script for Website Blocker extension
chrome.runtime.onInstalled.addListener(function() {
  // Initialize default settings
  chrome.storage.sync.set({
    extensionEnabled: true,
    blockedSites: []
  });
  
  // Create initial empty rules
  updateBlockingRules([]);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateRules') {
    updateBlockingRules(request.sites);
  } else if (request.action === 'toggleExtension') {
    handleExtensionToggle(request.enabled);
  }
});

// Handle extension toggle
function handleExtensionToggle(enabled) {
  if (enabled) {
    // Re-enable blocking with current sites
    chrome.storage.sync.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      updateBlockingRules(blockedSites);
    });
  } else {
    // Disable all blocking rules
    updateBlockingRules([]);
  }
}

// Update declarative net request rules
function updateBlockingRules(sites) {
  chrome.storage.sync.get(['extensionEnabled'], function(result) {
    const isEnabled = result.extensionEnabled !== false;
    
    // Clear existing rules first
    chrome.declarativeNetRequest.getDynamicRules(function(existingRules) {
      const ruleIds = existingRules.map(rule => rule.id);
      
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
        addRules: isEnabled ? createBlockingRules(sites) : []
      }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error updating rules:', chrome.runtime.lastError);
        } else {
          console.log('Rules updated successfully. Blocking', sites.length, 'sites.');
        }
      });
    });
  });
}

// Create blocking rules for the given sites
function createBlockingRules(sites) {
  const rules = [];
  
  sites.forEach((site, index) => {
    // Create rule for the main domain
    rules.push({
      id: index * 2 + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          url: chrome.runtime.getURL('blocked.html')
        }
      },
      condition: {
        urlFilter: `*://*.${site}/*`,
        resourceTypes: ['main_frame']
      }
    });
    
    // Create rule for the domain without subdomain
    rules.push({
      id: index * 2 + 2,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          url: chrome.runtime.getURL('blocked.html')
        }
      },
      condition: {
        urlFilter: `*://${site}/*`,
        resourceTypes: ['main_frame']
      }
    });
  });
  
  return rules;
}

// Handle storage changes to keep rules in sync
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && (changes.blockedSites || changes.extensionEnabled)) {
    chrome.storage.sync.get(['blockedSites', 'extensionEnabled'], function(result) {
      const sites = result.blockedSites || [];
      const enabled = result.extensionEnabled !== false;
      
      if (enabled) {
        updateBlockingRules(sites);
      } else {
        updateBlockingRules([]);
      }
    });
  }
});