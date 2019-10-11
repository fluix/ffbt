const webpack = require("webpack");
const Utils = require("../utils");

module.exports = (webpackConfig) => {
    const compiler = webpack(webpackConfig);
    compiler.run(Utils.printVerboseWebpackStats);
};
