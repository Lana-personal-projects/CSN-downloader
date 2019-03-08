// window.location.href = document.querySelector('#csnplayer video').src;

let script = document.createElement("script");
document.body.appendChild(script);


function download(player) {
    let optional = 'flac';
    let required = '320';
    let exception = '128';
    const sources = player.getConfig().sources;
    let downloadQueue = {};

    for (let source of sources) {
        if (source.match(regexFrom(optional))) downloadQueue[optional] = source;
        if (source.match(regexFrom(required))) downloadQueue[required] = source;
        if (source.match(regexFrom(exception))) downloadQueue[exception] = source;
    }
    if (downloadQueue === {}) {
        alert('not found any link');
        return;
    }
    if (!downloadQueue.hasOwnProperty(required)) {
        if (!downloadQueue.hasOwnProperty(optional)) optional = 'no' + optional;
        if (!!downloadQueue.hasOwnProperty(exception)) exception = ''

    }


}

function regexFrom(string) {
    return new RegExp('\\/downloads\\/.+\\/' + string + '\\/', 'g');
}

