/**
 * Counter Module
 * Handles character counting, word counting, and progress tracking
 */

let currentLimit = 280;

/**
 * Initialize counter functionality
 * @param {HTMLTextAreaElement} textInput - The textarea element
 */
export function initCounter(textInput) {
    const charCountEl = document.getElementById('charCount');
    const wordCountEl = document.getElementById('wordCount');
    const remainingCountEl = document.getElementById('remainingCount');
    const charLimitInput = document.getElementById('charLimit');
    const progressBar = document.getElementById('progressBar');
    
    // Update counts on input
    textInput.addEventListener('input', (e) => {
        // Check hard limit
        const hardLimitToggle = document.getElementById('hardLimitToggle');
        if (hardLimitToggle && hardLimitToggle.checked) {
            if (e.target.value.length > currentLimit) {
                e.target.value = e.target.value.substring(0, currentLimit);
            }
        }
        
        updateCounts(textInput, charCountEl, wordCountEl, remainingCountEl, progressBar);
    });
    
    // Update limit when changed
    charLimitInput.addEventListener('input', (e) => {
        const newLimit = parseInt(e.target.value);
        
        // Validate limit
        if (newLimit && newLimit > 0 && newLimit <= 10000) {
            currentLimit = newLimit;
            updateCounts(textInput, charCountEl, wordCountEl, remainingCountEl, progressBar);
        }
    });
    
    // Prevent invalid input
    charLimitInput.addEventListener('keydown', (e) => {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
            (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
            (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
            (e.keyCode === 88 && (e.ctrlKey || e.metaKey))) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    // Initial update
    updateCounts(textInput, charCountEl, wordCountEl, remainingCountEl, progressBar);
}

/**
 * Update all counts and progress indicators
 */
function updateCounts(textInput, charCountEl, wordCountEl, remainingCountEl, progressBar) {
    const text = textInput.value;
    
    // Character count
    const charCount = text.length;
    charCountEl.textContent = charCount.toLocaleString();
    
    // Word count
    const wordCount = countWords(text);
    wordCountEl.textContent = wordCount.toLocaleString();
    
    // Remaining characters
    const remaining = currentLimit - charCount;
    remainingCountEl.textContent = remaining.toLocaleString();
    
    // Update progress bar
    updateProgressBar(charCount, progressBar);
    
    // Update remaining count color
    updateRemainingColor(remaining, remainingCountEl);
    
    // Update limit usage percentage
    updateLimitUsage(charCount);
    
    // Update progress bar aria attributes
    const percentage = Math.min((charCount / currentLimit) * 100, 100);
    progressBar.setAttribute('aria-valuenow', Math.round(percentage));
}

/**
 * Count words in text
 * @param {string} text - The text to count words in
 * @returns {number} Word count
 */
function countWords(text) {
    const trimmed = text.trim();
    if (trimmed === '') return 0;
    
    // Split by whitespace and filter empty strings
    const words = trimmed.split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

/**
 * Update progress bar width and color
 * @param {number} charCount - Current character count
 * @param {HTMLElement} progressBar - Progress bar element
 */
function updateProgressBar(charCount, progressBar) {
    const percentage = Math.min((charCount / currentLimit) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    
    // Update color based on percentage
    progressBar.classList.remove('warning', 'danger');
    
    if (percentage >= 100) {
        progressBar.classList.add('danger');
    } else if (percentage >= 90) {
        progressBar.classList.add('warning');
    }
}

/**
 * Update remaining count color based on limit
 * @param {number} remaining - Remaining characters
 * @param {HTMLElement} remainingCountEl - Remaining count element
 */
function updateRemainingColor(remaining, remainingCountEl) {
    const percentage = (remaining / currentLimit) * 100;
    
    if (remaining < 0) {
        remainingCountEl.style.color = 'var(--danger-color)';
    } else if (percentage <= 10) {
        remainingCountEl.style.color = 'var(--warning-color)';
    } else {
        remainingCountEl.style.color = 'var(--primary-color)';
    }
}

/**
 * Update limit usage percentage display
 * @param {number} charCount - Current character count
 */
function updateLimitUsage(charCount) {
    const limitUsageEl = document.getElementById('limitUsage');
    if (!limitUsageEl) return;
    
    const percentage = Math.min((charCount / currentLimit) * 100, 100);
    limitUsageEl.textContent = `${percentage.toFixed(1)}%`;
}

/**
 * Get current character limit
 * @returns {number} Current limit
 */
export function getCurrentLimit() {
    return currentLimit;
}
