/**
 * MianScribe Pro — Enhanced Application
 * Features: writing goals, version history, expanded presets,
 * visual analytics charts, focus mode, readability, passive voice, export HTML
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
const headerGoalEl      = document.getElementById('headerGoal');

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
const lastSavedTimeEl   = document.getElementById('lastSavedTime');

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

const readabilityBadgeEl= document.getElementById('readabilityBadge');
const passiveCountEl    = document.getElementById('passiveCount');
const longSentCountEl   = document.getElementById('longSentCount');
const topKeywordEl      = document.getElementById('topKeyword');

const fileInput         = document.getElementById('fileInput');
const importBtn         = document.getElementById('importBtn');
const exportTxtBtn      = document.getElementById('exportTxt');
const exportMdBtn       = document.getElementById('exportMd');
const exportRtfBtn      = document.getElementById('exportRtf');
const exportHtmlBtn     = document.getElementById('exportHtml');

const toastEl           = document.getElementById('toast');

// Goal elements
const goalBar           = document.getElementById('goalBar');
const goalProgressText  = document.getElementById('goalProgressText');
const goalPct           = document.getElementById('goalPct');
const goalFill          = document.getElementById('goalFill');
const dailyGoalInput    = document.getElementById('dailyGoalInput');
const streakValueEl     = document.getElementById('streakValue');

// Drafts
const draftsBtn         = document.getElementById('draftsBtn');
const draftCountEl      = document.getElementById('draftCount');
const draftsModal       = document.getElementById('draftsModal');
const closeDraftsBtn    = document.getElementById('closeDrafts');
const draftsListEl      = document.getElementById('draftsList');

// Focus mode
const focusModeBtn      = document.getElementById('focusModeBtn');
const focusOverlay      = document.getElementById('focusOverlay');
const focusTextArea     = document.getElementById('focusTextArea');
const focusExitBtn      = document.getElementById('focusExitBtn');
const focusStatsEl      = document.getElementById('focusStats');
const focusProgressFill = document.getElementById('focusProgressFill');

// ── State ─────────────────────────────────────────────────────────────────────
let currentLimit    = 280;
let recognition     = null;
let autoSaveTimer   = null;
let dailyGoal       = 1000;
let wordGrowthChart = null;
let wordGrowthData  = [];
let wordGrowthTimer = null;
let focusMode       = false;

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
    loadTheme();
    loadPreferences();
    loadSavedContent();
    bindEvents();
    setupSpeech();
    initChart();
    updateAll();
    updateStreak();
    updateDraftCount();
    updateLastSavedTime();
}

// ── Bind Events ───────────────────────────────────────────────────────────────
function bindEvents() {
    textArea.addEventListener('input', onInput);
    themeToggleBtn.addEventListener('click', toggleTheme);
    copyBtn.addEventListener('click', copyText);
    clearBtn.addEventListener('click', clearText);
    micBtn.addEventListener('click', toggleSpeech);
    saveBtn.addEventListener('click', saveContent);
    charLimitInput.addEventListener('input', onLimitChange);

    document.querySelectorAll('.preset').forEach(btn =>
        btn.addEventListener('click', () => {
            charLimitInput.value = btn.dataset.limit;
            onLimitChange();
            showToast(`📏 Limit set to ${Number(btn.dataset.limit).toLocaleString()} chars`);
        })
    );

    fontSizeSlider.addEventListener('input', () => {
        const v = fontSizeSlider.value;
        textArea.style.fontSize = v + 'px';
        fontSizeValEl.textContent = v + 'px';
        localStorage.setItem('ms_fontSize', v);
    });

    fontFamilySel.addEventListener('change', applyFont);

    toggleAnalyticsBtn.addEventListener('click', () => analyticsPanel.classList.toggle('hidden'));
    closeAnalyticsBtn.addEventListener('click', () => analyticsPanel.classList.add('hidden'));

    upperCaseBtn.addEventListener('click',    () => transform('upper'));
    lowerCaseBtn.addEventListener('click',    () => transform('lower'));
    capitalizeBtn.addEventListener('click',   () => transform('capitalize'));
    sentenceCaseBtn.addEventListener('click', () => transform('sentence'));
    toggleCaseBtn.addEventListener('click',   () => transform('toggle'));

    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImport);
    exportTxtBtn.addEventListener('click',  () => exportFile('txt'));
    exportMdBtn.addEventListener('click',   () => exportFile('md'));
    exportRtfBtn.addEventListener('click',  () => exportFile('rtf'));
    exportHtmlBtn.addEventListener('click', () => exportFile('html'));

    dailyGoalInput.addEventListener('input', () => {
        const v = parseInt(dailyGoalInput.value);
        if (v && v >= 10) {
            dailyGoal = v;
            localStorage.setItem('ms_dailyGoal', v);
            updateGoalBar(countWords(textArea.value));
        }
    });

    draftsBtn.addEventListener('click', openDrafts);
    closeDraftsBtn.addEventListener('click', () => draftsModal.classList.remove('open'));
    draftsModal.addEventListener('click', e => { if (e.target === draftsModal) draftsModal.classList.remove('open'); });

    focusModeBtn.addEventListener('click', enterFocusMode);
    focusExitBtn.addEventListener('click', exitFocusMode);
    focusTextArea.addEventListener('input', onFocusInput);

    document.addEventListener('keydown', handleShortcuts);
    setInterval(autoSave, 5000);
}

// ── Input Handler ─────────────────────────────────────────────────────────────
function onInput() {
    if (hardLimitChk.checked && textArea.value.length > currentLimit) {
        textArea.value = textArea.value.substring(0, currentLimit);
    }
    updateAll();
    scheduleWordGrowthUpdate();
}

function scheduleWordGrowthUpdate() {
    clearTimeout(wordGrowthTimer);
    wordGrowthTimer = setTimeout(() => {
        const w = countWords(textArea.value);
        if (wordGrowthData.length === 0 || wordGrowthData[wordGrowthData.length - 1] !== w) {
            wordGrowthData.push(w);
            if (wordGrowthData.length > 20) wordGrowthData.shift();
            updateChart();
        }
    }, 1500);
}

// ── Update All ────────────────────────────────────────────────────────────────
function updateAll() {
    const text  = textArea.value;
    const chars = text.length;
    const words = countWords(text);
    const pct   = currentLimit > 0 ? Math.min((chars / currentLimit) * 100, 100) : 0;
    const rem   = currentLimit - chars;

    charCountEl.textContent    = chars.toLocaleString();
    wordCountEl.textContent    = words.toLocaleString();
    remainingEl.textContent    = rem.toLocaleString();
    headerWordsEl.textContent  = words.toLocaleString();
    headerCharsEl.textContent  = chars.toLocaleString();

    progressFill.style.width = pct + '%';
    progressFill.classList.remove('warning', 'danger');
    if (pct >= 100) progressFill.classList.add('danger');
    else if (pct >= 80) progressFill.classList.add('warning');

    usageEl.textContent = pct.toFixed(1) + '%';

    updateGoalBar(words);
    updateAnalytics(text, words);
}

function countWords(text) {
    const t = text.trim();
    return t === '' ? 0 : t.split(/\s+/).filter(Boolean).length;
}

// ── Goal Bar ──────────────────────────────────────────────────────────────────
function updateGoalBar(words) {
    const pct = Math.min((words / dailyGoal) * 100, 100);
    goalProgressText.textContent = `${words.toLocaleString()} / ${dailyGoal.toLocaleString()} words`;
    goalPct.textContent = pct.toFixed(0) + '%';
    goalFill.style.width = pct + '%';
    goalFill.classList.toggle('goal-complete', pct >= 100);
    headerGoalEl.textContent = pct.toFixed(0) + '%';

    if (pct >= 100 && words > 0) {
        const todayKey = 'ms_goal_' + new Date().toDateString();
        if (!localStorage.getItem(todayKey)) {
            localStorage.setItem(todayKey, '1');
            showToast('🏆 Daily goal reached! Amazing work!');
            updateStreak();
        }
    }
}

function updateStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (localStorage.getItem('ms_goal_' + d.toDateString())) streak++;
        else if (i > 0) break;
    }
    streakValueEl.textContent = `🔥 ${streak} day${streak !== 1 ? 's' : ''}`;
}

// ── Analytics ─────────────────────────────────────────────────────────────────
function updateAnalytics(text, words) {
    const sentCount = text.trim() === ''
        ? 0
        : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    const paraCount = text.trim() === ''
        ? 0
        : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);

    const mins = words / 200;
    let timeStr = words === 0 ? '—' : (mins < 1 ? '< 1 min' : Math.ceil(mins) + ' min');
    const headerTimeStr = words === 0 ? '0s' : (mins < 1 ? '<1m' : Math.ceil(mins) + 'm');

    const avgLen = words > 0 ? (text.replace(/\s+/g, '').length / words).toFixed(1) : '0';

    sentencesEl.textContent  = sentCount;
    paragraphsEl.textContent = paraCount;
    readTimeEl.textContent   = timeStr;
    avgWordEl.textContent    = avgLen;
    headerTimeEl.textContent = headerTimeStr;

    // Readability (Flesch-Kincaid approximation)
    updateReadability(text, words, sentCount);

    // Passive voice detection
    const passiveMatches = text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
    passiveCountEl.textContent = passiveMatches.length;

    // Long sentences (> 30 words)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const longSents = sentences.filter(s => s.trim().split(/\s+/).length > 30).length;
    longSentCountEl.textContent = longSents;

    // Top keyword
    topKeywordEl.textContent = getTopKeyword(text);

    const score = calcScore(words, sentCount, paraCount);
    updateScore(score);
    updateInsights(words, sentCount, paraCount, avgLen, passiveMatches.length, longSents);
}

function updateReadability(text, words, sentences) {
    if (words < 10 || sentences === 0) { readabilityBadgeEl.textContent = '—'; readabilityBadgeEl.className = 'readability-badge'; return; }
    const syllables = countSyllables(text);
    const fk = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    let label, cls;
    if (fk >= 70)      { label = 'Easy';        cls = 'badge-easy'; }
    else if (fk >= 50) { label = 'Moderate';    cls = 'badge-moderate'; }
    else if (fk >= 30) { label = 'Difficult';   cls = 'badge-difficult'; }
    else               { label = 'Very Hard';   cls = 'badge-hard'; }
    readabilityBadgeEl.textContent = label;
    readabilityBadgeEl.className = 'readability-badge ' + cls;
}

function countSyllables(text) {
    return text.toLowerCase().replace(/[^a-z]/g, ' ').split(/\s+/).reduce((acc, word) => {
        if (!word) return acc;
        const m = word.match(/[aeiouy]+/g);
        return acc + (m ? m.length : 1);
    }, 0);
}

function getTopKeyword(text) {
    if (!text.trim()) return '—';
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','it','this','that','i','you','he','she','we','they','be','been','have','has','had','do','did','will','would','could','should','not','from','by','as','so','if','up','out','about','into','than','then','when','what','which','who','how','all','just','more','also','can','its','their','there','my','your','his','her','our','no','but','been','being','am']);
    const freq = {};
    text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).forEach(w => {
        if (w.length > 3 && !stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return top ? `"${top[0]}" (${top[1]}×)` : '—';
}

// ── Score ─────────────────────────────────────────────────────────────────────
function calcScore(words, sentences, paragraphs) {
    if (words === 0) return 0;
    let score = 0;
    score += Math.min(words / 5, 40);
    if (sentences > 0) {
        const avg = words / sentences;
        if (avg >= 10 && avg <= 20) score += 30;
        else if (avg >= 5 && avg <= 30) score += 20;
        else score += 10;
    }
    if (paragraphs >= 3) score += 30;
    else if (paragraphs === 2) score += 20;
    else if (paragraphs === 1) score += 10;
    return Math.min(Math.round(score), 100);
}

function updateScore(score) {
    scoreNumEl.textContent = score;
    const offset = 201 - (201 * score / 100);
    ringFillEl.style.strokeDashoffset = offset;
    if (score === 0)       { scoreTitleEl.textContent = 'Start Writing';   scoreDescEl.textContent = 'Your writing score will appear as you type.'; }
    else if (score < 30)   { scoreTitleEl.textContent = 'Getting Started'; scoreDescEl.textContent = 'Keep going — you\'re building momentum!'; }
    else if (score < 60)   { scoreTitleEl.textContent = 'Good Progress';   scoreDescEl.textContent = 'Nice work! Add more structure to improve.'; }
    else if (score < 85)   { scoreTitleEl.textContent = 'Great Writing';   scoreDescEl.textContent = 'Well-structured and engaging content!'; }
    else                   { scoreTitleEl.textContent = 'Excellent!';      scoreDescEl.textContent = 'Outstanding writing with great structure.'; }
}

// ── Insights ──────────────────────────────────────────────────────────────────
function updateInsights(words, sentences, paragraphs, avgLen, passive, longSents) {
    const tips = [];
    if (words === 0) { tips.push('Start typing to see insights…'); }
    else {
        if (words < 50)       tips.push('🚀 Just getting started — keep writing!');
        else if (words < 200) tips.push('📈 Good momentum! You\'re building up nicely.');
        else if (words < 500) tips.push('🔥 Great progress! You\'re on a roll.');
        else                  tips.push('🏆 Impressive! That\'s a substantial piece.');

        if (sentences > 0) {
            const avg = words / sentences;
            if (avg > 25)     tips.push('✂️ Try shorter sentences for better readability.');
            else if (avg < 8) tips.push('💡 Consider combining some short sentences.');
            else              tips.push('✅ Sentence length looks great!');
        }

        if (paragraphs === 1 && words > 100) tips.push('📋 Break your text into paragraphs for better structure.');
        else if (paragraphs >= 3)            tips.push('📑 Well-structured with multiple paragraphs.');

        if (parseFloat(avgLen) > 7) tips.push('📚 You\'re using complex vocabulary — great!');
        if (passive > 3)            tips.push(`⚠️ ${passive} passive voice instances detected — consider active voice.`);
        if (longSents > 2)          tips.push(`📏 ${longSents} long sentences (30+ words) — consider splitting them.`);
    }
    insightsListEl.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

// ── Chart ─────────────────────────────────────────────────────────────────────
function initChart() {
    const ctx = document.getElementById('wordGrowthChart').getContext('2d');
    wordGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Words',
                data: [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.1)',
                borderWidth: 2,
                pointRadius: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { beginAtZero: true, ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(99,102,241,0.1)' } }
            },
            animation: { duration: 400 }
        }
    });
}

function updateChart() {
    if (!wordGrowthChart) return;
    wordGrowthChart.data.labels = wordGrowthData.map((_, i) => i + 1);
    wordGrowthChart.data.datasets[0].data = wordGrowthData;
    wordGrowthChart.update();
}

// ── Version History / Drafts ──────────────────────────────────────────────────
const MAX_DRAFTS = 10;

function saveDraft(content) {
    if (!content.trim()) return;
    const drafts = getDrafts();
    const entry = { content, savedAt: new Date().toISOString(), words: countWords(content) };
    // Avoid duplicate consecutive saves
    if (drafts.length > 0 && drafts[0].content === content) return;
    drafts.unshift(entry);
    if (drafts.length > MAX_DRAFTS) drafts.pop();
    localStorage.setItem('ms_drafts', JSON.stringify(drafts));
    updateDraftCount();
}

function getDrafts() {
    try { return JSON.parse(localStorage.getItem('ms_drafts') || '[]'); } catch { return []; }
}

function updateDraftCount() {
    const count = getDrafts().length;
    draftCountEl.textContent = count;
}

function openDrafts() {
    const drafts = getDrafts();
    if (drafts.length === 0) {
        draftsListEl.innerHTML = '<p class="no-drafts">No saved drafts yet. Save your work to create versions.</p>';
    } else {
        draftsListEl.innerHTML = drafts.map((d, i) => {
            const date = new Date(d.savedAt);
            const timeAgo = formatTimeAgo(date);
            const preview = d.content.substring(0, 80).replace(/\n/g, ' ') + (d.content.length > 80 ? '…' : '');
            return `<div class="draft-item" data-index="${i}">
                <div class="draft-meta">
                    <span class="draft-time">${timeAgo}</span>
                    <span class="draft-words">${d.words} words</span>
                </div>
                <p class="draft-preview">${preview}</p>
                <button class="draft-restore-btn" data-index="${i}">↩ Restore</button>
            </div>`;
        }).join('');
        draftsListEl.querySelectorAll('.draft-restore-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const draft = drafts[parseInt(btn.dataset.index)];
                if (confirm('Restore this version? Current text will be replaced.')) {
                    textArea.value = draft.content;
                    updateAll();
                    draftsModal.classList.remove('open');
                    showToast('↩ Draft restored!');
                }
            });
        });
    }
    draftsModal.classList.add('open');
}

function formatTimeAgo(date) {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60)   return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
    return date.toLocaleDateString();
}

function updateLastSavedTime() {
    const savedAt = localStorage.getItem('ms_savedAt');
    if (savedAt) {
        lastSavedTimeEl.textContent = 'Last saved: ' + formatTimeAgo(new Date(savedAt));
    }
    setTimeout(updateLastSavedTime, 30000);
}

// ── Focus Mode ────────────────────────────────────────────────────────────────
function enterFocusMode() {
    focusTextArea.value = textArea.value;
    focusOverlay.classList.add('active');
    focusMode = true;
    document.body.classList.add('focus-active');
    focusTextArea.focus();
    updateFocusStats();
}

function exitFocusMode() {
    textArea.value = focusTextArea.value;
    focusOverlay.classList.remove('active');
    focusMode = false;
    document.body.classList.remove('focus-active');
    updateAll();
    showToast('🧘 Focus mode exited');
}

function onFocusInput() {
    if (hardLimitChk.checked && focusTextArea.value.length > currentLimit) {
        focusTextArea.value = focusTextArea.value.substring(0, currentLimit);
    }
    updateFocusStats();
}

function updateFocusStats() {
    const words = countWords(focusTextArea.value);
    const chars = focusTextArea.value.length;
    const pct = currentLimit > 0 ? Math.min((chars / currentLimit) * 100, 100) : 0;
    focusStatsEl.textContent = `Words: ${words.toLocaleString()} · Chars: ${chars.toLocaleString()}`;
    focusProgressFill.style.width = pct + '%';
}

// ── Limit Change ──────────────────────────────────────────────────────────────
function onLimitChange() {
    const v = parseInt(charLimitInput.value);
    if (v && v >= 1 && v <= 100000) { currentLimit = v; updateAll(); }
}

// ── Copy ──────────────────────────────────────────────────────────────────────
function copyText() {
    if (!textArea.value) { showToast('⚠️ Nothing to copy!'); return; }
    navigator.clipboard.writeText(textArea.value)
        .then(() => showToast('✅ Copied to clipboard!'))
        .catch(() => { textArea.select(); document.execCommand('copy'); showToast('✅ Copied!'); });
}

// ── Clear ─────────────────────────────────────────────────────────────────────
function clearText() {
    if (!textArea.value) { showToast('⚠️ Already empty!'); return; }
    if (textArea.value.length > 50 && !confirm('Clear all text?')) return;
    saveDraft(textArea.value);
    textArea.value = '';
    updateAll();
    showToast('🗑️ Cleared! Draft saved.');
}

// ── Save ──────────────────────────────────────────────────────────────────────
function saveContent() {
    saveDraft(textArea.value);
    localStorage.setItem('ms_content', textArea.value);
    localStorage.setItem('ms_savedAt', new Date().toISOString());
    showSavedBadge();
    updateLastSavedTime();
    showToast('💾 Saved!');
}

function autoSave() {
    if (!textArea.value) return;
    saveDraft(textArea.value);
    localStorage.setItem('ms_content', textArea.value);
    localStorage.setItem('ms_savedAt', new Date().toISOString());
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
    if (size) { fontSizeSlider.value = size; textArea.style.fontSize = size + 'px'; fontSizeValEl.textContent = size + 'px'; }

    const family = localStorage.getItem('ms_fontFamily');
    if (family) { fontFamilySel.value = family; applyFont(); }

    const goal = localStorage.getItem('ms_dailyGoal');
    if (goal) { dailyGoal = parseInt(goal); dailyGoalInput.value = goal; }
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
        case 'upper':    result = text.toUpperCase(); showToast('🔠 UPPERCASE applied'); break;
        case 'lower':    result = text.toLowerCase(); showToast('🔡 lowercase applied'); break;
        case 'capitalize': result = text.replace(/\b\w/g, c => c.toUpperCase()); showToast('🔤 Capitalize Words applied'); break;
        case 'sentence': result = text.toLowerCase().replace(/(^\s*\w)/m, c => c.toUpperCase()).replace(/([.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase()); showToast('📝 Sentence case applied'); break;
        case 'toggle':   result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); showToast('🔀 Case toggled'); break;
    }
    textArea.value = result;
    updateAll();
}

// ── Speech ────────────────────────────────────────────────────────────────────
function setupSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { micBtn.disabled = true; micBtn.title = 'Speech not supported in this browser'; return; }
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = e => {
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
                let t = e.results[i][0].transcript.trim();
                // Voice commands
                if (/^new paragraph$/i.test(t)) { textArea.value += '\n\n'; }
                else if (/^comma$/i.test(t))    { textArea.value = textArea.value.trimEnd() + ', '; }
                else if (/^period$/i.test(t))   { textArea.value = textArea.value.trimEnd() + '. '; }
                else                            { final += t + ' '; }
            }
        }
        if (final) { textArea.value += final; updateAll(); }
    };

    recognition.onerror = () => { micBtn.classList.remove('listening'); showToast('❌ Speech error — try again'); };
    recognition.onend   = () => micBtn.classList.remove('listening');
}

function toggleSpeech() {
    if (!recognition) return;
    if (micBtn.classList.contains('listening')) {
        recognition.stop(); micBtn.classList.remove('listening'); showToast('🎤 Stopped listening');
    } else {
        recognition.start(); micBtn.classList.add('listening'); showToast('🎤 Listening… speak now');
    }
}

// ── Import ────────────────────────────────────────────────────────────────────
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'md', 'rtf'].includes(ext)) { showToast('❌ Only TXT, MD, RTF files supported'); fileInput.value = ''; return; }
    const reader = new FileReader();
    reader.onload = ev => {
        let content = ev.target.result;
        if (ext === 'rtf') content = stripRTF(content);
        if (textArea.value.length > 50 && !confirm('Replace existing content?')) { fileInput.value = ''; return; }
        textArea.value = content;
        updateAll();
        showToast(`📥 Imported ${file.name}`);
        fileInput.value = '';
    };
    reader.onerror = () => { showToast('❌ Failed to read file'); fileInput.value = ''; };
    reader.readAsText(file);
}

function stripRTF(rtf) {
    return rtf.replace(/\{\\[^{}]*\}/g, '').replace(/\\par\b/g, '\n').replace(/\\line\b/g, '\n')
              .replace(/\\tab\b/g, '\t').replace(/\\[a-z]+\-?\d*\s?/gi, '').replace(/[{}\\]/g, '')
              .replace(/\n{3,}/g, '\n\n').trim();
}

// ── Export ────────────────────────────────────────────────────────────────────
function exportFile(format) {
    if (!textArea.value) { showToast('⚠️ Nothing to export!'); return; }
    let content = textArea.value;
    let mime = 'text/plain';
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `mianscribe-${stamp}.${format}`;

    if (format === 'rtf')  { content = buildRTF(content); mime = 'application/rtf'; }
    if (format === 'html') { content = buildHTML(content); mime = 'text/html'; }

    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showToast(`📤 Exported as ${format.toUpperCase()}`);
}

function buildRTF(text) {
    const escaped = text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}')
                        .replace(/\n\n/g, '\\par\\par\n').replace(/\n/g, '\\par\n');
    return `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n\\f0\\fs24 ${escaped}\n}`;
}

function buildHTML(text) {
    const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const body = escaped.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g,'<br>')}</p>`).join('\n');
    return `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>MianScribe Export</title>\n<style>body{font-family:Georgia,serif;max-width:800px;margin:2rem auto;line-height:1.8;color:#1e1b4b}p{margin-bottom:1em}</style>\n</head>\n<body>\n${body}\n</body>\n</html>`;
}

// ── Keyboard Shortcuts ────────────────────────────────────────────────────────
function handleShortcuts(e) {
    if (e.key === 'F11') { e.preventDefault(); focusMode ? exitFocusMode() : enterFocusMode(); return; }
    if (e.key === 'Escape' && focusMode) { exitFocusMode(); return; }
    if (e.target.tagName === 'INPUT' && e.target !== textArea) return;
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && !e.shiftKey && e.key === 's') { e.preventDefault(); saveContent(); }
    if (ctrl && !e.shiftKey && e.key === 'e') { e.preventDefault(); exportFile('txt'); }
    if (ctrl && e.shiftKey && (e.key === 'c' || e.key === 'C')) { e.preventDefault(); copyText(); }
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
