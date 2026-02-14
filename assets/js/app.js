/**
 * MianScribe Pro - Main Application
 * Complete rewrite with all features working
 */

// DOM Elements
const textArea = document.getElementById('textArea');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const remaining = document.getElementById('remaining');
const charLimit = document.getElementById('charLimit');
const progress = document.getElementById('progress');
const usage = document.getElementById('usage');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const micBtn = document.getElementById('micBtn');
const saveBtn = document.getElementById('saveBtn');
const fontSize = document.getElementById('fontSize');
const fontSizeVal = document.getElementById('fontSizeVal');
const fontFamily = document.getElementById('fontFamily');
const hardLimit = document.getElementById('hardLimit');
const toast = document.getElementById('toast');
const headerWords = document.getElementById('headerWords');
const headerTime = document.getElementById('headerTime');
const sentences = document.getElementById('sentences');
const paragraphs = document.getElementById('paragraphs');
const readTime = document.getElementById('readTime');
const avgWord = document.getElementById('avgWord');
const insightsList = document.getElementById('insightsList');
const closeAnalytics = document.getElementById('closeAnalytics');
const analyticsPanel = document.getElementById('analyticsPanel');
const fileInput = document.getElementById('fileInput');
const importBtn = document.getElementById('importBtn');

// State
let currentLimit = 280;
let recognition = null;

// Initialize
function init() {
    console.log('🚀 MianScribe Pro initializing...');
    
    // Load saved theme
    loadTheme();
    
    // Load saved content
    loadContent();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial update
    updateAll();
    
    // Setup speech recognition
    setupSpeech();
    
    console.log('✅ Ready!');
}

// Event Listeners
function setupEventListeners() {
    // Text input
    textArea.addEventListener('input', handleInput);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Buttons
    copyBtn.addEventListener('click', copyText);
    clearBtn.addEventListener('click', clearText);
    micBtn.addEventListener('click', toggleSpeech);
    saveBtn.addEventListener('click', saveContent);
    
    // Limit
    charLimit.addEventListener('input', updateLimit);
    
    // Presets
    document.querySelectorAll('.preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const limit = btn.getAttribute('data-limit');
            charLimit.value = limit;
            updateLimit();
        });
    });
    
    // Font controls
    fontSize.addEventListener('input', () => {
        const size = fontSize.value;
        textArea.style.fontSize = size + 'px';
        fontSizeVal.textContent = size + 'px';
        localStorage.setItem('fontSize', size);
    });
    
    fontFamily.addEventListener('change', () => {
        const family = fontFamily.value;
        if (family === 'system') {
            textArea.style.fontFamily = 'inherit';
        } else if (family === 'serif') {
            textArea.style.fontFamily = 'Georgia, serif';
        } else if (family === 'mono') {
            textArea.style.fontFamily = 'monospace';
        }
        localStorage.setItem('fontFamily', family);
    });
    
    // Close analytics
    closeAnalytics.addEventListener('click', () => {
        analyticsPanel.classList.add('hidden');
    });
    
    // Import file
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileImport);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleShortcuts);
    
    // Auto-save
    setInterval(() => {
        if (textArea.value) {
            localStorage.setItem('autoSave', textArea.value);
            localStorage.setItem('autoSaveTime', new Date().toISOString());
        }
    }, 3000);
}

// Handle Input
function handleInput() {
    const text = textArea.value;
    
    // Hard limit
    if (hardLimit.checked && text.length > currentLimit) {
        textArea.value = text.substring(0, currentLimit);
        return;
    }
    
    updateAll();
}

