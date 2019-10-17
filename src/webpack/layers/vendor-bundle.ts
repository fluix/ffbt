import {WebpackLayerConfigurator} from "../types";

export const vendorBundleConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        optimization: {
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
