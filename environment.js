const path = require("path"),
    chalk = require("chalk");

function getTestWorkingDir() {
    return process.env.TEST_DIR;
}

function ciModeEnabled() {
    return Boolean(process.env.TEST_CI_MODE);
}

module.exports = {
    getTestWorkingDir: getTestWorkingDir,
    ciModeEnabled: ciModeEnabled
};