// Update All Counters
function updateAll() {
    const text = textArea.value;
    
    // Character count
    const chars = text.length;
    charCount.textContent = chars.toLocaleString();
    
    // Word count
    const words = countWords(text);
    wordCount.textContent = words.toLocaleString();
    headerWords.textContent = words;
    
    // Remaining
    const rem = currentLimit - chars;
    remaining.textContent = rem.toLocaleString();
    
    // Progress
    const percent = Math.min((chars / currentLimit) * 100, 100);
    progress.style.width = percent + '%';
    progress.classList.remove('warning', 'danger');
    if (percent >= 100) {
        progress.classList.add('danger');
    } else if (percent >= 90) {
        progress.classList.add('warning');
    }
    
    // Usage
    usage.textContent = percent.toFixed(1) + '%';
    
    // Analytics
    updateAnalytics(text, words);
}

// Count Words
function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(w => w.length > 0).length;
}

// Update Analytics
function updateAnalytics(text, words) {
    // Sentences
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sentences.textContent = sentenceCount;
    
    // Paragraphs
    const paragraphCount = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    paragraphs.textContent = paragraphCount;
    
    // Reading time
    const minutes = Math.ceil(words / 200);
    const time = minutes < 1 ? '< 1 min' : minutes + ' min';
    readTime.textContent = time;
    headerTime.textContent = minutes < 1 ? '0s' : minutes + 'm';
    
    // Average word length
    if (words > 0) {
        const totalChars = text.replace(/\s/g, '').length;
        const avg = (totalChars / words).toFixed(1);
        avgWord.textContent = avg;
    } else {
        avgWord.textContent = '0';
    }
    
    // Insights
    updateInsights(words, sentenceCount, paragraphCount);
}

// Update Insights
function updateInsights(words, sentences, paragraphs) {
    const insights = [];
    
    if (words === 0) {
        insights.push('Start typing to see insights...');
    } else {
        if (words < 50) {
            insights.push('Keep writing! You\'re just getting started.');
        } else if (words < 200) {
            insights.push('Good progress! You\'re building momentum.');
        } else {
            insights.push('Great work! You\'re on a roll!');
        }
        
        if (sentences > 0) {
            const avgWordsPerSentence = (words / sentences).toFixed(1);
            if (avgWordsPerSentence > 25) {
                insights.push('Consider shorter sentences for better readability.');
            } else if (avgWordsPerSentence < 10) {
                insights.push('Your sentences are concise and clear.');
            }
        }
        
        if (paragraphs > 5) {
            insights.push('Well-structured with multiple paragraphs.');
        }
    }
    
    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
}

// Update Limit
function updateLimit() {
    const newLimit = parseInt(charLimit.value);
    if (newLimit && newLimit > 0 && newLimit <= 10000) {
        currentLimit = newLimit;
        updateAll();
    }
}

// Copy Text
function copyText() {
    if (!textArea.value) {
        showToast('⚠️ Nothing to copy!');
        return;
    }
    
    navigator.clipboard.writeText(textArea.value)
        .then(() => showToast('✅ Copied to clipboard!'))
        .catch(() => {
            textArea.select();
            document.execCommand('copy');
            showToast('✅ Copied to clipboard!');
        });
}

// Clear Text
function clearText() {
    if (!textArea.value) {
        showToast('⚠️ Already empty!');
        return;
    }
    
    if (textArea.value.length > 50) {
        if (!confirm('Clear all text?')) return;
    }
    
    textArea.value = '';
    updateAll();
    showToast('✅ Text cleared!');
}

// Save Content
function saveContent() {
    localStorage.setItem('savedContent', textArea.value);
    localStorage.setItem('savedTime', new Date().toISOString());
    showToast('✅ Content saved!');
}

// Load Content
function loadContent() {
    const saved = localStorage.getItem('autoSave') || localStorage.getItem('savedContent');
    if (saved) {
        textArea.value = saved;
        updateAll();
    }
    
    // Load font settings
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        fontSize.value = savedSize;
        textArea.style.fontSize = savedSize + 'px';
        fontSizeVal.textContent = savedSize + 'px';
    }
    
    const savedFamily = localStorage.getItem('fontFamily');
    if (savedFamily) {
        fontFamily.value = savedFamily;
        fontFamily.dispatchEvent(new Event('change'));
    }
}

