const HtmlWebpackPlugin = require("html-webpack-plugin"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    Webpack = require("webpack"),
    WebpackChunkHash = require("webpack-chunk-hash"),
    ChunkManifestPlugin = require("chunk-manifest-webpack-plugin"),
    ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin"),
    UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    configValidator = require("../../config/validator");

function makeConfig(projectConfig) {
    const profileVariables = projectConfig.profiles.production;

    let additionalBundles = ["runtime"];
    if (configValidator.vendor(projectConfig.vendorContents)) {
        additionalBundles = ["vendor", ...additionalBundles];
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
                inlineManifest: true
            }),
            new Webpack.optimize.CommonsChunkPlugin({
                name: additionalBundles,
                minChunks: Infinity
            }),
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new ExtractTextPlugin({
                filename: '[name].[chunkhash].bundle.css',
                allChunks: true,
            }),
            new HtmlWebpackPlugin({
                inject: "body",
                minify: {
                    collapseWhitespace: true
                },
                template: "index.ejs",
                profileVariables: profileVariables,
                envName: "production",
            }),
            new ScriptExtHtmlWebpackPlugin({
                inline: 'runtime'
            }),
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true
            }),
            new Webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new CleanWebpackPlugin(projectConfig.buildPath, {
                allowExternal: true
            }),
        ]
    };
}

module.exports = makeConfig;
