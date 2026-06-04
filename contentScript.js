console.log('Content script running...');

function createSpeedIndicator() {
    let indicator = document.getElementById('yt-speed-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'yt-speed-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 18px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        `;
        document.documentElement.appendChild(indicator);
    }
    return indicator;
}

function showSpeedIndicator(speed) {
    const indicator = createSpeedIndicator();
    indicator.textContent = `Video Speed: ${speed}x`;
    indicator.style.opacity = '1';

    clearTimeout(indicator.fadeTimeout);
    indicator.fadeTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 1500);
}

function toggleSpeed(reset = false) {
    const video = document.querySelector('video');
    if (!video) {
        console.log('No video element found');
        return;
    }

    if (reset) {
        video.playbackRate = 1;
    } else {
        const currentSpeed = video.playbackRate;
        if (Math.abs(currentSpeed - 1) < 0.1) video.playbackRate = 1.25;
        else if (Math.abs(currentSpeed - 1.25) < 0.1) video.playbackRate = 1.5;
        else if (Math.abs(currentSpeed - 1.5) < 0.1) video.playbackRate = 1.75;
        else if (Math.abs(currentSpeed - 1.75) < 0.1) video.playbackRate = 2;
        else video.playbackRate = 1;
    }

    console.log('Playback speed now:', video.playbackRate);
    showSpeedIndicator(video.playbackRate);
    updateButtonState(video.playbackRate);
}

const bunnySvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rabbit"><path d="M13 16a3 3 0 0 1 2.24 5"></path><path d="M18 12h.01"></path><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"></path><path d="M20 8.54V4a2 2 0 1 0-4 0v3"></path><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"></path></svg>';

function updateButtonState(speed) {
    const toggleBtn = document.getElementById('yt-speed-toggle-btn');
    const resetBtn = document.getElementById('yt-speed-reset-btn');

    // Update Toggle Button (Bunny/Text)
    if (toggleBtn) {
        if (speed === 1) {
            toggleBtn.innerHTML = bunnySvg;
        } else {
            toggleBtn.innerHTML = `<span style="font-weight: bold; font-size: 13px; color: white; line-height: normal;">${speed}x</span>`;
        }
    }

    // Update Reset Button (Turtle) Visibility
    // Use display: none so the container shrinks/expands
    if (resetBtn) {
        resetBtn.style.display = (speed === 1) ? 'none' : 'inline-flex';
    }
}

function createButton(id, title, svgContent, onClick) {
    if (document.getElementById(id)) return null;

    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'ytp-button';
    btn.title = title;
    btn.innerHTML = svgContent;
    btn.style.opacity = '0.9';
    // Use flexbox to center content (SVG or Text)
    btn.style.display = 'inline-flex';
    btn.style.justifyContent = 'center';
    btn.style.alignItems = 'center';
    btn.style.verticalAlign = 'middle';
    btn.style.width = '48px';
    btn.onclick = onClick;
    return btn;
}

function addControlButtons() {
    const controls = document.querySelector('.ytp-right-controls');
    if (!controls) return;

    // Turtle Button (Reset)
    const turtleSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-turtle"><path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"></path><path d="M4.82 7.9 8 10"></path><path d="M15.18 7.9 12 10"></path><path d="M16.93 10H20a2 2 0 0 1 0 4H2"></path></svg>';
    const resetBtn = createButton('yt-speed-reset-btn', 'Reset Speed (1x)', turtleSvg, () => toggleSpeed(true));
    if (resetBtn) resetBtn.style.display = 'none'; // Default to hidden until non-1x speed is detected

    // Bunny Button (Toggle Speed)
    const toggleBtn = createButton('yt-speed-toggle-btn', 'Change Speed', bunnySvg, () => toggleSpeed(false));

    // Insert in order: Toggle (Bunny) then Reset (Turtle) so they appear as [Bunny] [Turtle] [Settings...]
    // We prepend Bunny then Turtle to get [Turtle] [Bunny]

    if (toggleBtn) {
        controls.insertBefore(toggleBtn, controls.firstChild);
        // Initialize state
        const video = document.querySelector('video');
        if (video) updateButtonState(video.playbackRate);
    }
    if (resetBtn) controls.insertBefore(resetBtn, controls.firstChild);
}

// Run on load
addControlButtons();

// Run on navigation (YouTube is SPA)
const observer = new MutationObserver(() => {
    addControlButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Keyboard shortcuts — handled directly in the content script (capture phase bypasses
// YouTube's stopPropagation). Covers QWERTY (KeyY) and QWERTZ (KeyZ) layouts.
//   Option+Y           → cycle speed
//   Option+Shift+Y     → reset to 1x
window.addEventListener('keydown', (e) => {
    if (!e.altKey || e.metaKey || e.ctrlKey) return;
    const isYKey = e.code === 'KeyY' || e.code === 'KeyZ';
    if (!isYKey) return;

    if (e.shiftKey) {
        e.preventDefault();
        toggleSpeed(true);  // reset
    } else {
        e.preventDefault();
        toggleSpeed(false); // cycle
    }
}, true);

// Fallback handler for executeScript-based dispatch from background
document.addEventListener('yt-speed-command', (e) => {
    const action = e.detail?.action;
    if (action === 'change_playback_speed') toggleSpeed(false);
    else if (action === 'reset_speed') toggleSpeed(true);
});
