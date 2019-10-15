import * as webpack from "webpack";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";

export const typescriptConfigLayer: webpack.Configuration = {
    devtool: "inline-source-map",
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
        new ForkTsCheckerNotifierWebpackPlugin({
            title: "FFBT",
            excludeWarnings: true
        }),
    ],
};
