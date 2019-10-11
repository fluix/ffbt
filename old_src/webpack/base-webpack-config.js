/* eslint-disable global-require */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const importOnce = require("../library/node-sass-import-once");
const autoprefixer = require("autoprefixer");
const { locateTsConfigFile, locatePath } = require("../utils");

function makeConfig(options = {
    projectRoot: void 0,
    autoprefixerConfig: void 0,
}) {
    const closestNodeModulesPath = locatePath("node_modules", options.projectRoot);
    const sassImporter = importOnce(closestNodeModulesPath);
    // TODO: Need default tsconfig
    const tsConfigPath = locateTsConfigFile(options.projectRoot);
    const tsConfig = require(tsConfigPath);

    const tsLoaderOptions = {
        configFile: tsConfigPath,
        transpileOnly: true,
        compilerOptions: {
            jsx: tsConfig.compilerOptions.jsx || "react",
        },
    };

    return {
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: tsLoaderOptions,
                },
                {
                    test: /\.worker\.tsx?$/,
                    use: [
                        { loader: "worker-loader" },
                        {
                            loader: "ts-loader",
                            options: tsLoaderOptions,
                        },
                    ],
                },
                {
                    test: /\.html$/,
                    loader: "raw-loader",
                },
                {
                    test: /\.(jpe?g|png|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                    loader: {
                        loader: "url-loader",
                        options: {
                            limit: 20480,
                        },
                    },
                },
                {
                    test: /\.(scss|css)$/,
                    loader: ExtractTextPlugin.extract([
                        {
                            loader: "css-loader",
                            options: {
                                minimize: process.env.NODE_ENV === "production",
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    autoprefixer(options.autoprefixerConfig),
                                ],
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                importer: sassImporter,
                                importOnce: {
                                    index: true,
                                    css: false,
                                    bower: false,
                                },
                            },
                        },
                    ]),
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
    };
}

module.exports = makeConfig;
