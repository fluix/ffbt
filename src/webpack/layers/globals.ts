import * as webpack from "webpack";
import {WebpackLayerConfigurator} from "../types";

export const globalsConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                "FFBT_BUILD_VERSION": JSON.stringify(projectConfig.profile.buildVersion),
            })
        ]
    };
};
