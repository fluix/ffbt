const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/test.ts",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            // Put loaders here
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ],
};