// Theme
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        themeIcon.textContent = '☀️';
    }
}

// Speech Recognition
function setupSpeech() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        micBtn.disabled = true;
        micBtn.title = 'Speech recognition not supported';
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        textArea.value = transcript;
        updateAll();
    };
    
    recognition.onerror = () => {
        micBtn.classList.remove('listening');
        showToast('❌ Speech recognition error');
    };
    
    recognition.onend = () => {
        micBtn.classList.remove('listening');
    };
}

function toggleSpeech() {
    if (!recognition) return;
    
    if (micBtn.classList.contains('listening')) {
        recognition.stop();
        micBtn.classList.remove('listening');
    } else {
        recognition.start();
        micBtn.classList.add('listening');
        showToast('🎤 Listening...');
    }
}

// Export Functions
document.getElementById('exportTxt').addEventListener('click', () => exportFile('txt'));
document.getElementById('exportMd').addEventListener('click', () => exportFile('md'));
document.getElementById('exportRtf').addEventListener('click', () => exportFile('rtf'));

function exportFile(format) {
    if (!textArea.value) {
        showToast('⚠️ Nothing to export!');
        return;
    }
    
    let content = textArea.value;
    let mimeType = 'text/plain';
    let filename = `mianscribe-${Date.now()}.${format}`;
    
    if (format === 'rtf') {
        content = convertToRTF(content);
        mimeType = 'application/rtf';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`✅ Exported as ${format.toUpperCase()}!`);
}

// Import File Handler
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    // Validate file type
    if (!['txt', 'md', 'rtf'].includes(fileExtension)) {
        showToast('❌ Unsupported file type! Use TXT, MD, or RTF.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        let content = e.target.result;
        
        // Parse RTF if needed
        if (fileExtension === 'rtf') {
            content = parseRTF(content);
        }
        
        // Confirm if there's existing content
        if (textArea.value && textArea.value.length > 50) {
            if (!confirm('Replace existing content with imported file?')) {
                fileInput.value = ''; // Reset file input
                return;
            }
        }
        
        textArea.value = content;
        updateAll();
        showToast(`✅ Imported ${fileName}!`);
        
        // Reset file input
        fileInput.value = '';
    };
    
    reader.onerror = () => {
        showToast('❌ Error reading file!');
        fileInput.value = '';
    };
    
    reader.readAsText(file);
}

// Convert text to RTF format
function convertToRTF(text) {
    // Escape special RTF characters
    text = text.replace(/\\/g, '\\\\');
    text = text.replace(/\{/g, '\\{');
    text = text.replace(/\}/g, '\\}');
    
    // Convert newlines to RTF paragraph breaks
    text = text.replace(/\n/g, '\\par\n');
    
    // Create RTF document
    const rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\f0\\fs24
${text}
}`;
    
    return rtf;
}

// Parse RTF to plain text
function parseRTF(rtf) {
    // Remove RTF header and control words
    let text = rtf.replace(/\\rtf1[^{]*\{/g, '');
    
    // Remove font table
    text = text.replace(/\{\\fonttbl[^}]*\}/g, '');
    
    // Remove color table
    text = text.replace(/\{\\colortbl[^}]*\}/g, '');
    
    // Remove other control groups
    text = text.replace(/\{\\[^}]*\}/g, '');
    
    // Convert RTF paragraph breaks to newlines
    text = text.replace(/\\par\s*/g, '\n');
    
    // Remove common RTF control words
    text = text.replace(/\\[a-z]+\d*\s*/gi, '');
    
    // Remove remaining braces
    text = text.replace(/[{}]/g, '');
    
    // Clean up extra whitespace
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.trim();
    
    return text;
}

// Keyboard Shortcuts
function handleShortcuts(e) {
    if (e.target.tagName === 'INPUT' && e.target.id !== 'textArea') return;
    
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportFile('txt');
    }
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyText();
    }
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Start the app
init();
