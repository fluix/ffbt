const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const importOnce = require("../../library/node-sass-import-once");

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
