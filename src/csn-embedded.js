// inject this script into page to access page's js object (player) and communicate
// with background via content-script by an event
// put this into function to avoid conflict with page's js
(async () => {
  // player is page's js object that control the player
  const player = window.player;
  if (!player) {
    console.log("Player not found");
    return;
  }

  const qualities = ["128", "320", "flac"];
  const links = findPublicLinks();
  await tryFindMp3HiddenLinks(links).catch(e => console.error("Error hidden flac hidden links", e));
  await tryFindNonMp3HiddenLink(links).catch(e => console.error("Error find flac hidden links", e));

  function findPublicLinks() {
    const links = {};
    for (const source of player.getConfig().sources) {
      for (const quality of qualities) {
        if (matchQuality(quality, source.file))
          links [quality] = source.file;
      }
    }
    return links;
  }

  function matchQuality(quality, link) {
    return link.match(new RegExp(`.*chiasenhac\\.com\\/.+\\/${quality}\\/`, "g"));
  }

  async function tryFindNonMp3HiddenLink(links, types = ["flac"]) {
    for (let type of types) {
      if (links[type]) {
        return;
      }

      const replaceable = qualities.filter(quality => !Number.isNaN(Number.parseInt(quality)));
      const checkedLinks = [];
      for (const quality of replaceable) {
        if (links.hasOwnProperty(quality)) {
          const link = links[quality]
            .replace(new RegExp(`(?<=/)${quality}`, "g"), type)
            .replace(/(?<=\.)mp3/g, type);

          if (checkedLinks.includes(link)) continue;
          checkedLinks.push(link);

          if (await testLink(link)) {
            links[type] = link;
            return;
          }
        }
      }
    }
  }

  async function tryFindMp3HiddenLinks(links) {
    if (!links["128"]) {
      return;
    }

    const fixable = qualities.filter(quality => !Number.isNaN(Number.parseInt(quality)))
      .filter(q => q > 128);

    for (const quantity of fixable) {
      if (links.hasOwnProperty(quantity)) {
        continue;
      }
      const mp3Link = links["128"].replace(new RegExp("(?<=/)128", "g"), quantity);
      if (await testLink(mp3Link)) {
        links[quantity] = mp3Link;
      }
    }
  }

  // using background script to check available
  // by this way we can bypass the cors
  function testLink(link) {
    return new Promise(resolve => {
      const listener = (event) => {
        if (event.detail.link === link) {
          document.removeEventListener("testLinkCSNResult", listener);
          console.log(`[${event.detail.result ? "200" : "404"}] hidden link: ${link}`);
          return resolve(event.detail.result);
        }
      };
      document.addEventListener("testLinkCSNResult", listener);
      document.dispatchEvent(new CustomEvent("testLinkCSN", { detail: link }));
    });
  }

  console.log(links);
  document.dispatchEvent(new CustomEvent("gotLinkFromCSN", { detail: links }));
  document.addEventListener("startDownload", event => {
    const config = event.detail;
    const availableQualities = Object.keys(links);
    const download = availableQualities.filter(quality => config.qualities.includes(quality));
    const fallbackDownload = availableQualities.filter(quality => config.fallbacks.includes(quality));
    downloadFiles(download.length > 0 ? download : fallbackDownload);
  });

  function downloadFiles(downloadQualities) {
    function downloadNext(i) {
      if (i >= downloadQualities.length) return;
      const link = links[downloadQualities[i]];
      const name = decodeURIComponent(getLastPathSegment(link));

      const a = document.createElement("A");
      a.href = link;
      a.setAttribute("download", name);

      a.target = "_parent";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => downloadNext(i + 1), 1000);
    }

    downloadNext(0);
  }
})();

function getLastPathSegment(link) {
  const segments = new URL(link).pathname.split("/");
  return segments.pop() || segments.pop();  // Handle potential trailing slash
}
