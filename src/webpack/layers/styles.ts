import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as autoprefixer from "autoprefixer";
import * as importOnce from "../../node-sass-import-once";
import {WebpackLayerConfigurator} from "../types";

// TODO: run in a separate process via thread-loader
//   https://webpack.js.org/guides/build-performance/#sass
export const stylesConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    autoprefixer(projectConfig.profile.browserlist),
                                ],
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    importer: importOnce(paths.project.nodeModules),
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
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: projectConfig.profile.optimizeBundle ? "[name].[contenthash].css" : "[name].css",
                chunkFilename: projectConfig.profile.optimizeBundle ? "[id].[contenthash].css" : "[id].css",
            }),
        ],
    };
};
