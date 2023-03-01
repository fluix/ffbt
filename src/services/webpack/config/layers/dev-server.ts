import {WebpackLayerConfig, WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig): WebpackLayerConfig<"devServer"> => {
    return {
        devServer: {
            devMiddleware: {
                stats: projectConfig.env.buildStatsStyle,
                ...projectConfig.env.devServerConfig?.devMiddleware,
            },
            ...projectConfig.env.devServerConfig,
            static: {
                directory: projectConfig.env.outputPath,
            },
        },
    }
};

module.exports = layer;
