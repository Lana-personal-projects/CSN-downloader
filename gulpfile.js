const minify = require('gulp-uglify-es').default;
const path = require('path');
const { src, dest, parallel } = require('gulp');
const distPath = './dist';

async function minifySrc() {
    src(['./src/**/*.js'])
        .pipe(minify())
        .pipe(dest(path.resolve(distPath, 'src')));
}

async function copyExtraContent() {
    src(['./manifest.json', './icon.png'])
        .pipe(dest(distPath));
    src('./src/options/index.html')
        .pipe(dest(path.resolve(distPath, 'src', 'options')));
}

module.exports = {
    dist: parallel(minifySrc, copyExtraContent),
};
