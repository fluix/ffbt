const path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    importOnce = require("node-sass-import-once"),
    autoprefixer = require("autoprefixer");

function makeConfig(options = {
    projectRoot: void 0,
    autoprefixerConfig: void 0
}) {
    const projectNodeModulesPath = path.resolve(options.projectRoot, "./node_modules");
    const sassImporter = importOnce.createImporterWithCustomNodeModules(projectNodeModulesPath);
    const tsLoaderOptions = {
        configFile: path.resolve(options.projectRoot, "tsconfig.json"),
        transpileOnly: true
    };

    return {
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: tsLoaderOptions
                },
                {
                    test: /\.worker\.tsx?$/,
                    use: [
                        {loader: "worker-loader"},
                        {
                            loader: "ts-loader",
                            options: tsLoaderOptions
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    loader: "raw-loader"
                },
                {
                    test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                    loader: {
                        loader: "url-loader",
                        options: {
                            limit: Infinity,
                        }
                    }
                },
                {
                    test: /\.(scss)$/,
                    loader: ExtractTextPlugin.extract([
                        {
                            loader: "css-loader",
                            options: {
                                minimize: process.env.NODE_ENV === "production"
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    autoprefixer(options.autoprefixerConfig)
                                ]
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                importer: sassImporter,
                                importOnce: {
                                    index: true,
                                    css: false,
                                    bower: false
                                }
                            }
                        }
                    ])
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        }
    }
};

module.exports = makeConfig;
