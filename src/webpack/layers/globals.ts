import * as webpack from "webpack";
import {WebpackLayerConfigurator} from "../types";

export const globalsConfigLayer: WebpackLayerConfigurator = () => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                "FFBT_BUILD_VERSION": JSON.stringify(`app.${Date.now()}`),
            })
        ]
    };
};
