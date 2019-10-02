const path = require("path");
const merge = require("webpack-merge");

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
    require("./layers/typescript"),
    require("./layers/styles"),
    require("./layers/index-file"),
    require("./layers/include-html"),
    require("./layers/assets"),
    require("./layers/dev-server"),
    // require("./layers/bundle-analyze"),
);
