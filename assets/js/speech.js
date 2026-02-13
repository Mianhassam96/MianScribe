/**
 * Speech Recognition Module
 * Handles Web Speech API integration for speech-to-text functionality
 */

let recognition = null;
let isListening = false;

/**
 * Initialize speech recognition
 * @param {HTMLTextAreaElement} textInput - The textarea element
 * @param {HTMLButtonElement} micBtn - The microphone button
 */
export function initSpeech(textInput, micBtn) {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        micBtn.disabled = true;
        micBtn.title = 'Speech recognition not supported in this browser';
        console.warn('Speech recognition not supported');
        return;
    }
    
    // Create recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = true;        // Keep listening until stopped
    recognition.interimResults = true;    // Show results as user speaks
    recognition.lang = 'en-US';          // Default language
    recognition.maxAlternatives = 1;      // Number of alternative transcriptions
    
    // Setup event listeners
    setupRecognitionEvents(textInput, micBtn);
    
    // Setup mic button click handler
    micBtn.addEventListener('click', () => toggleSpeech(micBtn));
}

/**
 * Setup recognition event handlers
 * @param {HTMLTextAreaElement} textInput - The textarea element
 * @param {HTMLButtonElement} micBtn - The microphone button
 */
function setupRecognitionEvents(textInput, micBtn) {
    let finalTranscript = '';
    
    // When recognition starts
    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        micBtn.querySelector('.btn-icon').textContent = '🔴';
        micBtn.querySelector('.btn-text').textContent = 'Stop';
        finalTranscript = textInput.value;
        console.log('Speech recognition started');
    };
    
    // When speech is recognized
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                // Add final results with space
                finalTranscript += transcript + ' ';
            } else {
                // Show interim results
                interimTranscript += transcript;
            }
        }
        
        // Update textarea with final + interim results
        textInput.value = finalTranscript + interimTranscript;
        
        // Trigger input event to update counters
        textInput.dispatchEvent(new Event('input'));
    };
    
    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopSpeech(micBtn);
        
        // Show user-friendly error messages
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            showToast('❌ Microphone permission denied');
        } else if (event.error === 'no-speech') {
            showToast('⚠️ No speech detected');
        } else if (event.error === 'network') {
            showToast('❌ Network error occurred');
        } else {
            showToast('❌ Speech error: ' + event.error);
        }
    };
    
    // When recognition ends
    recognition.onend = () => {
        if (isListening) {
            // Restart if still supposed to be listening
            try {
                recognition.start();
            } catch (e) {
                console.error('Failed to restart recognition:', e);
                stopSpeech(micBtn);
            }
        } else {
            console.log('Speech recognition ended');
        }
    };
}

/**
 * Toggle speech recognition on/off
 * @param {HTMLButtonElement} micBtn - The microphone button
 */
function toggleSpeech(micBtn) {
    if (isListening) {
        stopSpeech(micBtn);
        showToast('🛑 Stopped listening');
    } else {
        startSpeech(micBtn);
    }
}

/**
 * Start speech recognition
 * @param {HTMLButtonElement} micBtn - The microphone button
 */
function startSpeech(micBtn) {
    try {
        recognition.start();
        showToast('🎤 Listening... Speak now');
    } catch (e) {
        console.error('Failed to start speech recognition:', e);
        showToast('❌ Failed to start microphone');
    }
}

/**
 * Stop speech recognition
 * @param {HTMLButtonElement} micBtn - The microphone button
 */
function stopSpeech(micBtn) {
    isListening = false;
    micBtn.classList.remove('listening');
    micBtn.querySelector('.btn-icon').textContent = '🎤';
    micBtn.querySelector('.btn-text').textContent = 'Speak';
    
    if (recognition) {
        recognition.stop();
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
