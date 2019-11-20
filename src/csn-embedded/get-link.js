// inject this script into page to access pages's js object (player) and communicate
// with background via content-script by an event

const CSNSrcLinks = extractCSNSrcLinks();
document.dispatchEvent(new CustomEvent('gotLinkFromCSN', {detail: CSNSrcLinks}));

//put this into function to avoid conflict with page's js
function extractCSNSrcLinks() {
    const links = {};
    const types = ['128', '320', 'flac', 'm4a'];

    function regexFrom(string) {
        return new RegExp('\\/downloads\\/.+\\/' + string + '\\/', 'g');
    }

    // player is page's js object that control the player
    try {
        for (const source of player.getConfig().sources) {
            for (const type of types) {
                if (source.file.match(regexFrom(type))) links [type] = source.file
            }
        }
    } catch (e) {
        // player is not defined, probably this is not a player page.
    }
    return links;
}
