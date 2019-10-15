import {WebpackLayerConfigurator} from "../types";

export const includeHtmlConfigLayer: WebpackLayerConfigurator = () => {
    return {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    options: {
                        minimize: true,
                    }
                },
            ],
        },
    };
};
