/**
 * Storage Module
 * Handle auto-save, restore, and localStorage management
 */

const STORAGE_KEY = 'mianscribe-content';
const TIMESTAMP_KEY = 'mianscribe-timestamp';
const AUTO_SAVE_INTERVAL = 3000; // 3 seconds

let autoSaveTimer = null;

/**
 * Initialize storage functionality
 * @param {HTMLTextAreaElement} textInput - Textarea element
 */
export function initStorage(textInput) {
    // Restore saved content on load
    restoreContent(textInput);
    
    // Setup auto-save
    setupAutoSave(textInput);
    
    console.log('✓ Storage module initialized');
}

/**
 * Setup auto-save functionality
 * @param {HTMLTextAreaElement} textInput - Textarea element
 */
function setupAutoSave(textInput) {
    textInput.addEventListener('input', () => {
        // Clear existing timer
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        
        // Set new timer
        autoSaveTimer = setTimeout(() => {
            saveContent(textInput.value);
        }, AUTO_SAVE_INTERVAL);
    });
}

/**
 * Save content to localStorage
 * @param {string} content - Content to save
 */
export function saveContent(content) {
    try {
        localStorage.setItem(STORAGE_KEY, content);
        localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
        console.log('Content auto-saved');
        
        // Update last saved indicator
        updateLastSavedIndicator();
    } catch (e) {
        console.error('Failed to save content:', e);
    }
}

/**
 * Restore content from localStorage
 * @param {HTMLTextAreaElement} textInput - Textarea element
 */
export function restoreContent(textInput) {
    try {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        const timestamp = localStorage.getItem(TIMESTAMP_KEY);
        
        if (savedContent) {
            // Ask user if they want to restore
            const restore = confirm(
                `Found saved content from ${formatTimestamp(timestamp)}.\n\nRestore it?`
            );
            
            if (restore) {
                textInput.value = savedContent;
                textInput.dispatchEvent(new Event('input'));
                console.log('Content restored');
            }
        }
    } catch (e) {
        console.error('Failed to restore content:', e);
    }
}

/**
 * Clear saved content
 */
export function clearSavedContent() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
        console.log('Saved content cleared');
        updateLastSavedIndicator();
    } catch (e) {
        console.error('Failed to clear content:', e);
    }
}

/**
 * Get last saved timestamp
 * @returns {string|null} Timestamp or null
 */
export function getLastSavedTime() {
    return localStorage.getItem(TIMESTAMP_KEY);
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Update last saved indicator in UI
 */
function updateLastSavedIndicator() {
    const indicator = document.getElementById('lastSaved');
    if (!indicator) return;
    
    const timestamp = getLastSavedTime();
    if (timestamp) {
        indicator.textContent = `Last saved: ${formatTimestamp(timestamp)}`;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

/**
 * Manual save with feedback
 * @param {string} content - Content to save
 */
export function manualSave(content) {
    saveContent(content);
    
    // Show toast notification
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = '✅ Content saved!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}
