# MianScribe

A powerful, modern writing workspace built with vanilla JavaScript. Track your writing, analyze text, export in multiple formats, and customize your experience.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📊 Smart Analytics
- Real-time character & word counting
- Sentence & paragraph detection
- Reading time calculator (200 WPM)
- Longest sentence finder
- Average word length analysis
- Limit usage percentage

### 💾 Auto-Save & Export
- Auto-save to localStorage (every 3 seconds)
- Restore saved content on reload
- Export as TXT, Markdown, or RTF
- Manual save with Ctrl+S

### 🎨 Writing Controls
- Font size adjuster (12-32px)
- Line height control (1.2-2.5)
- Font family selector (System, Serif, Sans, Mono)
- Hard limit toggle (prevent typing over limit)

### 🎤 Speech-to-Text
- Web Speech API integration
- Live listening indicator
- Real-time transcription
- Error handling

### 🌗 Themes & Modes
- Dark mode with persistence
- Fullscreen writing mode (F11)
- Distraction-free focus mode (Ctrl+D)
- Collapsible analytics panel

### ⌨️ Keyboard Shortcuts
- `Ctrl+S` - Save content
- `Ctrl+E` - Export as TXT
- `Ctrl+D` - Toggle focus mode
- `Ctrl+Shift+C` - Copy text
- `Ctrl+Shift+R` - Reset text
- `Ctrl + =` - Increase font size
- `Ctrl + -` - Decrease font size
- `F11` - Fullscreen mode

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Start typing or use the microphone
3. Watch real-time analytics update
4. Customize your writing experience
5. Export when done!

**No installation, no dependencies, no build process.**


## 🎯 Use Cases

- **Writers**: Track word count, reading time, and progress
- **Students**: Monitor essay length and structure
- **Social Media**: Stay within character limits (Twitter, LinkedIn)
- **Bloggers**: Analyze readability and structure
- **Content Creators**: Export in multiple formats

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Edge | ✅ Full | Recommended |
| Firefox | ✅ Full | Limited speech |
| Safari | ✅ Full | Limited speech |

## 📊 Analytics Explained

- **Sentences**: Counts text ending with `.`, `!`, or `?`
- **Paragraphs**: Counts text blocks separated by line breaks
- **Reading Time**: Based on 200 words per minute average
- **Longest Sentence**: Finds sentence with most words
- **Avg Word Length**: Average characters per word

## 💡 Tips

1. **Auto-Save**: Your work is automatically saved every 3 seconds
2. **Focus Mode**: Press Ctrl+D to hide all controls and focus on writing
3. **Hard Limit**: Enable to prevent typing beyond your character limit
4. **Export**: Save your work in TXT, Markdown, or RTF format
5. **Shortcuts**: Use keyboard shortcuts for faster workflow

## 🔧 Customization

### Change Default Limit
Edit `assets/js/counter.js`:
```javascript
let currentLimit = 280; // Change this
```

### Change Auto-Save Interval
Edit `assets/js/storage.js`:
```javascript
const AUTO_SAVE_INTERVAL = 3000; // milliseconds
```

### Change Reading Speed
Edit `assets/js/analytics.js`:
```javascript
const wordsPerMinute = 200; // Change this
```

## 🎨 Technologies

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **JavaScript (ES6+)**: Modular architecture
- **Web Speech API**: Speech recognition
- **localStorage**: Data persistence

## 📝 License

MIT License - Free to use for personal and commercial projects

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

Having issues? Check:
1. JavaScript is enabled
2. Browser is up to date
3. localStorage is allowed
4. Microphone permissions (for speech)

## 🎉 What's New in Pro

- ✅ Advanced analytics panel
- ✅ Auto-save & restore
- ✅ Export to TXT/MD/RTF
- ✅ Font & layout controls
- ✅ Fullscreen & focus modes
- ✅ Hard limit enforcement
- ✅ Enhanced keyboard shortcuts
- ✅ Limit usage percentage
- ✅ Last saved indicator

---

**Built with ❤️ using Vanilla JavaScript**

No frameworks. No dependencies. Just clean, modern web development.

[GitHub Repository](https://github.com/Mianhassam96/MianScribe)
