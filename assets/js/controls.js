/**
 * Controls Module
 * Handle font size, line height, fullscreen, and distraction-free mode
 */

let isFullscreen = false;
let isDistractionFree = false;

/**
 * Initialize controls
 */
export function initControls() {
    setupFontControls();
    setupLineHeightControl();
    setupFontFamilyControl();
    setupFullscreenMode();
    setupDistractionFreeMode();
    setupHardLimitToggle();
    
    console.log('✓ Controls module initialized');
}

/**
 * Setup font size controls
 */
function setupFontControls() {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textInput = document.getElementById('textInput');
    
    if (!fontSizeSlider || !textInput) return;
    
    // Load saved font size
    const savedSize = localStorage.getItem('mianscribe-font-size') || '16';
    fontSizeSlider.value = savedSize;
    textInput.style.fontSize = `${savedSize}px`;
    if (fontSizeValue) fontSizeValue.textContent = `${savedSize}px`;
    
    // Update on change
    fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        textInput.style.fontSize = `${size}px`;
        if (fontSizeValue) fontSizeValue.textContent = `${size}px`;
        localStorage.setItem('mianscribe-font-size', size);
    });
}

/**
 * Setup line height control
 */
function setupLineHeightControl() {
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const lineHeightValue = document.getElementById('lineHeightValue');
    const textInput = document.getElementById('textInput');
    
    if (!lineHeightSlider || !textInput) return;
    
    // Load saved line height
    const savedHeight = localStorage.getItem('mianscribe-line-height') || '1.6';
    lineHeightSlider.value = savedHeight;
    textInput.style.lineHeight = savedHeight;
    if (lineHeightValue) lineHeightValue.textContent = savedHeight;
    
    // Update on change
    lineHeightSlider.addEventListener('input', (e) => {
        const height = e.target.value;
        textInput.style.lineHeight = height;
        if (lineHeightValue) lineHeightValue.textContent = height;
        localStorage.setItem('mianscribe-line-height', height);
    });
}

/**
 * Setup font family selector
 */
function setupFontFamilyControl() {
    const fontFamilySelect = document.getElementById('fontFamily');
    const textInput = document.getElementById('textInput');
    
    if (!fontFamilySelect || !textInput) return;
    
    // Load saved font family
    const savedFont = localStorage.getItem('mianscribe-font-family') || 'system';
    fontFamilySelect.value = savedFont;
    applyFontFamily(savedFont, textInput);
    
    // Update on change
    fontFamilySelect.addEventListener('change', (e) => {
        const font = e.target.value;
        applyFontFamily(font, textInput);
        localStorage.setItem('mianscribe-font-family', font);
    });
}

/**
 * Apply font family to textarea
 * @param {string} font - Font identifier
 * @param {HTMLElement} element - Element to apply font to
 */
function applyFontFamily(font, element) {
    const fonts = {
        'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'serif': 'Georgia, "Times New Roman", serif',
        'mono': '"Courier New", Courier, monospace',
        'sans': 'Arial, Helvetica, sans-serif'
    };
    
    element.style.fontFamily = fonts[font] || fonts['system'];
}

/**
 * Setup fullscreen mode
 */
function setupFullscreenMode() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!fullscreenBtn) return;
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

/**
 * Toggle fullscreen mode
 */
export function toggleFullscreen() {
    const container = document.querySelector('.container');
    const mainContent = document.querySelector('.main-content');
    
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        container.classList.add('fullscreen-mode');
        mainContent.classList.add('fullscreen-content');
        updateFullscreenButton('Exit Fullscreen');
    } else {
        container.classList.remove('fullscreen-mode');
        mainContent.classList.remove('fullscreen-content');
        updateFullscreenButton('Fullscreen');
    }
}

/**
 * Setup distraction-free mode
 */
function setupDistractionFreeMode() {
    const distractionBtn = document.getElementById('distractionBtn');
    
    if (!distractionBtn) return;
    
    distractionBtn.addEventListener('click', toggleDistractionFree);
}

/**
 * Toggle distraction-free mode
 */
export function toggleDistractionFree() {
    const header = document.querySelector('.header');
    const counterSection = document.querySelector('.counter-section');
    const controls = document.querySelector('.controls');
    const footer = document.querySelector('.footer');
    const analyticsPanel = document.querySelector('.analytics-panel');
    const toolbar = document.querySelector('.writing-toolbar');
    
    isDistractionFree = !isDistractionFree;
    
    const elements = [header, counterSection, controls, footer, analyticsPanel, toolbar];
    
    elements.forEach(el => {
        if (el) {
            if (isDistractionFree) {
                el.classList.add('hidden');
            } else {
                el.classList.remove('hidden');
            }
        }
    });
    
    // Update button text
    const btn = document.getElementById('distractionBtn');
    if (btn) {
        btn.textContent = isDistractionFree ? '👁️ Show Controls' : '🎯 Focus Mode';
    }
}

/**
 * Setup hard limit toggle
 */
function setupHardLimitToggle() {
    const hardLimitToggle = document.getElementById('hardLimitToggle');
    const textInput = document.getElementById('textInput');
    
    if (!hardLimitToggle || !textInput) return;
    
    // Load saved preference
    const savedPref = localStorage.getItem('mianscribe-hard-limit') === 'true';
    hardLimitToggle.checked = savedPref;
    
    hardLimitToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('mianscribe-hard-limit', enabled);
        
        if (enabled) {
            showToast('🔒 Hard limit enabled');
        } else {
            showToast('🔓 Hard limit disabled');
        }
    });
}

/**
 * Check if hard limit is enabled
 * @returns {boolean} Hard limit status
 */
export function isHardLimitEnabled() {
    const toggle = document.getElementById('hardLimitToggle');
    return toggle ? toggle.checked : false;
}

/**
 * Update fullscreen button text
 * @param {string} text - Button text
 */
function updateFullscreenButton(text) {
    const btn = document.getElementById('fullscreenBtn');
    if (btn) btn.textContent = text;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/**
 * Increase font size
 */
export function increaseFontSize() {
    const slider = document.getElementById('fontSizeSlider');
    if (slider) {
        const current = parseInt(slider.value);
        const newSize = Math.min(current + 2, 32);
        slider.value = newSize;
        slider.dispatchEvent(new Event('input'));
    }
}

/**
 * Decrease font size
 */
export function decreaseFontSize() {
    const slider = document.getElementById('fontSizeSlider');
    if (slider) {
        const current = parseInt(slider.value);
        const newSize = Math.max(current - 2, 12);
        slider.value = newSize;
        slider.dispatchEvent(new Event('input'));
    }
}
