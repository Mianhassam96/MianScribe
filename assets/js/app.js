/**
 * MianScribe Pro — Complete Application
 * All features: counting, theme, transform, import, export, speech, analytics
 */

// ── DOM refs ──────────────────────────────────────────────────────────────────
const textArea          = document.getElementById('textArea');
const charCountEl       = document.getElementById('charCount');
const wordCountEl       = document.getElementById('wordCount');
const remainingEl       = document.getElementById('remaining');
const charLimitInput    = document.getElementById('charLimit');
const progressFill      = document.getElementById('progress');
const usageEl           = document.getElementById('usage');
const headerWordsEl     = document.getElementById('headerWords');
const headerTimeEl      = document.getElementById('headerTime');
const headerCharsEl     = document.getElementById('headerChars');

const themeToggleBtn    = document.getElementById('themeToggle');
const themeIconEl       = document.getElementById('themeIcon');

const copyBtn           = document.getElementById('copyBtn');
const clearBtn          = document.getElementById('clearBtn');
const micBtn            = document.getElementById('micBtn');
const saveBtn           = document.getElementById('saveBtn');

const fontSizeSlider    = document.getElementById('fontSize');
const fontSizeValEl     = document.getElementById('fontSizeVal');
const fontFamilySel     = document.getElementById('fontFamily');
const hardLimitChk      = document.getElementById('hardLimit');
const savedBadge        = document.getElementById('savedBadge');

const upperCaseBtn      = document.getElementById('upperCase');
const lowerCaseBtn      = document.getElementById('lowerCase');
const capitalizeBtn     = document.getElementById('capitalize');
const sentenceCaseBtn   = document.getElementById('sentenceCase');
const toggleCaseBtn     = document.getElementById('toggleCase');

const analyticsPanel    = document.getElementById('analyticsPanel');
const toggleAnalyticsBtn= document.getElementById('toggleAnalyticsBtn');
const closeAnalyticsBtn = document.getElementById('closeAnalytics');

const sentencesEl       = document.getElementById('sentences');
const paragraphsEl      = document.getElementById('paragraphs');
const readTimeEl        = document.getElementById('readTime');
const avgWordEl         = document.getElementById('avgWord');
const insightsListEl    = document.getElementById('insightsList');
const scoreNumEl        = document.getElementById('scoreNum');
const scoreTitleEl      = document.getElementById('scoreTitle');
const scoreDescEl       = document.getElementById('scoreDesc');
const ringFillEl        = document.getElementById('ringFill');

const fileInput         = document.getElementById('fileInput');
const importBtn         = document.getElementById('importBtn');
const exportTxtBtn      = document.getElementById('exportTxt');
const exportMdBtn       = document.getElementById('exportMd');
const exportRtfBtn      = document.getElementById('exportRtf');

const toastEl           = document.getElementById('toast');

// ── State ─────────────────────────────────────────────────────────────────────
let currentLimit = 280;
let recognition  = null;
let autoSaveTimer = null;

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
    loadTheme();
    loadPreferences();
    loadSavedContent();
    bindEvents();
    setupSpeech();
    updateAll();
}

// ── Bind Events ───────────────────────────────────────────────────────────────
function bindEvents() {
    // Text input
    textArea.addEventListener('input', onInput);

    // Theme
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Main actions
    copyBtn.addEventListener('click', copyText);
    clearBtn.addEventListener('click', clearText);
    micBtn.addEventListener('click', toggleSpeech);
    saveBtn.addEventListener('click', saveContent);

    // Limit
    charLimitInput.addEventListener('input', onLimitChange);

    // Presets
    document.querySelectorAll('.preset').forEach(btn =>
        btn.addEventListener('click', () => {
            charLimitInput.value = btn.dataset.limit;
            onLimitChange();
        })
    );

    // Font size
    fontSizeSlider.addEventListener('input', () => {
        const v = fontSizeSlider.value;
        textArea.style.fontSize = v + 'px';
        fontSizeValEl.textContent = v + 'px';
        localStorage.setItem('ms_fontSize', v);
    });

    // Font family
    fontFamilySel.addEventListener('change', applyFont);

    // Analytics toggle
    toggleAnalyticsBtn.addEventListener('click', () => {
        analyticsPanel.classList.toggle('hidden');
    });
    closeAnalyticsBtn.addEventListener('click', () => {
        analyticsPanel.classList.add('hidden');
    });

    // Text transforms
    upperCaseBtn.addEventListener('click',    () => transform('upper'));
    lowerCaseBtn.addEventListener('click',    () => transform('lower'));
    capitalizeBtn.addEventListener('click',   () => transform('capitalize'));
    sentenceCaseBtn.addEventListener('click', () => transform('sentence'));
    toggleCaseBtn.addEventListener('click',   () => transform('toggle'));

    // Import / Export
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImport);
    exportTxtBtn.addEventListener('click', () => exportFile('txt'));
    exportMdBtn.addEventListener('click',  () => exportFile('md'));
    exportRtfBtn.addEventListener('click', () => exportFile('rtf'));

    // Keyboard shortcuts
    document.addEventListener('keydown', handleShortcuts);

    // Auto-save every 3s
    setInterval(autoSave, 3000);
}

