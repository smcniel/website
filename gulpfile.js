// const { src, dest, series, watch, parallel } = require(`gulp`);
const { src, dest, series, watch } = require(`gulp`);
const del = require(`del`);
const sass = require(`gulp-sass`);
const babel = require(`gulp-babel`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
// const imageCompressor = require(`gulp-imagemin`);
// const cache = require(`gulp-cache`);
const browserSync = require(`browser-sync`);
const { reload } = browserSync;
const { spawn } = require(`child_process`);
// const htmlCompressor = require(`gulp-htmlmin`);
// const htmlValidator = require(`gulp-html`);

/* FILE PATH DIRECTORIES */
const projDir = `./mysiteproj`;
const devHtmlDir = `${projDir}/templates`;
const devAssetsDir = `./dev_assets`;
const devBuildDir = `${projDir}/static/temp`;
const prodBuildDir = `${projDir}/static/prod`;

/* eslint-disable prefer-const */

// let validateHTML = () => {
//     return src([
//         devHtmlDir + `/*.html`,
//         devHtmlDir +`/**/*.html`])
//         .pipe(htmlValidator());
// };

// let nginx handle this instead?

// let compressHTML = () => {
//     return src([
//         `${devHtmlDir}/*.html`,
//         `${devHtmlDir}/**/*.html`])
//         .pipe(htmlCompressor({ collapseWhitespace: true }))
//         .pipe(dest(prodAssetDir));
// };

let compileCSSForDev = () => src(`${devAssetsDir}/styles/main.scss`)
    .pipe(sass({
        outputStyle: `expanded`,
        precision: 10,
    }).on(`error`, sass.logError))
    .pipe(dest(`${devBuildDir}/styles`));

let compileCSSForProd = () => src(`${devAssetsDir}/styles/main.scss`)
    .pipe(sass({
        outputStyle: `compressed`,
        precision: 10,
    }).on(`error`, sass.logError))
    .pipe(dest(`${prodBuildDir}/styles`));

let transpileJSForDev = () => src(`${devAssetsDir}/scripts/*.js`)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest(`${devBuildDir}/scripts`));

let transpileJSForProd = () => src(`${devAssetsDir}/scripts/*.js`)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(jsCompressor())
    .pipe(dest(`${prodBuildDir}/scripts`));

let lintJS = () => src(`${devAssetsDir}/scripts/*.js`)
    .pipe(jsLinter({
        parserOptions: {
            ecmaVersion: 2017,
            sourceType: `module`,
        },
        rules: {
            indent: [2, 4, { SwitchCase: 1 }],
            quotes: [2, `backtick`],
            semi: [2, `always`],
            'linebreak-style': [2, `unix`],
            'max-len': [1, 85, 4],
        },
        env: {
            es6: true,
            node: true,
            browser: true,
        },
        extends: `eslint:recommended`,
    }))
    .pipe(jsLinter.formatEach(`compact`, process.stderr));


// todo: rewrite for better personal workflow.  Also fix eslint error block location

/* eslint-disable no-multi-spaces */
// let copyUnprocessedAssetsForProd = () => {
//     return src([
//         `${devAssetsDir}/*.*`,          // Source all files,
//         `${devAssetsDir}/**`,           // and all folders,
//         `!mysite/templates/dev/`,       // but not the HTML folder
//         `!mysite/templates/dev/*.*`,    // or any files in it
//         `!mysite/templates/dev/**`,     // or any sub folders;
//         `!mysite/dev/img/`,             // ignore images;
//         `!mysite/dev/**/*.js`,          // ignore JS;
//         `!mysite/dev/styles/**`,        // and, ignore Sass/CSS.
//     ], { dot: true }).pipe(dest(prodAssetDir));
// };

// let compressImages = () => {
//     return src(`${devAssetsDir}/img/**/*`)
//         .pipe(cache(
//             imageCompressor({
//                 optimizationLevel: 3,   // For PNG files. Accepts 0 – 7; 3 is default.
//                 progressive: true,      // For JPG files.
//                 multipass: false,       // For SVG files. Set to true for compression.
//                 interlaced: false,      // For GIF files. Set to true for compression.
//             }),
//         ))
//         .pipe(dest(`${prodAssetDir}/img`));
// };
/* eslint-enable no-multi-spaces */

// this works in series but not getting exit and close codes to work yet
let serveBackend = (done) => {
    let cmd = spawn(
        `./web_env/bin/python3`, [`${projDir}/manage.py runserver`],
        { stdio: `inherit`, shell: true },
    );
    // cmd.on(`data`, (data) => {
    //     console.log(`child process closed with code ${data}`);
    // });
    // these only show up with errors - look into above
    cmd.on(`exit`, (code) => {
        console.log(`child process exited with code ${code}`);
    });
    cmd.on(`close`, (code) => {
        console.log(`child process closed with code ${code}`);
    });
    done();
};

let proxyServe = () => {
    browserSync({
        ui: false,
        online: false,
        notify: false,
        proxy: `127.0.0.1:8000/`,
        reloadDelay: 50,
        // reloadDelay: 300,
        // browser: browserChoice,
    });

    watch(`${devAssetsDir}/scripts/*.js`,
        series(lintJS, transpileJSForDev)).on(`change`, reload);

    watch(`${devAssetsDir}/styles/**/*.scss`,
        series(compileCSSForDev)).on(`change`, reload);

    watch(`${devHtmlDir}/**/*.html`).on(`change`, reload);

    watch(`${devAssetsDir}/img/**/*`).on(`change`, reload);
};

/* eslint-disable global-require */
async function clean() {
    let fs = require(`fs`);
    let i;
    let foldersToDelete = [devBuildDir, prodBuildDir];

    for (i = 0; i < foldersToDelete.length; i += 1) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ${foldersToDelete[i]}`
                + ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ${foldersToDelete[i]}`
                + ` directory does NOT exist or is NOT accessible.\n`);
        }
    }
    process.stdout.write(`\n`);
}

async function listTasks() {
    const { exec } = require(`child_process`);

    exec(`gulp --tasks`, (error, stdout, stderr) => {
        if (error !== null) {
            process.stdout.write(`An error was likely generated when invoking `
                + `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream `
                + `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does `
            + `nothing but generate this message. The `
            + `available tasks are:\n\n${stdout}`);
    });
}
/* eslint-enable global-require */

// exports.safari = series(safari, serve);
// exports.firefox = series(firefox, serve);
// exports.chrome = series(chrome, serve);
// exports.opera = series(opera, serve);
// exports.edge = series(edge, serve);
// exports.allBrowsers = series(allBrowsers, serve);
// exports.validateHTML = validateHTML;
// exports.compressHTML = compressHTML;
exports.compileCSSForDev = compileCSSForDev;
exports.compileCSSForProd = compileCSSForProd;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintJS = lintJS;
// exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.build = series(
    // validateHTML,
    // compressHTML,
    compileCSSForProd,
    lintJS,
    transpileJSForProd,
    // compressImages,
    // copyUnprocessedAssetsForProd,
);
// exports.compressImages = compressImages;

exports.clean = clean;
exports.default = listTasks;
exports.serveBackend = serveBackend;
exports.serve = series(
    compileCSSForDev,
    lintJS,
    transpileJSForDev,
    serveBackend,
    proxyServe,
);
