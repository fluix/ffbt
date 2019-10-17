import {WebpackLayerConfigurator} from "../types";

export const cachingConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        output: {
            filename: "[name].[contenthash].js",
            chunkFilename: '[name].[contenthash].chunk.js',
            // We can't specify naming policy for the CSS files in the separate layer due to CSS plugin limitations
            // See layers/styles.ts for the CSS related stuff
        },
        optimization: {
            runtimeChunk: "single",
            moduleIds: "hashed",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        enforce: true,
                    }
                }
            }
        }
    };
};
