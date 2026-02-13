/**
 * Export Module
 * Handle exporting content to various formats
 */

/**
 * Export content as .txt file
 * @param {string} content - Content to export
 * @param {string} filename - Filename (optional)
 */
export function exportAsTxt(content, filename = 'mianscribe-document.txt') {
    if (!content.trim()) {
        showToast('⚠️ Nothing to export!');
        return;
    }
    
    downloadFile(content, filename, 'text/plain');
    showToast('✅ Exported as TXT!');
}

/**
 * Export content as .md (Markdown) file
 * @param {string} content - Content to export
 * @param {string} filename - Filename (optional)
 */
export function exportAsMd(content, filename = 'mianscribe-document.md') {
    if (!content.trim()) {
        showToast('⚠️ Nothing to export!');
        return;
    }
    
    // Add markdown metadata
    const timestamp = new Date().toISOString();
    const markdown = `---
title: MianScribe Document
date: ${timestamp}
---

${content}
`;
    
    downloadFile(markdown, filename, 'text/markdown');
    showToast('✅ Exported as Markdown!');
}

/**
 * Export content as .rtf (Rich Text Format) file
 * @param {string} content - Content to export
 * @param {string} filename - Filename (optional)
 */
export function exportAsRtf(content, filename = 'mianscribe-document.rtf') {
    if (!content.trim()) {
        showToast('⚠️ Nothing to export!');
        return;
    }
    
    // Convert plain text to RTF format
    const rtfContent = convertToRtf(content);
    
    downloadFile(rtfContent, filename, 'application/rtf');
    showToast('✅ Exported as RTF!');
}

/**
 * Convert plain text to RTF format
 * @param {string} text - Plain text
 * @returns {string} RTF formatted text
 */
function convertToRtf(text) {
    // Basic RTF structure
    const rtfHeader = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}';
    const rtfBody = text
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\n/g, '\\par\n');
    const rtfFooter = '}';
    
    return rtfHeader + '\n' + rtfBody + '\n' + rtfFooter;
}

/**
 * Generic file download function
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
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
    }, 3000);
}

/**
 * Copy content to clipboard
 * @param {string} content - Content to copy
 */
export function copyToClipboard(content) {
    if (!content.trim()) {
        showToast('⚠️ Nothing to copy!');
        return;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content)
            .then(() => {
                showToast('✅ Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                showToast('❌ Failed to copy');
            });
    } else {
        showToast('❌ Clipboard not supported');
    }
}
