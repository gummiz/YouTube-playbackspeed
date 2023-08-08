chrome.commands.onCommand.addListener(function(command) {
    console.log('Command received:', command); 
    if (command === 'change_playback_speed') {
        console.log('Attempting to change playback speed...');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['contentScript.js']
            });
        });
    }
});
