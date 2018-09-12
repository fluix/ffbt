const path = require("path");
const environment = require("../../environment");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Webpack = require("webpack");

function makePlugins(projectConfig, profileName) {
    const plugins = [
        new ExtractTextPlugin({
            filename: "test/[name].bundle.css",
            allChunks: true,
        }),
        new Webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(profileName),
        }),
    ];

    if (!environment.ciModeEnabled()) {
        plugins.push(
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(projectConfig.projectRoot, "tsconfig.json"),
            }),
        );
    }

    return plugins;
}

function makeConfig(projectConfig) {
    return {
        webpackDevtool: "eval-source-map",
        webpackOutputSettings: {
            filename: "test/[name].bundle.js",
            chunkFilename: "[name].js",
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: makePlugins(projectConfig),
    };
}

module.exports = makeConfig;
