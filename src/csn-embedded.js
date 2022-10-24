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
  await tryFindHiddenLinks(links).catch(e => console.error("Error hidden flac hidden links", e));
  await tryFindFlacHiddenLink(links).catch(e => console.error("Error find flac hidden links", e));

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
    const storages = ["down2", "download", "downloads"];
    const regexes = storages.map(storage => new RegExp(`\\/${storage}.+\\/${quality}\\/`, "g"));
    return regexes.some(reg => link.match(reg));
  }

  async function tryFindFlacHiddenLink(links) {
    if (links["flac"]) {
      return;
    }
    const replaceable = qualities.filter(quality => quality !== "flac");
    for (const quality of replaceable) {
      if (links.hasOwnProperty(quality)) {
        const flacLink = links[quality]
          .replace(new RegExp(`(?<=/)${quality}`, "g"), "flac")
          .replace(/(?<=\.)mp3/g, "flac");
        if (await testLink(flacLink)) {
          links["flac"] = flacLink;
          return;
        }
      }
    }
  }

  async function tryFindHiddenLinks(links) {
    if (!links["128"]) {
      return;
    }
    const fixable = qualities.filter(quality => quality !== "128" || quality !== "flac");
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

  // create an audio element to check if link ok
  // by this way we can bypass the cors
  async function testLink(link) {
    const audio = document.createElement("AUDIO");
    try {
      await new Promise((resolve, reject) => {
        audio.addEventListener("loadedmetadata", () => {
          resolve();
        });
        audio.addEventListener("error", () => {
          reject();
        });
        audio.src = link;
        audio.load();
      });

      console.log(`Found hidden link: ${link}`);
      return true;
    } catch (e) {
      return false;
    }
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
