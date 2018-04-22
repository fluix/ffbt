const webpack = require("webpack"),
    Utils = require("../utils"),
    notifier = require("node-notifier");

function showCompileResultNotification(hasErrors, projectName) {
    const title = projectName
        ? `FFBT: ${projectName}`
        : "FFBT";

    if (hasErrors) {
        notifier.notify({
            title,
            message: "An error occurred during compilation!",
        });
    } else {
        notifier.notify({
            title,
            message: "Compiled successfully",
            timeout: 2
        });
    }
}

module.exports = function(webpackConfig, data) {
    const compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, function(error, stats) {
        showCompileResultNotification(
            Utils.webpackStatsHasErrors(error, stats),
            data.projectName
        );

        return Utils.printBriefWebpackStats(error, stats);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
        process.on(sig, () => {
            watching.close();
            process.exit();
        });
    });
};
