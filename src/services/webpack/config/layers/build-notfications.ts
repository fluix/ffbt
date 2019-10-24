import {WebpackLayerConfigurator} from "../index";
import * as WebpackBuildNotifierPlugin from "webpack-build-notifier";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";

export const buildNotificationsConfigLayer: WebpackLayerConfigurator = () => {
    return {
        plugins: [
            // fix bad typings
            new (WebpackBuildNotifierPlugin as any)({
                title: "FFBT",
                showDuration: true,
                notifyOptions: {
                    group: "ffbt-build-result-notifier",
                }
            }),
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "FFBT Type Checker",
                skipFirstNotification: true,
                skipSuccessful: true,
            }),
        ]
    };
};
