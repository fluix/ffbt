import {WebpackLayerConfig, WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig): WebpackLayerConfig<"devServer"> => {
    return {
        devServer: {
            stats: projectConfig.env.buildStatsStyle,
            ...projectConfig.env.devServerConfig,
            contentBase: projectConfig.env.outputPath,
        },
    }
};

module.exports = layer;
