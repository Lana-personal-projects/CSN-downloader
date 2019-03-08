chrome.browserAction.onClicked.addListener(async function (tab) {
    chrome.tabs.executeScript(null, {file: "csn/download.js"});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        chrome.browserAction.setTitle({
            title: 'Getting sources...'
        });
    }
});

//links flow: page -> csn/getLink.js -> back/contentScript.js -> here
chrome.runtime.onMessage.addListener(function (links, sender, callback) {
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

