console.log('Content script running...');
var video = document.querySelector('video'); // Get the video element

if (!video) console.log('No video element found');
else {
    console.log('Video element found:', video);
    if (video.playbackRate === 1) video.playbackRate = 1.5; // Change playback speed
    else video.playbackRate = 1;
    console.log('Playback speed now:', video.playbackRate);
}
