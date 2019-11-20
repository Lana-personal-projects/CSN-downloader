// inject this script into page to access pages"s js object (player) and communicate
// with background via content-script by an event
// put this into function to avoid conflict with page"s js
(() => {
    const links = {};
    const qualities = ["128", "320", "flac", "m4a"];
    try {
        // player is page"s js object that control the player
        for (const source of player.getConfig().sources) {
            for (const quality of qualities) {
                if (source.file.match(regexFor(quality)))
                    links [quality] = source.file;
            }
        }
    } catch (e) {
        // player is not defined, probably this is not a player page.
    }

    document.dispatchEvent(new CustomEvent("gotLinkFromCSN", {detail: links}));
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

            const a = document.createElement("A");
            a.href = links[downloadQualities[i]];
            a.target = "_parent";
            a.setAttribute("download", "download");
            (document.body || document.documentElement).appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
            setTimeout(() => downloadNext(i + 1), 800);
        }

        downloadNext(0);
    }

    function regexFor(quality) {
        return new RegExp(`\\/downloads\\/.+\\/${quality}\\/`, "g");
    }
})();
