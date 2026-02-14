/**
 * MianScribe Pro - Main Application Entry Point
 * Advanced writing assistant with analytics, export, and controls
 */

import { initCounter } from './counter.js';
import { initSpeech } from './speech.js';
import { initTheme } from './theme.js';
import { copyText, resetAll } from './utils.js';
import { analyzeText, updateAnalyticsDisplay } from './analytics.js';
import { initStorage, manualSave, clearSavedContent } from './storage.js';
import { exportAsTxt, exportAsMd, exportAsRtf } from './export.js';
import { initControls, toggleFullscreen, toggleDistractionFree, increaseFontSize, decreaseFontSize } from './controls.js';

// DOM Elements
const textInput = document.getElementById('textInput');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const micBtn = document.getElementById('micBtn');

/**
 * Initialize all application modules
 */
function init() {
    console.log('🚀 MianScribe Pro initializing...');
    
    try {
        // Initialize core modules
        initCounter(textInput);
        console.log('✓ Counter module loaded');
        
        initSpeech(textInput, micBtn);
        console.log('✓ Speech module loaded');
        
        initTheme();
        console.log('✓ Theme module loaded');
        
        // Initialize new pro modules
        initStorage(textInput);
        console.log('✓ Storage module loaded');
        
        initControls();
        console.log('✓ Controls module loaded');
        
        // Setup analytics updates
        setupAnalytics();
        console.log('✓ Analytics module loaded');
        
        // Setup event listeners
        setupEventListeners();
        console.log('✓ Event listeners attached');
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        console.log('✓ Keyboard shortcuts enabled');
        
        // Focus textarea on load
        textInput.focus();
        
        console.log('✅ MianScribe Pro ready!');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

/**
 * Setup analytics updates
 */
function setupAnalytics() {
    textInput.addEventListener('input', () => {
        const analytics = analyzeText(textInput.value);
        updateAnalyticsDisplay(analytics);
        updateQuickStats(analytics);
    });
    
    // Initial analytics
    const analytics = analyzeText(textInput.value);
    updateAnalyticsDisplay(analytics);
    updateQuickStats(analytics);
}

/**
 * Update quick stats in header
 */
function updateQuickStats(analytics) {
    const quickWordCount = document.getElementById('quickWordCount');
    const quickReadTime = document.getElementById('quickReadTime');
    
    if (quickWordCount) {
        quickWordCount.textContent = analytics.words || 0;
    }
    
    if (quickReadTime) {
        const readingTime = analytics.readingTime || '0s';
        quickReadTime.textContent = readingTime;
    }
}

/**
 * Setup button event listeners
 */
function setupEventListeners() {
    // Basic controls
    if (copyBtn) copyBtn.addEventListener('click', () => copyText(textInput));
    if (resetBtn) resetBtn.addEventListener('click', () => resetAll(textInput));
    
    // Export buttons
    const exportTxtBtn = document.getElementById('exportTxt');
    const exportMdBtn = document.getElementById('exportMd');
    const exportRtfBtn = document.getElementById('exportRtf');
    
    if (exportTxtBtn) exportTxtBtn.addEventListener('click', () => exportAsTxt(textInput.value));
    if (exportMdBtn) exportMdBtn.addEventListener('click', () => exportAsMd(textInput.value));
    if (exportRtfBtn) exportRtfBtn.addEventListener('click', () => exportAsRtf(textInput.value));
    
    // Storage buttons
    const saveBtn = document.getElementById('saveBtn');
    const clearSavedBtn = document.getElementById('clearSavedBtn');
    
    if (saveBtn) saveBtn.addEventListener('click', () => manualSave(textInput.value));
    if (clearSavedBtn) {
        clearSavedBtn.addEventListener('click', () => {
            if (confirm('Clear all saved data?')) {
                clearSavedContent();
                showToast('✅ Saved data cleared');
            }
        });
    }
    
    // Mode toggles
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const distractionBtn = document.getElementById('distractionBtn');
    
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (distractionBtn) distractionBtn.addEventListener('click', toggleDistractionFree);
    
    // Analytics panel toggle
    const toggleAnalyticsBtn = document.getElementById('toggleAnalytics');
    const closeAnalyticsBtn = document.getElementById('closeAnalytics');
    
    if (toggleAnalyticsBtn) {
        toggleAnalyticsBtn.addEventListener('click', () => {
            const panel = document.querySelector('.analytics-panel');
            if (panel) {
                panel.classList.toggle('collapsed');
            }
        });
    }
    
    if (closeAnalyticsBtn) {
        closeAnalyticsBtn.addEventListener('click', () => {
            const panel = document.querySelector('.analytics-panel');
            if (panel) {
                panel.classList.add('collapsed');
            }
        });
    }
    
    // Preset limit buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const limit = btn.getAttribute('data-limit');
            const charLimitInput = document.getElementById('charLimit');
            if (charLimitInput && limit) {
                charLimitInput.value = limit;
                charLimitInput.dispatchEvent(new Event('input'));
            }
        });
    });
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts if user is typing in an input (except textarea)
        if (e.target.tagName === 'INPUT' && e.target.id !== 'textInput') {
            return;
        }
        
        // Ctrl/Cmd + Shift + C for copy
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyText(textInput);
        }
        
        // Ctrl/Cmd + Shift + R for reset
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            resetAll(textInput);
        }
        
        // Ctrl/Cmd + S for save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            manualSave(textInput.value);
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportAsTxt(textInput.value);
        }
        
        // Ctrl/Cmd + D for distraction-free
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleDistractionFree();
        }
        
        // Ctrl/Cmd + = for increase font
        if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
            e.preventDefault();
            increaseFontSize();
        }
        
        // Ctrl/Cmd + - for decrease font
        if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            decreaseFontSize();
        }
        
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
export function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
