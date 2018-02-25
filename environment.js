function getTestWorkingDir() {
    return process.env.TEST_DIR;
}

function ciModeEnabled() {
    return Boolean(process.env.TEST_CI_MODE);
}

function analyzeModeEnabled() {
    return Boolean(process.env.FFBT_ANALYZE_MODE);
}

module.exports = {
    getTestWorkingDir,
    ciModeEnabled,
    analyzeModeEnabled
};
