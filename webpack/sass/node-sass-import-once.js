/**
 * Shameless adapted from [Eyeglass](https://github.com/sass-eyeglass/eyeglass)
 *  because I wanted a general-use import-once importer for Node
 * */


const fs = require("fs");


const yaml = require("js-yaml");


const path = require("path");


const nodeModules = `${path.resolve(require.resolve("node-sass-import-once"), "../../")}/`;

/**
 * All imports use the forward slash as a directory
 * delimeter. This function converts to the filesystem's
 * delimeter if it uses an alternate.
 * */
const makeFsPath = function makeFsPath(importPath) {
    let fsPath = importPath;
    if (path.sep !== "/") {
        fsPath = fsPath.replace(/\//, path.sep);
    }
    return fsPath;
};

/**
 * Determines if a file should be imported or not
 * */
const importOnce = function importOnce(data, done) {
    if (this.importOnceCache[data.file]) {
        done({
            contents: "",
            filename: `already-imported:${data.file}`,
        });
    } else {
        this.importOnceCache[data.file] = true;
        done(data);
    }
};

/**
 * Sass imports are usually in an abstract form in that
 * they leave off the partial prefix and the suffix.
 * This code creates the possible extensions, whether it is a partial
 * and whether it is a directory index file having those
 * same possible variations. If the import contains an extension,
 * then it is left alone.
 *
 * */
const getFileNames = function getFileNames(abstractName) {
    const names = [];


    let directory;


    let basename;

    if ([".scss", ".sass"].indexOf(path.extname(abstractName)) !== -1) {
        directory = path.dirname(abstractName);
        basename = path.basename(abstractName);

        ["", "_"].forEach((prefix) => {
            names.push(path.join(directory, prefix + basename));
        });
    } else if (path.extname(abstractName)) {
        names.push(abstractName);
    } else {
        directory = path.dirname(abstractName);
        basename = path.basename(abstractName);

        // Standard File Names
        ["", "_"].forEach((prefix) => {
            [".scss", ".sass"].forEach((ext) => {
                names.push(path.join(directory, prefix + basename + ext));
            });
        });

        // Index Files
        if (this.options.importOnce.index) {
            ["", "_"].forEach((prefix) => {
                [".scss", ".sass"].forEach((ext) => {
                    names.push(path.join(abstractName, `${prefix}index${ext}`));
                });
            });
        }

        // CSS Files
        if (this.options.importOnce.css) {
            names.push(`${abstractName}.css`);
        }
    }
    return names;
};

/**
 * Build list of potential Bower imports
 * */
const getBowerNames = function getBowerNames(uri) {
    const gfn = getFileNames.bind(this);

    let bowerrc = path.resolve(process.cwd(), ".bowerrc");


    let bowerPath = "bower_components";


    const core = uri.split("/")[0];


    const paths = [];


    let results = [];

    uri = makeFsPath(uri);

    if (fs.existsSync(bowerrc)) {
        bowerrc = JSON.parse(fs.readFileSync(bowerrc, "utf-8"));
        if (bowerrc.directory) {
            bowerPath = bowerrc.directory;
        }
    }

    // Resolve the path to the Bower repository;
    bowerPath = path.resolve(process.cwd(), bowerPath);

    // Basic, add import path-esque
    paths.push(path.resolve(bowerPath, uri));
    // For those projects that were Ruby gems and are now distributed through Bower
    if (core !== ".." && core !== ".") {
        paths.push(path.resolve(bowerPath, core, uri));
        paths.push(path.resolve(bowerPath, core, "stylesheets", uri));
        paths.push(path.resolve(bowerPath, `${core}-sass`, "stylesheets", uri));
        paths.push(path.resolve(bowerPath, `sass-${core}`, "stylesheets", uri));

        paths.push(path.resolve(bowerPath, core, "sass", uri));
        paths.push(path.resolve(bowerPath, `${core}-sass`, "sass", uri));
        paths.push(path.resolve(bowerPath, `sass-${core}`, "sass", uri));

        if (this.options.importOnce.css) {
            paths.push(path.resolve(bowerPath, core, "dist", uri));
            paths.push(path.resolve(bowerPath, core, "dist", "css", uri));
        }
    }

    // Get the file names for all of the paths!
    paths.forEach((pathName) => {
        results = results.concat(gfn(pathName));
    });

    return results;
};

/**
 * getIn
 * */
const getIncludePaths = function getIncludePaths(uri) {
    // From https://github.com/sass/node-sass/issues/762#issuecomment-80580955
    const arr = this.options.includePaths.split(path.delimiter);


    const gfn = getFileNames.bind(this);


    let paths = [];

    arr.forEach((includePath) => {
        paths = paths.concat(gfn(path.resolve(process.cwd(), includePath, uri)));
    });

    return paths;
};

/**
 * Parse JSON into Sass
 * */
const parseJSON = function parseJSON(data, filename) {
    let fileReturn = `$${path.basename(filename).replace(path.extname(filename), "")}:`;


    let colors;

    data = data.toString();

    if ([".yml", ".yaml"].indexOf(path.extname(filename)) !== -1) {
        data = yaml.safeLoad(data);
        data = JSON.stringify(data);
    }

    data = data.replace(/\{/g, "(");
    data = data.replace(/\[/g, "(");
    data = data.replace(/\}/g, ")");
    data = data.replace(/\]/g, ")");

    fileReturn += data;

    if (fileReturn.substr(fileReturn.length - 1) === "\n") {
        fileReturn = fileReturn.slice(0, -1);
    }

    fileReturn += ";";

    // ////////////////////////////
    // Hex colors
    // ////////////////////////////
    colors = fileReturn.match(/"(#([0-9a-f]{3}){1,2})"/g);
    if (colors) {
        colors.forEach((color) => {
            fileReturn = fileReturn.replace(color, color.slice(1, -1));
        });
    }


    // ////////////////////////////
    // RGB/A Colors
    // ////////////////////////////
    colors = fileReturn.match(/"(rgb|rgba)\((\d{1,3}), (\d{1,3}), (\d{1,3})\)"/g);
    if (colors) {
        colors.forEach((color) => {
            fileReturn = fileReturn.replace(color, color.slice(1, -1));
        });
    }

    // ////////////////////////////
    // HSL/A Colors
    // ////////////////////////////
    // ////////////////////////////
    // RGB/A Colors
    // ////////////////////////////
    colors = fileReturn.match(/"(hsl|hsla)\((\d{1,3}), (\d{1,3}), (\d{1,3})\)"/g);
    if (colors) {
        colors.forEach((color) => {
            fileReturn = fileReturn.replace(color, color.slice(1, -1));
        });
    }

    return new Buffer(fileReturn);
};

/**
 * Asynchronously walks the file list until a match is found. If
 * no matches are found, calls the callback with an error
 * */
const readFirstFile = function readFirstFile(uri, filenames, css, cb, examinedFiles) {
    const filename = filenames.shift();
    examinedFiles = examinedFiles || [];
    examinedFiles.push(filename);
    fs.readFile(filename, (err, data) => {
        if (err) {
            if (filenames.length) {
                readFirstFile(uri, filenames, css, cb, examinedFiles);
            } else {
                cb(new Error(
                    `Could not import \`${uri}\` from any of the following locations:\n  ${examinedFiles.join("\n  ")}`,
                ));
            }
        } else {
            if ([".js", ".json", ".yml", ".yaml"].indexOf(path.extname(filename)) !== -1) {
                data = parseJSON(data, filename);
            }
            cb(null, {
                contents: data.toString(),
                file: filename,
            });
        }
    });
};

// This is a bootstrap function for calling readFirstFile.
const readAbstractFile = function readAbstractFile(uri, abstractName, cb) {
    const gfn = getFileNames.bind(this);


    const gip = getIncludePaths.bind(this);


    const gbn = getBowerNames.bind(this);


    const { css } = this.options.importOnce.css;

    let files = gfn(abstractName);

    if (this.options.includePaths) {
        files = files.concat(gip(uri));
    }

    if (this.options.importOnce.bower) {
        files = files.concat(gbn(uri));
    }

    readFirstFile(uri, files, css, cb);
};

/**
 * Import the goodies!
 * */
function createImporter() {
    return function importer(uri, prev, done) {
        if (uri[0] === "~") {
            uri = nodeModules + uri.slice(1);
        }

        const isRealFile = fs.existsSync(prev);


        const io = importOnce.bind(this);


        const raf = readAbstractFile.bind(this);


        let file;

        // Ensure options are available
        if (!this.options.importOnce) {
            this.options.importOnce = {};
        }

        // Set default index import
        if (!this.options.importOnce.index) {
            this.options.importOnce.index = false;
        }

        // Set default bower import
        if (!this.options.importOnce.bower) {
            this.options.importOnce.bower = false;
        }

        // Set default css import
        if (!this.options.importOnce.css) {
            this.options.importOnce.css = false;
        }

        // Create an import cache if it doesn't exist
        if (!this.importOnceCache) {
            this.importOnceCache = {};
        }

        if (isRealFile) {
            file = path.resolve(path.dirname(prev), makeFsPath(uri));
            raf(uri, file, (err, data) => {
                if (err) {
                    console.error(err.toString());
                    done({});
                } else {
                    io(data, done);
                }
            });
        } else {
            raf(uri, process.cwd(), (err, data) => {
                if (err) {
                    console.error(err.toString());
                    done({});
                } else {
                    io(data, done);
                }
            });
        }
    };
}

// keep the old interface for backward compatibility
const importer = createImporter();
// invoke this function if you want to resolve dependencies from custom node_modules directory
// it will be useful if you want to store your build scripts inside the separate project
importer.createImporterWithCustomNodeModules = function createImporterWithCustomNodeModules(customNodeModulesPath) {
    const pathHasEndShash = customNodeModulesPath[customNodeModulesPath.length - 1] === "/";
    customNodeModulesPath = !pathHasEndShash
        ? `${customNodeModulesPath}/`
        : customNodeModulesPath;

    return createImporter(customNodeModulesPath);
};

/**
 * Exports the importer
 * */
module.exports = importer;
