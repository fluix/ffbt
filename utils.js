const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const constants = require("./constants");

function locateEntrypoint(workdirPath) {
    const tsPath = path.resolve(workdirPath, `${constants.tsEntrypointName}.ts`);
    const tsxPath = path.resolve(workdirPath, `${constants.tsEntrypointName}.tsx`);

    if (fs.existsSync(tsPath)) {
        return tsPath;
    } if (fs.existsSync(tsxPath)) {
        return tsxPath;
    }
    return null;
}

function getLocalNodeModulesPath() {
    return path.resolve(__dirname, "node_modules");
}

function printDeprecationWarning(deprecatedName, newName) {
    // eslint-disable-next-line no-console
    console.warn(chalk.red(`WARN: ${deprecatedName} is deprecated. Use ${newName} instead`));
}

module.exports = {
    locateEntrypoint,
    getLocalNodeModulesPath,
    printDeprecationWarning,
};
