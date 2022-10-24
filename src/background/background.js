let config = {
  qualities: ["128", "320", "flac"],
  fallbacks: []
};

chrome.storage.sync.get(["qualities", "fallbacks"], async (conf) => {
  //set default config
  if (!conf.qualities || !conf.fallbacks) {
    conf = { ...config, ...conf };
    await new Promise(resolve => {
      chrome.storage.sync.set(conf, () => resolve());
    });
    return;
  }
  config = conf;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.qualities) config.qualities = changes.qualities.newValue;
  if (changes.fallbacks) config.fallbacks = changes.fallbacks.newValue;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading") return;
  chrome.action.setTitle({ title: "Getting sources..." });
});

chrome.action.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, { type: "startDownload", detail: config });
});

chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  const handler = handlers[event.type];
  console.debug(event);
  handler(event.detail, sendResponse, sender);
  return true;
});

const handlers = {
  gotLinkFromCSN(links, sendResponse) {
    const keys = Object.keys(links);
    const available = keys.join(" ");
    const download = keys.filter(key => config.qualities.includes(key)).join(" ");
    const fallbackDownload = keys.filter(key => config.fallbacks.includes(key)).join(" ");
    chrome.action.setTitle({
      title: `Download: ${download || fallbackDownload || "None"}\nAvailable: ${available || "None"}`
    });
    sendResponse({ forward: false });
  },
  async testLinkCSN(link, sendResponse) {
    console.log(link);
    const res = await fetch(link, { method: "HEAD", redirect: "error" })
      .catch(e => {
        console.log(link, e);
        return { ok: false };
      });
    sendResponse({ type: "testLinkCSNResult", detail: { link, result: res.ok } });
  }
};
