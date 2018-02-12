const webpack = require("webpack"),
    Utils = require("../utils");

module.exports = function(webpackConfig) {
    const compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, Utils.printBriefWebpackStats);

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
        process.on(sig, () => {
            watching.close();
            process.exit();
        });
    });
};
