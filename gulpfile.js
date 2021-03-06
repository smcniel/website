const { src, dest, series, watch, parallel } = require(`gulp`);
const del = require(`del`);
const sass = require(`gulp-sass`);
const babel = require(`gulp-babel`);
const htmlCompressor = require(`gulp-htmlmin`);
// const htmlValidator = require(`gulp-html`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
const imageCompressor = require(`gulp-imagemin`);
const cache = require(`gulp-cache`);
const browserSync = require(`browser-sync`);
// const reload = browserSync.reload;
const { reload } = browserSync;

const projDir = `./mysite`;
// const devHtmlDir = projDir + `/templates/dev`;
const devHtmlDir = `${projDir}/templates/dev`;
// const devAssetsDir = projDir + `/static/dev`;
const devAssetsDir = `${projDir}/static/dev`;
// const devTempDir = projDir + `/static/temp`;
const devTempDir = `${projDir}/static/temp`;
const prodAssetDir = `${projDir}/static/prod`;
