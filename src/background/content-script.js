import csnEmbedded from 'url:../csn-embedded.js';

//inject script into page
const startupScript = document.createElement('script');
startupScript.src = csnEmbedded;
startupScript.defer = true;
document.body.appendChild(startupScript);

document.addEventListener('gotLinkFromCSN', (event) => {
    chrome.runtime.sendMessage(event.detail).catch(e => console.error(e));
});

chrome.runtime.onMessage.addListener(config => {
    document.dispatchEvent(new CustomEvent('startDownload', { detail: config }));
});
