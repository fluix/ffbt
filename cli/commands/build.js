const webpack = require("webpack"),
    Utils = require("../utils");

module.exports = function(webpackConfig) {
    const compiler = webpack(webpackConfig);
    compiler.run(Utils.printVerboseWebpackStats);
};
