console.log("running");

chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command);
    if (command === 'change_playback_speed' || command === 'reset_playback_speed') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabs[0]) {
                console.error('No active tab found');
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleSpeed,
                args: [command === 'reset_playback_speed']
            });
        });
    }
});

function toggleSpeed(reset = false) {
    const video = document.querySelector('video');
    if (!video) return;

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

    indicator.textContent = `Video Speed: ${video.playbackRate}x`;
    indicator.style.opacity = '1';

    clearTimeout(indicator.fadeTimeout);
    indicator.fadeTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 1500);
}
