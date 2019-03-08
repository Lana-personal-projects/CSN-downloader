downloadAllCSNSrcLink();

function downloadAllCSNSrcLink() {
    let script = document.createElement('script');
    script.innerHTML = 'download_files(getFiles());\n' +
        '\n' +
        'function getFiles() {\n' +
        '    let files = [];\n' +
        '    for (let key in CSNSrcLink) {\n' +
        '        files.push(CSNSrcLink[key])\n' +
        '    }\n' +
        '    return files;\n' +
        '}\n' +
        '\n' +
        'function download_files(files) {\n' +
        '    function download_next(i) {\n' +
        '        if (i >= files.length) {\n' +
        '            return;\n' +
        '        }\n' +
        '        let a = document.createElement(\'a\');\n' +
        '        a.href = files[i];\n' +
        '        a.target = \'_parent\';\n' +
        '\n' +
        '        (document.body || document.documentElement).appendChild(a);\n' +
        '        if (a.click) {\n' +
        '            a.click();\n' +
        '        }\n' +
        '        a.parentNode.removeChild(a);\n' +
        '        setTimeout(function () {\n' +
        '            download_next(i + 1);\n' +
        '        }, 500);\n' +
        '    }\n' +
        '\n' +
        '    download_next(0);\n' +
        '}';

    document.body.appendChild(script)
}


