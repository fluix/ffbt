const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Webpack = require("webpack");
const WebpackChunkHash = require("webpack-chunk-hash");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const configValidator = require("../../config/validator");
const path = require("path");

function makeConfig(projectConfig) {
    const profileVariables = projectConfig.profiles.production;
    const { indexFilePath, projectRoot, buildPath } = projectConfig;


    let additionalBundles = ["runtime"];
    if (configValidator.vendor(projectConfig.vendorContents)) {
        additionalBundles = ["vendor", ...additionalBundles];
    }

    const htmlWebpackOptions = {
        inject: "body",
        minify: {
            collapseWhitespace: true,
        },
        template: "index.ejs",
        profileVariables,
        envName: "production",
    };

    if (indexFilePath) {
        const absoluteBuildPath = path.resolve(projectRoot, buildPath);
        const absoluteIndexPath = path.resolve(projectRoot, indexFilePath);

        htmlWebpackOptions.filename = path.relative(absoluteBuildPath, absoluteIndexPath);
    }
    return {
        webpackDevtool: "source-map",
        webpackOutputSettings: {
            filename: "[name].[chunkhash].bundle.js",
            chunkFilename: "[name].[chunkhash].js",
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: [
            new Webpack.HashedModuleIdsPlugin(),
            new WebpackChunkHash(),
            new ChunkManifestPlugin({
                filename: "webpack-manifest.json",
                manifestVariable: "webpackManifest",
                inlineManifest: true,
            }),
            new Webpack.optimize.CommonsChunkPlugin({
                name: additionalBundles,
                minChunks: Infinity,
            }),
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new ExtractTextPlugin({
                filename: "[name].[chunkhash].bundle.css",
                allChunks: true,
            }),
            new HtmlWebpackPlugin(htmlWebpackOptions),
            new ScriptExtHtmlWebpackPlugin({
                inline: "runtime",
            }),
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true,
            }),
            new Webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify("production"),
            }),
            new CleanWebpackPlugin(buildPath, {
                allowExternal: true,
            }),
        ],
    };
}

module.exports = makeConfig;
