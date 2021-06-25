import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        output: {
            filename: "[name].[contenthash].js",
            chunkFilename: '[name].[contenthash].chunk.js',
            // We can't specify naming policy for the CSS files in the separate layer due to CSS plugin limitations
            // See layers/styles.ts for the CSS related stuff
        },
        optimization: {
            runtimeChunk: "single", // move runtime code and manifest to the separate bundle
            moduleIds: "deterministic", // use content hash instead of module IDs to provide consistent hashing behavior
            // Read more: https://webpack.js.org/guides/caching/
        }
    };
};

module.exports = layer;
