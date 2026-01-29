console.log("Background script running - v2");

// Check what commands are registered
chrome.commands.getAll((commands) => {
    console.log('Registered commands:', commands);
});

// Fallback: Click the extension icon to trigger speed change (for debugging)
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked on tab:', tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'change_playback_speed' })
        .catch(err => console.error('Icon click failed:', err));
});

chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command);
    if (command === 'reset_speed') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tab = tabs[0];
            console.log('Found active tab:', tab);

            if (!tab) {
                console.error('No active tab found');
                return;
            }

            // Attempt to send message regardless of URL check (content script will handle it or it will fail if not injected)
            console.log('Attempting to send message to tab:', tab.id);

            chrome.tabs.sendMessage(tab.id, {
                action: command
            }).then(() => {
                console.log('Message sent successfully to tab', tab.id);
            }).catch(err => {
                console.error('Failed to send message. Is the content script loaded?', err);
            });
        });
    }
});
