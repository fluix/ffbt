import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = () => {
    return {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    options: {
                        attributes: false,
                    }
                },
            ],
        },
    };
};

module.exports = layer;
