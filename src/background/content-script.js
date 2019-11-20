//inject script into page
const startupScript = document.createElement('script');
startupScript.src = chrome.runtime.getURL('src/csn-embedded/get-link.js');
document.body.appendChild(startupScript);

document.addEventListener('gotLinkFromCSN', (event) => {
    chrome.runtime.sendMessage(event.detail)
});
