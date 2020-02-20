chrome.storage.sync.get(['qualities', 'fallbacks'], async config => {
    //set default config
    if (!config.qualities || !config.fallbacks) {
        config = {
            qualities: ['320'],
            fallbacks: ['128'],
        };
        await new Promise(resolve => {
            chrome.storage.sync.set(config, () => resolve());
        });
    }

    chrome.browserAction.onClicked.addListener(tab => {
        chrome.tabs.sendMessage(tab.id, config);
    });

    chrome.runtime.onMessage.addListener(links => {
        const keys = Object.keys(links);
        const available = keys.join(' ');
        const download = keys.filter(key => config.qualities.includes(key)).join(' ');
        const fallbackDownload = keys.filter(key => config.fallbacks.includes(key)).join(' ');
        chrome.browserAction.setTitle({
            title: `Download: ${download || fallbackDownload || 'None'}\nAvailable: ${available || 'None'}`,
        });
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.qualities) config.qualities = changes.qualities.newValue;
        if (changes.fallbacks) config.fallbacks = changes.fallbacks.newValue;
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading')
        chrome.browserAction.setTitle({ title: 'Getting sources...' });
});