// ── Input Handler ─────────────────────────────────────────────────────────────
function onInput() {
    if (hardLimitChk.checked && textArea.value.length > currentLimit) {
        textArea.value = textArea.value.substring(0, currentLimit);
    }
    updateAll();
}

// ── Update All ────────────────────────────────────────────────────────────────
function updateAll() {
    const text  = textArea.value;
    const chars = text.length;
    const words = countWords(text);
    const pct   = currentLimit > 0 ? Math.min((chars / currentLimit) * 100, 100) : 0;
    const rem   = currentLimit - chars;

    // Counters
    charCountEl.textContent    = chars.toLocaleString();
    wordCountEl.textContent    = words.toLocaleString();
    remainingEl.textContent    = rem.toLocaleString();
    headerWordsEl.textContent  = words.toLocaleString();
    headerCharsEl.textContent  = chars.toLocaleString();

    // Progress bar
    progressFill.style.width = pct + '%';
    progressFill.classList.remove('warning', 'danger');
    if (pct >= 100) progressFill.classList.add('danger');
    else if (pct >= 80) progressFill.classList.add('warning');

    // Usage
    usageEl.textContent = pct.toFixed(1) + '%';

    // Analytics
    updateAnalytics(text, words);
}

// ── Word Count ────────────────────────────────────────────────────────────────
function countWords(text) {
    const t = text.trim();
    return t === '' ? 0 : t.split(/\s+/).filter(Boolean).length;
}

// ── Analytics ─────────────────────────────────────────────────────────────────
function updateAnalytics(text, words) {
    // Sentences: split on . ! ? followed by space or end
    const sentCount = text.trim() === ''
        ? 0
        : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Paragraphs: split on double newline
    const paraCount = text.trim() === ''
        ? 0
        : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);

    // Reading time (200 wpm)
    const mins = words / 200;
    let timeStr;
    if (words === 0)       timeStr = '—';
    else if (mins < 1)     timeStr = '< 1 min';
    else                   timeStr = Math.ceil(mins) + ' min';

    const headerTimeStr = words === 0 ? '0s' : (mins < 1 ? '<1m' : Math.ceil(mins) + 'm');

    // Avg word length
    const avgLen = words > 0
        ? (text.replace(/\s+/g, '').length / words).toFixed(1)
        : '0';

    // Update DOM
    sentencesEl.textContent  = sentCount;
    paragraphsEl.textContent = paraCount;
    readTimeEl.textContent   = timeStr;
    avgWordEl.textContent    = avgLen;
    headerTimeEl.textContent = headerTimeStr;

    // Score (0–100)
    const score = calcScore(words, sentCount, paraCount);
    updateScore(score);

    // Insights
    updateInsights(words, sentCount, paraCount, avgLen);
}

// ── Writing Score ─────────────────────────────────────────────────────────────
function calcScore(words, sentences, paragraphs) {
    if (words === 0) return 0;
    let score = 0;

    // Word count contribution (max 40)
    score += Math.min(words / 5, 40);

    // Sentence variety (max 30)
    if (sentences > 0) {
        const avgWPS = words / sentences;
        if (avgWPS >= 10 && avgWPS <= 20) score += 30;
        else if (avgWPS >= 5 && avgWPS <= 30) score += 20;
        else score += 10;
    }

    // Paragraph structure (max 30)
    if (paragraphs >= 3) score += 30;
    else if (paragraphs === 2) score += 20;
    else if (paragraphs === 1) score += 10;

    return Math.min(Math.round(score), 100);
}

