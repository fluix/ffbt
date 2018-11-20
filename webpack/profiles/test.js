const path = require("path");
const environment = require("../../environment");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Webpack = require("webpack");
const { makePathToArtifact } = require("../../config/helpers");

function makePlugins(projectConfig, profileName) {
    const plugins = [
        new ExtractTextPlugin({
            filename: makePathToArtifact("test/[name].bundle.css", projectConfig),
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
            filename: makePathToArtifact("test/[name].bundle.js", projectConfig),
            chunkFilename: makePathToArtifact("[name].js", projectConfig),
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: makePlugins(projectConfig),
    };
}

module.exports = makeConfig;
