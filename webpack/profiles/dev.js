const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const configValidator = require("../../config/validator");

function makeConfig(projectConfig, profileName) {
    const profileVariables = projectConfig.profiles.dev;
    const { indexFilePath, projectRoot, buildPath } = projectConfig;

    const htmlWebpackOptions = {
        inject: "body",
        hash: true,
        template: "index.ejs",
        profileVariables,
        envName: "dev",
    };

    if (indexFilePath) {
        const absoluteBuildPath = path.resolve(projectRoot, buildPath);
        const absoluteIndexPath = path.resolve(projectRoot, indexFilePath);

        htmlWebpackOptions.filename = path.relative(absoluteBuildPath, absoluteIndexPath);
    }


    const plugins = [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(projectRoot, "tsconfig.json"),
        }),
        new ExtractTextPlugin({
            filename: "dev.[name].bundle.css",
            allChunks: true,
        }),
        new HtmlWebpackPlugin(htmlWebpackOptions),
        new Webpack.SourceMapDevToolPlugin({
            filename: "dev.[name].js.map",
            exclude: [/vendor/, /.css/],
        }),
        new Webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(profileName),
        }),
    ];

    if (configValidator.vendor(projectConfig.vendorContents)) {
        plugins.push(
            new Webpack.optimize.CommonsChunkPlugin({
                name: ["vendor"],
                minChunks: Infinity,
            }),
        );
    }

    return {
        webpackDevtool: "eval-source-map",
        webpackOutputSettings: {
            filename: "dev.[name].bundle.js",
            chunkFilename: "dev.chunk.[name].js",
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: plugins,
    };
}

module.exports = makeConfig;
