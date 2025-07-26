// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const toggleExtension = document.getElementById('toggleExtension');
  const websiteInput = document.getElementById('websiteInput');
  const addWebsiteBtn = document.getElementById('addWebsite');
  const siteList = document.getElementById('siteList');
  const statusText = document.getElementById('statusText');

  // Load initial state
  loadExtensionState();
  loadBlockedSites();

  // Event listeners
  toggleExtension.addEventListener('change', toggleExtensionState);
  addWebsiteBtn.addEventListener('click', addWebsite);
  websiteInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addWebsite();
    }
  });

  // Load extension enabled/disabled state
  function loadExtensionState() {
    chrome.storage.sync.get(['extensionEnabled'], function(result) {
      const isEnabled = result.extensionEnabled !== false; // Default to true
      toggleExtension.checked = isEnabled;
      updateStatusText(isEnabled);
    });
  }

  // Toggle extension on/off
  function toggleExtensionState() {
    const isEnabled = toggleExtension.checked;
    chrome.storage.sync.set({ extensionEnabled: isEnabled }, function() {
      updateStatusText(isEnabled);
      // Send message to background script to update rules
      chrome.runtime.sendMessage({ 
        action: 'toggleExtension', 
        enabled: isEnabled 
      });
    });
  }

  // Update status text
  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Active - Blocking enabled' : 'Inactive - Blocking disabled';
  }

  // Add a new website to block list
  function addWebsite() {
    const website = websiteInput.value.trim();
    if (!website) return;

    // Clean up the URL input
    const cleanedUrl = cleanUrl(website);
    
    chrome.storage.sync.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      
      // Check if site already exists
      if (blockedSites.includes(cleanedUrl)) {
        alert('Website is already in the blocked list!');
        return;
      }

      // Add new site
      blockedSites.push(cleanedUrl);
      chrome.storage.sync.set({ blockedSites: blockedSites }, function() {
        websiteInput.value = '';
        loadBlockedSites();
        // Update blocking rules
        chrome.runtime.sendMessage({ 
          action: 'updateRules', 
          sites: blockedSites 
        });
      });
    });
  }

  // Remove website from block list
  function removeWebsite(website) {
    chrome.storage.sync.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      const updatedSites = blockedSites.filter(site => site !== website);
      
      chrome.storage.sync.set({ blockedSites: updatedSites }, function() {
        loadBlockedSites();
        // Update blocking rules
        chrome.runtime.sendMessage({ 
          action: 'updateRules', 
          sites: updatedSites 
        });
      });
    });
  }

  // Load and display blocked sites
  function loadBlockedSites() {
    chrome.storage.sync.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      displayBlockedSites(blockedSites);
    });
  }

  // Display blocked sites in the popup
  function displayBlockedSites(sites) {
    if (sites.length === 0) {
      siteList.innerHTML = '<div class="empty-state">No websites blocked yet</div>';
      return;
    }

    const sitesHtml = sites.map(site => `
      <div class="site-item">
        <span class="site-url">${site}</span>
        <button class="remove-btn" data-site="${site}">Remove</button>
      </div>
    `).join('');

    siteList.innerHTML = sitesHtml;

    // Add event listeners to remove buttons
    const removeButtons = siteList.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const site = this.getAttribute('data-site');
        removeWebsite(site);
      });
    });
  }

  // Clean and normalize URL input
  function cleanUrl(url) {
    // Remove protocol if present
    url = url.replace(/^https?:\/\//, '');
    // Remove www. if present
    url = url.replace(/^www\./, '');
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    // Convert to lowercase
    url = url.toLowerCase();
    return url;
  }
});