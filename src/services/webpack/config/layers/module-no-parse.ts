import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        module: {
            noParse: projectConfig.env.noParse,
            rules: [],
        },
    }
};

module.exports = layer;
