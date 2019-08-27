const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const importOnce = require("../../library/node-sass-import-once");
const autoprefixer = require("autoprefixer");

const sassImporter = importOnce("");

module.exports = {
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
                                autoprefixer("last 2 versions"),
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
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
};
