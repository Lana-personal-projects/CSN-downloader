chrome.browserAction.onClicked.addListener(async function (tab) {
    chrome.tabs.executeScript(null, {file: "csn/CSN.js"});
});
chrome.runtime.onMessage.addListener(function (downloadAble) {
});
