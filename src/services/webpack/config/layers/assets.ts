import {WebpackLayerConfigurator} from "../index";

export const assetsConfigLayer: WebpackLayerConfigurator = (projectConfig) => {
    const thresholdInBytes = projectConfig.env.staticFilesSizeThresholdKb * 1024;

    return {
        module: {
            rules: [
                {
                    test: /\.(jpe?g|png|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                    loader: {
                        loader: "url-loader",
                        options: {
                            limit: thresholdInBytes,
                        },
                    },
                }
            ]
        },
    };
};
