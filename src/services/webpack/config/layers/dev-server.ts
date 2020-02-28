import {WebpackLayerConfigurator} from "../index";

export const devServerConfigLayer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        devServer: {
            stats: projectConfig.env.buildStatsStyle,
            ...projectConfig.env.devServerConfig,
            contentBase: projectConfig.env.outputPath,
        },
    }
};
