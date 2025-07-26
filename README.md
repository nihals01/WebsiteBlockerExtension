# Website Blocker Chrome Extension

A simple and effective Chrome extension to block distracting websites and improve productivity.

## Features

- 🛡️ **Toggle On/Off**: Easily enable or disable the extension
- ➕ **Add Websites**: Add any website to your block list
- ❌ **Remove Websites**: Remove websites from your block list anytime
- 🎨 **Modern UI**: Clean, glassmorphism design with smooth animations
- 📱 **Responsive**: Works perfectly on all screen sizes
- 💡 **Productivity Tips**: Motivational messages when sites are blocked
- 💾 **Persistent Storage**: Settings saved across browser sessions

## Installation

### Method 1: Install Unpacked Extension (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" button
5. Select the extension folder
6. The extension will appear in your Chrome toolbar

### Method 2: Pack and Install

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select the extension folder
5. Install the generated `.crx` file

## Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Toggle the switch** to enable/disable website blocking
3. **Add websites** by entering the domain (e.g., `facebook.com`, `youtube.com`) and clicking "Add"
4. **Remove websites** by clicking the "Remove" button next to any blocked site
5. **Visit a blocked site** to see the custom blocked page with productivity tips

## Screenshots

![Extension Popup](screenshots/popup.png)
*Extension popup interface*

![Blocked Page](screenshots/blocked.png)
*Custom blocked page with productivity tips*

## File Structure

```
website-blocker/
├── manifest.json          # Extension configuration
├── popup.html            # Popup interface HTML
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── blocked.html          # Custom blocked page
├── rules.json           # Declarative net request rules
└── README.md            # This file
```

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `storage`, `declarativeNetRequest`, `activeTab`
- **API Used**: Chrome's declarativeNetRequest API for efficient blocking
- **Storage**: Chrome's sync storage for cross-device synchronization

## Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development
1. Clone the repository
2. Make your changes
3. Reload the extension in `chrome://extensions/`
4. Test your changes

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy

This extension:
- ✅ Stores data locally in your browser
- ✅ Syncs settings across your Chrome browsers (if logged in)
- ❌ Does NOT send any data to external servers
- ❌ Does NOT collect personal information
- ❌ Does NOT track your browsing history

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions:
1. Check existing [Issues](../../issues)
2. Create a new issue with detailed description
3. Include browser version and extension version

## Changelog

### v1.0.0
- Initial release
- Basic website blocking functionality
- Modern UI with glassmorphism design
- Toggle on/off functionality
- Add/remove websites
- Custom blocked page with productivity tips

---

⭐ **If you find this extension useful, please give it a star!** ⭐