console.log("Background script running - v3");

function dispatchToTab(tabId, action) {
    chrome.scripting.executeScript({
        target: { tabId },
        func: (action) => {
            document.dispatchEvent(new CustomEvent('yt-speed-command', { detail: { action } }));
        },
        args: [action]
    }).catch(err => console.error('executeScript failed:', err));
}

chrome.action.onClicked.addListener((tab) => {
    dispatchToTab(tab.id, 'change_playback_speed');
});

chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) { console.error('No active tab found'); return; }
        dispatchToTab(tabs[0].id, command);
    });
});
