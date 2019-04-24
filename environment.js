function analyzeModeEnabled() {
    return Boolean(process.env.FFBT_ANALYZE_MODE);
}

module.exports = {
    analyzeModeEnabled,
};
