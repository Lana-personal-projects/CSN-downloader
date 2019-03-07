chrome.browserAction.onClicked.addListener(async function (tab) {
    chrome.tabs.executeScript(null, {file: "CSN.js"});
});
