import csnEmbedded from "url:../csn-embedded.js";

// inject script into page
const startupScript = document.createElement("script");
startupScript.src = csnEmbedded;
startupScript.defer = true;
document.body.appendChild(startupScript);

// setup event to injected script forwarding
chrome.runtime.onMessage.addListener(event => {
  document.dispatchEvent(new CustomEvent(event.type, event));
});

forwardEvent(["gotLinkFromCSN", "testLinkCSN"]);

function forwardEvent(types) {
  types.forEach(type => {
    document.addEventListener(type, (event) => {
      chrome.runtime.sendMessage({ type: event.type, detail: event.detail }, (response) => {
        if (response?.forward === false) return;
        const type = response?.type || type;
        document.dispatchEvent(new CustomEvent(type, { ...response, type }));
      });
    });
  });
}
