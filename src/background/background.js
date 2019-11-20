chrome.storage.sync.get(['qualities', 'fallbacks'], config => {
    config.qualities = config.qualities || [];
    config.fallbacks = config.fallbacks || [];

    chrome.browserAction.onClicked.addListener((tab) => {
        chrome.tabs.executeScript(tab.id, {file: 'src/csn-embedded/download.js'});
    });

    chrome.runtime.onMessage.addListener((links) => {
        const keys = Object.keys(links);
        const available = keys.join(' ');
        const download = keys.filter(key => config.qualities.includes(key)).join(' ');
        const fallbackDownload = keys.filter(key => config.fallbacks.includes(key)).join(' ');
        chrome.browserAction.setTitle({
            title: `Download: ${download || fallbackDownload || 'None'}\nAvailable: ${available || 'None'}`
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading')
        chrome.browserAction.setTitle({title: 'Getting sources...'});
});
