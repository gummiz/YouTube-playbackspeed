
console.log('Content script running...');
const video = document.querySelector('video');

function createSpeedIndicator() {
    let indicator = document.getElementById('yt-speed-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'yt-speed-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
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
    indicator.textContent = `${speed}x`;
    indicator.style.opacity = '1';

    clearTimeout(indicator.fadeTimeout);
    indicator.fadeTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 1500);
}

if (!video) {
    console.log('No video element found');
} else {
    console.log('Video element found:', video);
    // if (video.playbackRate === 1) {
    //     video.playbackRate = 1.5;
    // } else {
    //     video.playbackRate = 1;
    // }
    console.log('Playback speed now:', video.playbackRate);
    showSpeedIndicator(video.playbackRate);
}
