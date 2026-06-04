console.log("Background script running - DEBUG");

function badge(text, color) {
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: color || '#e74c3c' });
}

function dispatchToTab(tabId, action) {
    badge('INJ', '#e67e22');
    chrome.scripting.executeScript({
        target: { tabId },
        func: (action) => {
            // Signal the content script received the injection
            const el = document.createElement('div');
            el.id = '__yt_debug__';
            el.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999999;background:orange;color:black;padding:8px 12px;font-size:14px;border-radius:4px;';
            el.textContent = '⚡ executeScript fired: ' + action;
            document.documentElement.appendChild(el);
            setTimeout(() => el.remove(), 3000);

            document.dispatchEvent(new CustomEvent('yt-speed-command', { detail: { action } }));
        },
        args: [action]
    }).then(() => {
        badge('OK', '#27ae60');
    }).catch(err => {
        console.error('executeScript failed:', err);
        badge('ERR', '#e74c3c');
    });
}

chrome.action.onClicked.addListener((tab) => {
    badge('CLK', '#2980b9');
    dispatchToTab(tab.id, 'change_playback_speed');
});

chrome.commands.onCommand.addListener((command) => {
    console.log('onCommand fired:', command);
    badge('CMD', '#8e44ad'); // Purple = command received by background

    chrome.tabs.query({ url: '*://*.youtube.com/*', active: true }, (tabs) => {
        console.log('Active YouTube tabs found:', tabs.length, tabs.map(t => t.id + ' ' + t.url));
        if (tabs.length > 0) {
            badge('TAB', '#2980b9'); // Blue = tab found
            dispatchToTab(tabs[0].id, command);
            return;
        }
        // Fallback: any YouTube tab
        chrome.tabs.query({ url: '*://*.youtube.com/*' }, (allTabs) => {
            console.log('All YouTube tabs found:', allTabs.length);
            if (!allTabs[0]) {
                console.error('No YouTube tab found');
                badge('!YT', '#e74c3c');
                return;
            }
            badge('FB', '#e67e22'); // Orange = fallback tab
            dispatchToTab(allTabs[0].id, command);
        });
    });
});
