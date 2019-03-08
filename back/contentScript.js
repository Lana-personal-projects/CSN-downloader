let startupScript = document.createElement('script');
startupScript.src = chrome.runtime.getURL('csn/getLink.js');
document.body.appendChild(startupScript);

//check csn/getLink.js
document.addEventListener('gotLinkFromCSN', function (event) {
    const links = event.detail;
    console.log(links);
    chrome.runtime.sendMessage(links)
});


//https://stackoverflow.com/questions/10052259/accessing-global-object-from-content-script-in-chrome-extension
//https://stackoverflow.com/questions/9602022/chrome-extension-retrieving-global-variable-from-webpage/9636008#9636008
//https://stackoverflow.com/questions/9915311/chrome-extension-code-vs-content-scripts-vs-injected-scripts/9916089#9916089
//https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879