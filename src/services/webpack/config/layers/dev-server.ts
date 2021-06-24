import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig): any => {
    return {
        devServer: {
            stats: projectConfig.env.buildStatsStyle,
            ...projectConfig.env.devServerConfig,
            contentBase: projectConfig.env.outputPath,
        },
    }
};

module.exports = layer;
