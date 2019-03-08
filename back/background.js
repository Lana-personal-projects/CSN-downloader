chrome.browserAction.onClicked.addListener(async function (tab) {
    chrome.tabs.executeScript(null, {file: "csn/download.js"});
});

//links flow: page -> csn/getLink.js -> back/contentScript.js -> here
chrome.runtime.onMessage.addListener(function (links, sender, callback) {
    let title = 'Downloadable: ';
    for (const key in links) {
        title += key + ', '
    }
    chrome.browserAction.setTitle({
        title: title
    });
});
