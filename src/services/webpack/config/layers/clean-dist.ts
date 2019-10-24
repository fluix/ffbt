import {WebpackLayerConfigurator} from "../index";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

export const cleanDistFolderConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        plugins: [
            new CleanWebpackPlugin({
                verbose: projectConfig.env.verboseMode,
            }),
        ]
    };
};
