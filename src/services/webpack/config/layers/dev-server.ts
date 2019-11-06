import {WebpackLayerConfigurator} from "../index";

export const devServerConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        devServer: {
            ...projectConfig.env.devServerConfig,
            contentBase: projectConfig.env.outputPath,
        },
    }
};
