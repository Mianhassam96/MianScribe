/**
 * Utility Functions Module
 * Helper functions for copy, reset, and notifications
 */

/**
 * Copy text to clipboard
 * @param {HTMLTextAreaElement} textInput - The textarea element
 */
export function copyText(textInput) {
    const text = textInput.value;
    
    if (!text) {
        showToast('⚠️ Nothing to copy!');
        return;
    }
    
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('✅ Copied to clipboard!');
                console.log('Text copied successfully');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(textInput);
            });
    } else {
        // Fallback for older browsers
        fallbackCopy(textInput);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {HTMLTextAreaElement} textInput - The textarea element
 */
function fallbackCopy(textInput) {
    textInput.select();
    textInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('✅ Copied to clipboard!');
            console.log('Text copied using fallback method');
        } else {
            showToast('❌ Failed to copy text');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('❌ Failed to copy text');
    }
    
    // Remove selection
    window.getSelection().removeAllRanges();
}

/**
 * Reset all content
 * @param {HTMLTextAreaElement} textInput - The textarea element
 */
export function resetAll(textInput) {
    if (!textInput.value) {
        showToast('⚠️ Already empty!');
        return;
    }
    
    // Confirm reset if there's significant content
    if (textInput.value.length > 50) {
        const confirmed = confirm('Are you sure you want to clear all text?');
        if (!confirmed) {
            return;
        }
    }
    
    // Clear textarea
    textInput.value = '';
    
    // Trigger input event to update counters
    textInput.dispatchEvent(new Event('input'));
    
    // Focus textarea
    textInput.focus();
    
    showToast('✅ Text cleared!');
    console.log('Text reset');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    
    if (!toast) {
        console.error('Toast element not found');
        return;
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Future feature: Export to .txt file
/**
 * Export text content to a .txt file
 * @param {string} text - Text to export
 * @param {string} filename - Filename (default: 'mianscribe-export.txt')
 */
export function exportToFile(text, filename = 'mianscribe-export.txt') {
    // TODO: Implement file export functionality
    // Create blob and download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast('✅ File exported!');
}

// Future feature: Save to localStorage
/**
 * Save text to localStorage
 * @param {string} text - Text to save
 */
export function saveToLocalStorage(text) {
    // TODO: Implement auto-save functionality
    try {
        localStorage.setItem('mianscribe-autosave', text);
        localStorage.setItem('mianscribe-autosave-time', new Date().toISOString());
        console.log('Text auto-saved');
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

/**
 * Load text from localStorage
 * @returns {string|null} Saved text or null
 */
export function loadFromLocalStorage() {
    // TODO: Implement auto-load functionality
    try {
        return localStorage.getItem('mianscribe-autosave');
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
    }
}
