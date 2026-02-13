/**
 * Theme Management Module
 * Handles dark mode toggle and persistence using localStorage
 */

const THEME_KEY = 'mianscribe-theme';

/**
 * Initialize theme functionality
 */
export function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Load saved theme
    loadTheme();
    
    // Update icon based on current theme
    updateThemeIcon(themeIcon);
    
    // Setup toggle listener
    themeToggle.addEventListener('click', () => {
        toggleTheme();
        updateThemeIcon(themeIcon);
    });
}

/**
 * Load theme from localStorage or system preference
 */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        // No saved preference - check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    
    console.log(`Theme switched to: ${isDark ? 'dark' : 'light'}`);
}

/**
 * Update theme toggle icon
 * @param {HTMLElement} themeIcon - The theme icon element
 */
function updateThemeIcon(themeIcon) {
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

/**
 * Get current theme
 * @returns {string} Current theme ('light' or 'dark')
 */
export function getCurrentTheme() {
    return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a manual preference
        const savedTheme = localStorage.getItem(THEME_KEY);
        
        if (savedTheme === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            // Update icon
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                updateThemeIcon(themeIcon);
            }
        }
    });
}
