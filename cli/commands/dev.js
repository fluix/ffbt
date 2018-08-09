const webpack = require("webpack");
const notifier = require("node-notifier");
const Utils = require("../utils");


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
            timeout: 2,
        });
    }
}

module.exports = (webpackConfig, data) => {
    const compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, (error, stats) => {
        showCompileResultNotification(
            Utils.webpackStatsHasErrors(error, stats),
            data.projectName,
        );

        return Utils.printBriefWebpackStats(error, stats);
    });

    ["SIGINT", "SIGTERM"].forEach((sig) => {
        process.on(sig, () => {
            watching.close();
            process.exit();
        });
    });
};
