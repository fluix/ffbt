const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const configValidator = require("../../config/validator");
const { getArtifactsDirectory, makePathToArtifact, getProfileVariables } = require("../../config/helpers");

function makeConfig(projectConfig, profileName) {
    const profileVariables = getProfileVariables(profileName, projectConfig);

    let additionalBundles = ["runtime"];
    if (configValidator.vendor(projectConfig.vendorContents)) {
        additionalBundles = ["vendor", ...additionalBundles];
    }

    const htmlWebpackOptions = Object.assign({
        inject: "body",
        minify: {
            collapseWhitespace: true,
        },
        template: "index.ejs",
        profileVariables,
        envName: profileName,
    }, projectConfig.webpackPlugins.htmlWebpackPlugin);

    return {
        webpackDevtool: profileVariables.sourceMapType,
        webpackOutputSettings: {
            filename: makePathToArtifact("[name].[chunkhash].bundle.js", projectConfig),
            chunkFilename: makePathToArtifact("[name].[chunkhash].js", projectConfig),
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: [
            new Webpack.optimize.CommonsChunkPlugin({
                name: additionalBundles,
                minChunks: Infinity,
            }),
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new ExtractTextPlugin({
                filename: makePathToArtifact("[name].[chunkhash].bundle.css", projectConfig),
                allChunks: true,
            }),
            new HtmlWebpackPlugin(htmlWebpackOptions),
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true,
            }),
            new Webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(profileName),
            }),
            new CleanWebpackPlugin(getArtifactsDirectory(projectConfig, true), {
                allowExternal: true,
                verbose: true,
            }),
        ],
    };
}

module.exports = makeConfig;
