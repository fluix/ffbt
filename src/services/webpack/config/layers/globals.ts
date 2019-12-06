import * as webpack from "webpack";
import {WebpackLayerConfigurator} from "../index";

export const globalsConfigLayer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                "FFBT_BUILD_VERSION": JSON.stringify(projectConfig.env.buildVersion),
            })
        ]
    };
};
