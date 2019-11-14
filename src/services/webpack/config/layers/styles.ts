import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as autoprefixer from "autoprefixer";
import * as importOnce from "../../node-sass-import-once";
import {WebpackLayerConfigurator} from "../index";

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
                                    autoprefixer(projectConfig.env.browserlist),
                                ],
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    importer: importOnce(paths.projectNodeModules || ""),
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
                filename: projectConfig.env.optimizeBundle ? "[name].[contenthash].css" : "[name].css",
                chunkFilename: projectConfig.env.optimizeBundle ? "[id].[contenthash].css" : "[id].css",
            }),
        ],
    };
};
