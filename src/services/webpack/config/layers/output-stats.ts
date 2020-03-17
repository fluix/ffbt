import {ProjectConfig} from "../../../../project-config";
import {Stats} from "webpack";
import {OutputStatsStyles} from "../../../../project-config/default";
import {WebpackLayerConfigurator} from "./index";

// https://webpack.js.org/configuration/stats/#stats
const webpackLoggingConfigs = {
    [OutputStatsStyles.minimal]: "minimal",
    [OutputStatsStyles.normal]: {
        logging: "info",
        colors: true,
        warnings: true,
    },
    [OutputStatsStyles.verbose]: {
        logging: "verbose",
        loggingTrace: true,
        colors: true,
        loggingDebug: [
            () => true
        ],
    }
};

function getStatsLoggingConfig(projectConfig: ProjectConfig): Stats.ToStringOptions {
    const presetName = projectConfig.env.verboseMode
        ? OutputStatsStyles.verbose
        : projectConfig.env.buildStatsStyle;

    const loggingConfig = webpackLoggingConfigs[presetName];
    if (!loggingConfig) {
        throw new Error(`Can't find stats logging preset with name ${presetName}`);
    }

    return loggingConfig as Stats.ToStringOptions;
}

const layer: WebpackLayerConfigurator = (projectConfig) => {
    return {
        stats: getStatsLoggingConfig(projectConfig),
    };
};

module.exports = layer;
