/**
 * Analytics Module
 * Advanced text analysis: sentences, paragraphs, reading time, etc.
 */

/**
 * Analyze text and return comprehensive statistics
 * @param {string} text - Text to analyze
 * @returns {Object} Analytics data
 */
export function analyzeText(text) {
    return {
        sentences: countSentences(text),
        paragraphs: countParagraphs(text),
        readingTime: calculateReadingTime(text),
        longestSentence: findLongestSentence(text),
        averageWordLength: calculateAverageWordLength(text)
    };
}

/**
 * Count sentences in text
 * @param {string} text - Text to analyze
 * @returns {number} Sentence count
 */
export function countSentences(text) {
    if (!text.trim()) return 0;
    
    // Match sentences ending with . ! ? followed by space or end of string
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
}

/**
 * Count paragraphs in text
 * @param {string} text - Text to analyze
 * @returns {number} Paragraph count
 */
export function countParagraphs(text) {
    if (!text.trim()) return 0;
    
    // Split by double newlines or single newlines, filter empty
    const paragraphs = text.split(/\n\n+|\n/).filter(p => p.trim().length > 0);
    return paragraphs.length;
}

/**
 * Calculate reading time based on word count
 * @param {string} text - Text to analyze
 * @returns {Object} Reading time in minutes and seconds
 */
export function calculateReadingTime(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wordsPerMinute = 200; // Average reading speed
    
    const minutes = Math.floor(words / wordsPerMinute);
    const seconds = Math.round((words % wordsPerMinute) / wordsPerMinute * 60);
    
    return {
        minutes,
        seconds,
        total: words / wordsPerMinute,
        formatted: formatReadingTime(minutes, seconds)
    };
}

/**
 * Format reading time as human-readable string
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time
 */
function formatReadingTime(minutes, seconds) {
    if (minutes === 0 && seconds === 0) return '< 1 sec';
    if (minutes === 0) return `${seconds} sec`;
    if (seconds === 0) return `${minutes} min`;
    return `${minutes} min ${seconds} sec`;
}

/**
 * Find the longest sentence in text
 * @param {string} text - Text to analyze
 * @returns {Object} Longest sentence info
 */
export function findLongestSentence(text) {
    if (!text.trim()) return { length: 0, text: '' };
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length === 0) return { length: 0, text: '' };
    
    let longest = sentences[0];
    let maxWords = longest.trim().split(/\s+/).length;
    
    sentences.forEach(sentence => {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > maxWords) {
            maxWords = wordCount;
            longest = sentence;
        }
    });
    
    return {
        length: maxWords,
        text: longest.trim()
    };
}

/**
 * Calculate average word length
 * @param {string} text - Text to analyze
 * @returns {number} Average word length
 */
export function calculateAverageWordLength(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) return 0;
    
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return (totalLength / words.length).toFixed(1);
}

/**
 * Update analytics display
 * @param {Object} analytics - Analytics data
 */
export function updateAnalyticsDisplay(analytics) {
    // Update sentence count
    const sentenceEl = document.getElementById('sentenceCount');
    if (sentenceEl) sentenceEl.textContent = analytics.sentences.toLocaleString();
    
    // Update paragraph count
    const paragraphEl = document.getElementById('paragraphCount');
    if (paragraphEl) paragraphEl.textContent = analytics.paragraphs.toLocaleString();
    
    // Update reading time
    const readingTimeEl = document.getElementById('readingTime');
    if (readingTimeEl) readingTimeEl.textContent = analytics.readingTime.formatted;
    
    // Update average word length
    const avgWordLengthEl = document.getElementById('avgWordLength');
    if (avgWordLengthEl) avgWordLengthEl.textContent = analytics.averageWordLength;
    
    // Update longest sentence
    const longestSentenceEl = document.getElementById('longestSentence');
    if (longestSentenceEl) longestSentenceEl.textContent = `${analytics.longestSentence.length} words`;
}
