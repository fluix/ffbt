const webpack = require("webpack"),
    Utils = require("../utils"),
    notifier = require("node-notifier");

module.exports = function(webpackConfig) {
    const compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, function(error, stats) {
        if (Utils.webpackStatsHasErrors(error, stats)) {
            notifier.notify({
                title: "FFBT",
                message: "An error occurred during compilation!",
            });
        } else {
            notifier.notify({
                title: "FFBT",
                message: "Compiled successfully",
                timeout: 2
            });
        }

        return Utils.printBriefWebpackStats(error, stats);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
        process.on(sig, () => {
            watching.close();
            process.exit();
        });
    });
};
