# Changelog

All notable changes to MianScribe will be documented in this file.

## [2.0.0] - 2024 - MianScribe Pro

### 🎉 Major Upgrade - Pro Features

#### Added
- **Advanced Analytics Panel**
  - Sentence counter
  - Paragraph counter
  - Reading time calculator (200 WPM)
  - Longest sentence detector
  - Average word length analyzer
  - Limit usage percentage

- **Auto-Save & Storage**
  - Auto-save to localStorage every 3 seconds
  - Restore saved content on page load
  - Manual save with Ctrl+S
  - Clear saved data option
  - Last saved timestamp indicator

- **Export Functionality**
  - Export as TXT file
  - Export as Markdown (.md)
  - Export as RTF (Rich Text Format)
  - Quick export with Ctrl+E

- **Writing Controls**
  - Font size slider (12-32px)
  - Line height adjuster (1.2-2.5)
  - Font family selector (System, Serif, Sans, Mono)
  - Hard limit toggle (prevent typing over limit)
  - All settings persist in localStorage

- **Enhanced Modes**
  - Fullscreen writing mode (F11)
  - Distraction-free focus mode (Ctrl+D)
  - Collapsible analytics panel
  - Hide all controls for focused writing

- **New Keyboard Shortcuts**
  - Ctrl+S: Save content
  - Ctrl+E: Export as TXT
  - Ctrl+D: Toggle focus mode
  - Ctrl + =: Increase font size
  - Ctrl + -: Decrease font size
  - F11: Fullscreen mode

- **UI Enhancements**
  - Pro badge in header
  - Writing toolbar with controls
  - Side analytics panel
  - Export controls section
  - Mode toggle buttons
  - Last saved indicator
  - Shortcuts hint in footer

#### Changed
- Upgraded to modular architecture with 9 JS modules
- Enhanced responsive design for all screen sizes
- Improved dark mode styling
- Better button organization
- More intuitive layout

#### Technical
- Added `analytics.js` module
- Added `storage.js` module
- Added `export.js` module
- Added `controls.js` module
- Updated `app.js` with new integrations
- Updated `counter.js` with hard limit support
- Enhanced CSS with new components
- Improved accessibility

---

## [1.0.0] - 2024 - Initial Release

### Added
- Real-time character counting
- Real-time word counting
- Remaining characters display
- Custom character limits (1-10,000)
- Animated progress bar
- Copy to clipboard
- Reset functionality
- Speech-to-text (Web Speech API)
- Dark mode with persistence
- Toast notifications
- Keyboard shortcuts (Ctrl+Shift+C/R)
- Fully responsive design
- Modern SaaS-style UI
- Smooth animations
- Cross-browser support

### Technical
- Vanilla JavaScript (ES6 modules)
- Modular architecture (5 modules)
- No dependencies
- No build process
- localStorage for theme
- Web Speech API integration
- Modern Clipboard API with fallback

---

## Version Comparison

| Feature | v1.0 | v2.0 Pro |
|---------|------|----------|
| Character Count | ✅ | ✅ |
| Word Count | ✅ | ✅ |
| Progress Bar | ✅ | ✅ |
| Speech-to-Text | ✅ | ✅ |
| Dark Mode | ✅ | ✅ |
| Copy/Reset | ✅ | ✅ |
| Sentence Count | ❌ | ✅ |
| Paragraph Count | ❌ | ✅ |
| Reading Time | ❌ | ✅ |
| Analytics Panel | ❌ | ✅ |
| Auto-Save | ❌ | ✅ |
| Export (TXT/MD/RTF) | ❌ | ✅ |
| Font Controls | ❌ | ✅ |
| Fullscreen Mode | ❌ | ✅ |
| Focus Mode | ❌ | ✅ |
| Hard Limit | ❌ | ✅ |
| Advanced Shortcuts | ❌ | ✅ |

---

## Upgrade Notes

### From v1.0 to v2.0

**Breaking Changes**: None - fully backward compatible

**New Files**:
- `assets/js/analytics.js`
- `assets/js/storage.js`
- `assets/js/export.js`
- `assets/js/controls.js`

**Updated Files**:
- `index.html` - New UI components
- `assets/js/app.js` - New module integrations
- `assets/js/counter.js` - Hard limit support
- `assets/css/style.css` - New styles
- `assets/css/responsive.css` - Enhanced responsive
- `README.md` - Updated documentation

**Migration**: Simply replace files - no configuration needed!

---

## Future Roadmap

### Planned Features
- [ ] Multiple document tabs
- [ ] Cloud sync
- [ ] Collaboration features
- [ ] Grammar checking
- [ ] Spell checking
- [ ] Word suggestions
- [ ] Templates
- [ ] Custom themes
- [ ] Plugin system
- [ ] Mobile app

### Under Consideration
- [ ] PDF export
- [ ] DOCX export
- [ ] Version history
- [ ] Find & replace
- [ ] Text formatting
- [ ] Image insertion
- [ ] Table support
- [ ] Code highlighting

---

**MianScribe Pro** - Your complete writing companion
