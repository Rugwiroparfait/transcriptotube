// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add loading animation to forms with data-loading attribute
    const forms = document.querySelectorAll('form[data-loading="true"]');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            // Show loading overlay
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.classList.add('active');
            }
            
            // Disable submit button and show spinner
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
                
                // Store original text for later restoration if needed
                btn.dataset.originalText = originalText;
            }
        });
    });

    // Handle transcript timestamps
    const timestampLinks = document.querySelectorAll('.timestamp');
    timestampLinks.forEach(link => {
        link.addEventListener('click', function() {
            const seconds = parseFloat(this.dataset.time || 0);
            seekVideo(seconds);
        });
    });

    // Add animation to transcript entries
    animateTranscriptEntries();
});

/**
 * Seek the YouTube video to a specific timestamp
 * @param {number} seconds - The timestamp in seconds
 */
function seekVideo(seconds) {
    const videoFrame = document.querySelector('iframe[src*="youtube"]');
    if (videoFrame && videoFrame.contentWindow) {
        // Format the YouTube player URL with enablejsapi=1 if not already present
        let src = videoFrame.src;
        if (!src.includes('enablejsapi=1')) {
            src = src + (src.includes('?') ? '&' : '?') + 'enablejsapi=1';
            videoFrame.src = src;
        }

        // Use the iframe API to seek to the timestamp
        videoFrame.contentWindow.postMessage(JSON.stringify({
            'event': 'command',
            'func': 'seekTo',
            'args': [seconds, true]
        }), '*');
    }
}

/**
 * Add staggered animation to transcript entries
 */
function animateTranscriptEntries() {
    const entries = document.querySelectorAll('.transcript-entry');
    entries.forEach((entry, index) => {
        // Set a delay based on the index for a staggered effect
        setTimeout(() => {
            entry.classList.add('fade-in');
        }, index * 50); // 50ms delay between each entry
    });
}

/**
 * Copy transcript text to clipboard with selected format
 */
function copyTranscript() {
    const text = getTranscriptText();
    
    // Copy to clipboard
    if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Transcript copied to clipboard!');
            })
            .catch(() => {
                showToast('Failed to copy. Please try again.', 'error');
            });
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, etc.)
 */
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    
    // Initialize and show the toast
    if (typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
        // Remove toast element after it's hidden
        toastEl.addEventListener('hidden.bs.toast', function() {
            toastEl.remove();
        });
    }
}

// Handle transcript editor UI
document.addEventListener('DOMContentLoaded', function() {
    initTranscriptEditor();
    initTranscriptControls();
    
    // Initialize timestamp click handlers
    const timestampBtns = document.querySelectorAll('.timestamp-btn');
    timestampBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const time = parseFloat(this.dataset.time);
            seekVideo(time);
        });
    });
});

/**
 * Initialize transcript editor functionality
 */
function initTranscriptEditor() {
    const editToggle = document.getElementById('edit-toggle');
    if (editToggle) {
        editToggle.addEventListener('click', function() {
            const editableTexts = document.querySelectorAll('.editable-text');
            const isEditable = editableTexts[0]?.getAttribute('contenteditable') === 'true';
            
            editableTexts.forEach(el => {
                el.setAttribute('contenteditable', !isEditable);
                el.classList.toggle('border-info', !isEditable);
            });
            
            // Update button text
            if (isEditable) {
                editToggle.innerHTML = '<i class="bi bi-pencil me-1"></i> Edit Mode';
            } else {
                editToggle.innerHTML = '<i class="bi bi-check-lg me-1"></i> Editing';
                showToast('Editing mode enabled. Click on text to edit.', 'info');
            }
        });
    }
}

/**
 * Initialize transcript control buttons
 */
function initTranscriptControls() {
    // Copy transcript button
    const copyBtn = document.getElementById('copy-transcript');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyTranscript();
        });
    }
    
    // Download transcript button
    const downloadBtn = document.getElementById('download-transcript');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadTranscript();
        });
    }
    
    // Save edited transcript
    const saveBtn = document.getElementById('save-transcript');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveEditedTranscript();
        });
    }
}

/**
 * Download transcript with selected format
 */
function downloadTranscript() {
    const formatSelect = document.getElementById('transcript-format');
    const format = formatSelect ? formatSelect.value : 'paragraphs';
    let filename = 'transcript.txt';
    
    if (format === 'markdown') {
        filename = 'transcript.md';
    }
    
    const text = getTranscriptText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Transcript downloaded successfully!');
}