function updateScore(score) {
    scoreNumEl.textContent = score;

    // Ring: circumference = 2π×32 ≈ 201
    const offset = 201 - (201 * score / 100);
    ringFillEl.style.strokeDashoffset = offset;

    if (score === 0) {
        scoreTitleEl.textContent = 'Start Writing';
        scoreDescEl.textContent  = 'Your writing score will appear as you type.';
    } else if (score < 30) {
        scoreTitleEl.textContent = 'Getting Started';
        scoreDescEl.textContent  = 'Keep going — you\'re building momentum!';
    } else if (score < 60) {
        scoreTitleEl.textContent = 'Good Progress';
        scoreDescEl.textContent  = 'Nice work! Add more structure to improve.';
    } else if (score < 85) {
        scoreTitleEl.textContent = 'Great Writing';
        scoreDescEl.textContent  = 'Well-structured and engaging content!';
    } else {
        scoreTitleEl.textContent = 'Excellent!';
        scoreDescEl.textContent  = 'Outstanding writing with great structure.';
    }
}

// ── Insights ──────────────────────────────────────────────────────────────────
function updateInsights(words, sentences, paragraphs, avgLen) {
    const tips = [];

    if (words === 0) {
        tips.push('Start typing to see insights…');
    } else {
        if (words < 50)       tips.push('🚀 Just getting started — keep writing!');
        else if (words < 200) tips.push('📈 Good momentum! You\'re building up nicely.');
        else if (words < 500) tips.push('🔥 Great progress! You\'re on a roll.');
        else                  tips.push('🏆 Impressive! That\'s a substantial piece.');

        if (sentences > 0) {
            const avg = words / sentences;
            if (avg > 25)      tips.push('✂️ Try shorter sentences for better readability.');
            else if (avg < 8)  tips.push('💡 Consider combining some short sentences.');
            else               tips.push('✅ Sentence length looks great!');
        }

        if (paragraphs === 1 && words > 100)
            tips.push('📋 Break your text into paragraphs for better structure.');
        else if (paragraphs >= 3)
            tips.push('📑 Well-structured with multiple paragraphs.');

        if (parseFloat(avgLen) > 7)
            tips.push('📚 You\'re using complex vocabulary — great!');
    }

    insightsListEl.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

// ── Limit Change ──────────────────────────────────────────────────────────────
function onLimitChange() {
    const v = parseInt(charLimitInput.value);
    if (v && v >= 1 && v <= 10000) {
        currentLimit = v;
        updateAll();
    }
}

// ── Copy ──────────────────────────────────────────────────────────────────────
function copyText() {
    if (!textArea.value) { showToast('⚠️ Nothing to copy!'); return; }
    navigator.clipboard.writeText(textArea.value)
        .then(() => showToast('✅ Copied to clipboard!'))
        .catch(() => {
            textArea.select();
            document.execCommand('copy');
            showToast('✅ Copied!');
        });
}

// ── Clear ─────────────────────────────────────────────────────────────────────
function clearText() {
    if (!textArea.value) { showToast('⚠️ Already empty!'); return; }
    if (textArea.value.length > 50 && !confirm('Clear all text?')) return;
    textArea.value = '';
    updateAll();
    showToast('🗑️ Cleared!');
}

// ── Save ──────────────────────────────────────────────────────────────────────
function saveContent() {
    localStorage.setItem('ms_content', textArea.value);
    localStorage.setItem('ms_savedAt', new Date().toISOString());
    showSavedBadge();
    showToast('💾 Saved!');
}

function autoSave() {
    if (!textArea.value) return;
    localStorage.setItem('ms_content', textArea.value);
    showSavedBadge();
}

function showSavedBadge() {
    savedBadge.classList.add('visible');
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => savedBadge.classList.remove('visible'), 2000);
}

// ── Load ──────────────────────────────────────────────────────────────────────
function loadSavedContent() {
    const saved = localStorage.getItem('ms_content');
    if (saved) { textArea.value = saved; updateAll(); }
}

function loadPreferences() {
    const size = localStorage.getItem('ms_fontSize');
    if (size) {
        fontSizeSlider.value = size;
        textArea.style.fontSize = size + 'px';
        fontSizeValEl.textContent = size + 'px';
    }

    const family = localStorage.getItem('ms_fontFamily');
    if (family) {
        fontFamilySel.value = family;
        applyFont();
    }
}

function applyFont() {
    const v = fontFamilySel.value;
    const map = { inter: "'Inter', sans-serif", serif: 'Georgia, serif', mono: "'Courier New', monospace" };
    textArea.style.fontFamily = map[v] || 'inherit';
    localStorage.setItem('ms_fontFamily', v);
}

// ── Theme ─────────────────────────────────────────────────────────────────────
function toggleTheme() {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    themeIconEl.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('ms_theme', dark ? 'dark' : 'light');
}

function loadTheme() {
    const saved = localStorage.getItem('ms_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.body.classList.add('dark');
        themeIconEl.textContent = '☀️';
    }
}

