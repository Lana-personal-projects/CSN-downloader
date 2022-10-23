//inject script into page
const startupScript = document.createElement('script');
startupScript.src = chrome.runtime.getURL('src/csn-embedded.js');
startupScript.defer = true;
document.body.appendChild(startupScript);

document.addEventListener('gotLinkFromCSN', (event) => {
    chrome.runtime.sendMessage(event.detail).catch(e => console.error(e));
});

chrome.runtime.onMessage.addListener(config => {
    document.dispatchEvent(new CustomEvent('startDownload', { detail: config }));
});
