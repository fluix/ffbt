const webpack = require("webpack");
const Utils = require("../utils");
const WebpackNotifierPlugin = require("webpack-notifier");

function addNotificationPluginToWebpackConfig(webpackConfig, title) {
    webpackConfig.plugins.push(new WebpackNotifierPlugin({
        alwaysNotify: true,
        contentImage: "",
        title,
    }));
}

function getProjectTitle(data) {
    const title = data.projectName
        ? `FFBT: ${data.projectName}`
        : "FFBT";
    return title;
}

module.exports = (webpackConfig, data) => {
    addNotificationPluginToWebpackConfig(webpackConfig, getProjectTitle(data));
    const compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, (error, stats) => Utils.printBriefWebpackStats(error, stats));

    ["SIGINT", "SIGTERM"].forEach((sig) => {
        process.on(sig, () => {
            watching.close();
            process.exit();
        });
    });
};
