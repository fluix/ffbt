const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const configValidator = require("../../config/validator");
const { makePathToArtifact, getProfileVariables } = require("../../config/helpers");

function makeConfig(projectConfig, profileName) {
    const profileVariables = getProfileVariables(profileName, projectConfig);
    const { projectRoot } = projectConfig;

    const htmlWebpackOptions = Object.assign({
        inject: "body",
        hash: true,
        template: "index.ejs",
        profileVariables,
        envName: profileName,
    }, projectConfig.webpackPlugins.htmlWebpackPlugin);

    const plugins = [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(projectRoot, "tsconfig.json"),
        }),
        new ExtractTextPlugin({
            filename: makePathToArtifact(`${profileName}.[name].bundle.css`, projectConfig),
            allChunks: true,
        }),
        new HtmlWebpackPlugin(htmlWebpackOptions),
        new Webpack.SourceMapDevToolPlugin({
            filename: makePathToArtifact(`${profileName}.[name].js.map`, projectConfig),
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
        webpackDevtool: profileVariables.sourceMapType,
        webpackOutputSettings: {
            filename: makePathToArtifact(`${profileName}.[name].bundle.js`, projectConfig),
            chunkFilename: makePathToArtifact(`${profileName}.chunk.[name].js`, projectConfig),
        },
        // WARNING! Be careful, this object overrides the default plugins section
        // so don't put the plugins to the base config
        webpackPlugins: plugins,
    };
}

module.exports = makeConfig;
