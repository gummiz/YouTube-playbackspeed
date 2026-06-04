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
    // Query the active YouTube tab across all windows (handles Arc spaces etc.)
    chrome.tabs.query({ url: '*://*.youtube.com/*', active: true }, (tabs) => {
        if (tabs.length > 0) {
            dispatchToTab(tabs[0].id, command);
            return;
        }
        // Fallback: any YouTube tab
        chrome.tabs.query({ url: '*://*.youtube.com/*' }, (allTabs) => {
            if (!allTabs[0]) { console.error('No YouTube tab found'); return; }
            dispatchToTab(allTabs[0].id, command);
        });
    });
});
