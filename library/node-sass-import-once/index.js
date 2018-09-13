/* eslint-disable no-underscore-dangle */
/**
 * Shameless adapted from [Eyeglass](https://github.com/sass-eyeglass/eyeglass)
 *  because I wanted a general-use import-once importer for Node
 * */
const fs = require("fs");
const path = require("path");

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
    if (this._importOnceCache[data.file]) {
        done({
            contents: "",
            filename: `already-imported:${data.file}`,
        });
    } else {
        this._importOnceCache[data.file] = true;
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

    let stringData = data.toString();

    stringData = stringData.replace(/{/g, "(");
    stringData = stringData.replace(/\[/g, "(");
    stringData = stringData.replace(/}/g, ")");
    stringData = stringData.replace(/]/g, ")");

    fileReturn += stringData;

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

    return Buffer.from(fileReturn);
};

/**
 * Asynchronously walks the file list until a match is found. If
 * no matches are found, calls the callback with an error
 * */
const readFirstFile = function readFirstFile(uri, fileNames, css, cb, examinedFiles) {
    /* eslint-disable no-param-reassign */
    const filename = fileNames.shift();

    examinedFiles = examinedFiles || [];
    examinedFiles.push(filename);

    fs.readFile(filename, (err, data) => {
        if (err) {
            if (fileNames.length) {
                readFirstFile(uri, fileNames, css, cb, examinedFiles);
            } else {
                cb(new Error(`Could not import \`${uri}\` from any of the following locations:
                \n  ${examinedFiles.join("\n  ")}`));
            }
        } else {
            if ([".js", ".json"].indexOf(path.extname(filename)) !== -1) {
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
    const css = { ...this.options.importOnce };

    let files = gfn(abstractName);

    if (this.options.includePaths) {
        files = files.concat(gip(uri));
    }


    readFirstFile(uri, files, css, cb);
};

/**
 * Import the goodies!
 * */
function createImporter(nodeModules) {
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
        if (!this._importOnceCache) {
            this._importOnceCache = {};
        }

        if (isRealFile) {
            file = path.resolve(path.dirname(prev), makeFsPath(uri));
            raf(uri, file, (err, data) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log(err.toString());
                    done({});
                } else {
                    io(data, done);
                }
            });
        } else {
            raf(uri, process.cwd(), (err, data) => {
                if (err) {
                    // TODO here we need to throw? or call something from webpack to show errors
                    // eslint-disable-next-line no-console
                    console.log(err.toString());
                    done({});
                } else {
                    io(data, done);
                }
            });
        }
    };
}

/**
 * Exports the importer
 * */
module.exports = (customNodeModulesPath) => {
    const pathHasEndWithSlash = customNodeModulesPath[customNodeModulesPath.length - 1] === "/";
    const newCustomNodeModulesPath = !pathHasEndWithSlash ? `${customNodeModulesPath}/` : customNodeModulesPath;

    return createImporter(newCustomNodeModulesPath);
};
