var CSNSrcLink = {};
getCSNSrcLinks();
document.dispatchEvent(new CustomEvent('gotLinkFromCSN', {detail: CSNSrcLink}));

function getCSNSrcLinks() {
    let links = {};
    const types = ['128', '320', 'flac'];
    try {
        const sources = player.getConfig().sources;
        for (let source of sources) {
            for (let type of types) {
                if (source.file.match(regexFrom(type))) links[type] = source.file
            }
        }
        if (links['320']) {
            if (links['128']) delete links['128']
        }
    } catch (e ) {
        //ignore , when this happened means the player is not defined, this is not player page
    } finally {
        CSNSrcLink = links;
    }
}

function regexFrom(string) {
    return new RegExp('\\/downloads\\/.+\\/' + string + '\\/', 'g');
}