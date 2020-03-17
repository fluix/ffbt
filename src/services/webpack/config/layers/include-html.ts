import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = () => {
    return {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    options: {
                        attrs: false,
                    }
                },
            ],
        },
    };
};

module.exports = layer;
