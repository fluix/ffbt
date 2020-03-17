import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        plugins: [
            new CleanWebpackPlugin({
                verbose: projectConfig.env.verboseMode,
            }),
        ]
    };
};

module.exports = layer;
