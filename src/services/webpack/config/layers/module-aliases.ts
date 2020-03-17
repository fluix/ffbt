import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        resolve: {
            alias: projectConfig.env.aliases,
        },
    }
};

module.exports = layer;
