const minify = require("gulp-uglify-es").default;
const {src, dest, parallel} = require("gulp");
const distPath = "./dist";

async function minifySrc() {
    src(["./src/**/*.js"])
        .pipe(minify())
        .pipe(dest(distPath))
}

async function copyExtraContent() {
    src(["./manifest.json", "./icon.png", "./README.md"])
        .pipe(dest(distPath));
}

module.exports = {
    dist: parallel(minifySrc, copyExtraContent)
};
