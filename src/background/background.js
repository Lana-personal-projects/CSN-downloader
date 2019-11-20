chrome.browserAction.onClicked.addListener(async (tab) => {
    chrome.tabs.executeScript(null, {file: "src/csn/download.js"});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        chrome.browserAction.setTitle({
            title: 'Getting sources...'
        });
    }
});

//links flow: page -> csn/get-link.js -> background/content-script.js -> here
chrome.runtime.onMessage.addListener((links, sender, callback) => {
    let title = '';
    if (links !== {}) {
        for (const key in links) {
            title += key + ', '
        }
    }
    if (title === '') {
        title = 'None'
    }
    chrome.browserAction.setTitle({
        title: 'Downloadable: ' + title
    });
});

