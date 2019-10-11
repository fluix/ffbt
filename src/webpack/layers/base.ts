import * as webpack from "webpack";
import {resolve} from "path";

export const baseConfigLayer: webpack.Configuration = {
    mode: "none",
    context: __dirname,
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: resolve(__dirname, "dist"),
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
