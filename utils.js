const path = require("path");
const chalk = require("chalk");
const findUp = require("find-up");
const fs = require("fs");
const constants = require("./constants");

function printCriticalError(errorText) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(errorText));
    process.exit(1);
}

function locatePath(name, cwd = "", raiseErrorIfNotExists = true) {
    const locatedPath = findUp.sync(name, {
        cwd,
    });
    if (!locatedPath && raiseErrorIfNotExists) {
        printCriticalError(`Can't locate ${name}`);
    }

    return locatedPath || "";
}

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
    locatePath,
    locateEntrypoint,
    getLocalNodeModulesPath,
    printDeprecationWarning,
    printCriticalError,
};
