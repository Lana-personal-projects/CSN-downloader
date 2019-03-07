chrome.browserAction.onclicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, {file: "CSN.js"});
})
;