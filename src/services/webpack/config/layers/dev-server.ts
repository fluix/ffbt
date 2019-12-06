import {WebpackLayerConfigurator} from "../index";

export const devServerConfigLayer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        devServer: {
            ...projectConfig.env.devServerConfig,
            contentBase: projectConfig.env.outputPath,
        },
    }
};
