const path = require("path"),
    fs = require("fs"),
    constants = require("./constants");

function locateEntrypoint(workdirPath) {
    const tsPath = path.resolve(workdirPath, `${constants.tsEntrypointName}.ts`);
    const tsxPath = path.resolve(workdirPath, `${constants.tsEntrypointName}.tsx`);

    if (fs.existsSync(tsPath)) {
        return tsPath;
    } else if (fs.existsSync(tsxPath)) {
        return tsxPath;
    } else {
        return null;
    }
}

module.exports = {
    locateEntrypoint
};