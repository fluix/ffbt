import {WebpackLayerConfigurator} from "../types";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

export const cleanDistFolderConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        plugins: [
            new CleanWebpackPlugin({
                verbose: projectConfig.profile.verboseMode,
            }),
        ]
    };
};
