import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";
import * as WebpackNotifierPlugin from "webpack-notifier";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = () => {
    return {
        plugins: [
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "FFBT Type Checker",
                skipFirstNotification: true,
                skipSuccessful: true,
            }),
            new WebpackNotifierPlugin({
                title: "FFBT",
                alwaysNotify: true,
                excludeWarnings: true,
            }),
        ]
    };
};

module.exports = layer;
