import {WebpackLayerConfigurator} from "../index";

export const includeHtmlConfigLayer: WebpackLayerConfigurator = () => {
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