// ── Text Transform ────────────────────────────────────────────────────────────
function transform(type) {
    if (!textArea.value) { showToast('⚠️ Nothing to transform!'); return; }

    const text = textArea.value;
    let result = text;

    switch (type) {
        case 'upper':
            result = text.toUpperCase();
            showToast('🔠 UPPERCASE applied');
            break;
        case 'lower':
            result = text.toLowerCase();
            showToast('🔡 lowercase applied');
            break;
        case 'capitalize':
            result = text.replace(/\b\w/g, c => c.toUpperCase());
            showToast('🔤 Capitalize Words applied');
            break;
        case 'sentence':
            result = text.toLowerCase()
                .replace(/(^\s*\w)/m, c => c.toUpperCase())
                .replace(/([.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase());
            showToast('📝 Sentence case applied');
            break;
        case 'toggle':
            result = text.split('').map(c =>
                c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
            ).join('');
            showToast('🔀 Case toggled');
            break;
    }

    textArea.value = result;
    updateAll();
}

// ── Speech ────────────────────────────────────────────────────────────────────
function setupSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        micBtn.disabled = true;
        micBtn.title = 'Speech not supported in this browser';
        return;
    }
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = e => {
        let final = '', interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
        }
        if (final) {
            textArea.value += final + ' ';
            updateAll();
        }
    };

    recognition.onerror = () => {
        micBtn.classList.remove('listening');
        showToast('❌ Speech error — try again');
    };

    recognition.onend = () => micBtn.classList.remove('listening');
}

function toggleSpeech() {
    if (!recognition) return;
    if (micBtn.classList.contains('listening')) {
        recognition.stop();
        micBtn.classList.remove('listening');
        showToast('🎤 Stopped listening');
    } else {
        recognition.start();
        micBtn.classList.add('listening');
        showToast('🎤 Listening… speak now');
    }
}

// ── Import ────────────────────────────────────────────────────────────────────
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'md', 'rtf'].includes(ext)) {
        showToast('❌ Only TXT, MD, RTF files supported');
        fileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
        let content = ev.target.result;
        if (ext === 'rtf') content = stripRTF(content);

        if (textArea.value.length > 50 && !confirm('Replace existing content?')) {
            fileInput.value = '';
            return;
        }

        textArea.value = content;
        updateAll();
        showToast(`📥 Imported ${file.name}`);
        fileInput.value = '';
    };
    reader.onerror = () => { showToast('❌ Failed to read file'); fileInput.value = ''; };
    reader.readAsText(file);
}

function stripRTF(rtf) {
    // Remove RTF groups and control words, extract plain text
    let text = rtf
        .replace(/\{\\[^{}]*\}/g, '')       // remove control groups
        .replace(/\\par\b/g, '\n')           // paragraph breaks
        .replace(/\\line\b/g, '\n')          // line breaks
        .replace(/\\tab\b/g, '\t')           // tabs
        .replace(/\\[a-z]+\-?\d*\s?/gi, '') // control words
        .replace(/[{}\\]/g, '')              // remaining braces/backslashes
        .replace(/\n{3,}/g, '\n\n')         // collapse excess newlines
        .trim();
    return text;
}

// ── Export ────────────────────────────────────────────────────────────────────
function exportFile(format) {
    if (!textArea.value) { showToast('⚠️ Nothing to export!'); return; }

    let content  = textArea.value;
    let mime     = 'text/plain';
    const stamp  = new Date().toISOString().slice(0, 10);
    let filename = `mianscribe-${stamp}.${format}`;

    if (format === 'rtf') {
        content = buildRTF(content);
        mime = 'application/rtf';
    }

    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`📤 Exported as ${format.toUpperCase()}`);
}

function buildRTF(text) {
    const escaped = text
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\n\n/g, '\\par\\par\n')
        .replace(/\n/g, '\\par\n');

    return `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n\\f0\\fs24 ${escaped}\n}`;
}

// ── Keyboard Shortcuts ────────────────────────────────────────────────────────
function handleShortcuts(e) {
    // Skip if typing in a regular input (not the textarea)
    if (e.target.tagName === 'INPUT' && e.target !== textArea) return;

    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && e.key === 's')                        { e.preventDefault(); saveContent(); }
    if (ctrl && e.key === 'e')                        { e.preventDefault(); exportFile('txt'); }
    if (ctrl && e.shiftKey && e.key === 'C')          { e.preventDefault(); copyText(); }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ── Start ─────────────────────────────────────────────────────────────────────
init();
