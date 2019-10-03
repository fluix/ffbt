const path = require("path");
const merge = require("webpack-merge");

const baseConfig = {
    mode: "none",
    context: __dirname,
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            // Put loaders here
        ],
    },
    plugins: [
        // Put plugins here
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        }
    }
};

module.exports = merge.smart(
    baseConfig,
    require("./layers/typescript"),
    require("./layers/styles"),
    require("./layers/index-file"),
    require("./layers/include-html"),
    require("./layers/assets"),
    require("./layers/globals"),

    require("./layers/dev-server"),
    // require("./layers/bundle-analyze"),
);
