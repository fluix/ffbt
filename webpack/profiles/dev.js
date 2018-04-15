const path = require("path"),
    ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'),
    Webpack = require("webpack"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin");

function makeConfig(projectConfig) {
    const gaId = projectConfig.profiles.dev
        && projectConfig.profiles.dev.googleAnalyticsId;

    return {
        webpackDevtool: 'eval-source-map',
        webpackOutputSettings: {
            filename: "build/[name].bundle.js",
            chunkFilename: "[name].js",
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(projectConfig.projectRoot, "tsconfig.json")
            }),
            new Webpack.optimize.CommonsChunkPlugin({
                name: ["vendor"],
                minChunks: Infinity
            }),
            new ExtractTextPlugin({
                filename: 'build/[name].bundle.css',
                allChunks: true,
            }),
            new HtmlWebpackPlugin({
                inject: "body",
                hash: true,
                template: "index.ejs",
                gaUA: gaId,
                htmlBaseRoot: projectConfig.htmlBaseRoot
            }),
            new Webpack.SourceMapDevToolPlugin({
                filename: '[name].js.map',
                exclude: [/vendor/, /.css/]
            })
        ]
    };
}

module.exports = makeConfig;
