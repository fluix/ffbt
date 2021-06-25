import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as autoprefixer from "autoprefixer";
import * as importOnce from "../../node-sass-import-once";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '',
                            },
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    autoprefixer(projectConfig.env.browserlist),
                                ],
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    importer: importOnce(projectConfig.paths.projectNodeModules || ""),
                                    importOnce: {
                                        index: true,
                                        css: false,
                                        bower: false,
                                    },
                                }
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '',
                            },
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    autoprefixer(projectConfig.env.browserlist),
                                ],
                            },
                        },
                    ]
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: projectConfig.env.enableCacheBusting ? "[name].[contenthash].css" : "[name].css",
                chunkFilename: projectConfig.env.enableCacheBusting ? "[id].[contenthash].css" : "[id].css",
            }),
        ],
    };
};

module.exports = layer;
