//inject script into page
const startupScript = document.createElement("script");
startupScript.src = chrome.runtime.getURL("src/csn-embedded.js");
document.body.appendChild(startupScript);

document.addEventListener("gotLinkFromCSN", (event) => {
    chrome.runtime.sendMessage(event.detail);
});

chrome.runtime.onMessage.addListener(config => {
    document.dispatchEvent(new CustomEvent("startDownload", {detail: config}))
});
