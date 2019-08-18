const path = require("path");
const merge = require("webpack-merge");
const tsLayer = require("./layers/typescript");

const baseConfig = {
    mode: "none",
    context: __dirname,
    output: {
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
};

module.exports = merge.smart(
    baseConfig,
    tsLayer,
);
