chrome.browserAction.onClicked.addListener(async function (tab) {
    chrome.tabs.executeScript(null, {file: "csn/download.js"});
});

//links flow: page -> csn/getLink.js -> back/contentScript.js -> here
chrome.runtime.onMessage.addListener(function (links) {

});
