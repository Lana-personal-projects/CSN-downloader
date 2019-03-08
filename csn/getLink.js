var CSNSrcLink = {};
getCSNSrcLinkAndSendToContent();

function getCSNSrcLinkAndSendToContent() {
    const types = ['128', '320', 'flac'];
    const sources = player.getConfig().sources;
    let links = {};
    for (let source of sources) {
        for (let type of types) {
            if (source.file.match(regexFrom(type))) links[type] = source.file
        }
    }
    if (links['320']) {
        if (links['128']) delete links['128']
    }
    document.dispatchEvent(new CustomEvent('gotLinkFromCSN', {detail: links}));
    CSNSrcLink = links;
}

function regexFrom(string) {
    return new RegExp('\\/downloads\\/.+\\/' + string + '\\/', 'g');
}