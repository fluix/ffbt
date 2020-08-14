import * as webpack from "webpack";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                "FFBT_BUILD_VERSION": JSON.stringify(projectConfig.env.buildVersion),
                "FFBT_ENV": JSON.stringify(projectConfig.env._name),
            })
        ]
    };
};

module.exports = layer;
