import {WebpackLayerConfigurator} from "../index";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";
import * as WebpackNotifierPlugin from "webpack-notifier";

export const buildNotificationsConfigLayer: WebpackLayerConfigurator = () => {
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
            }),
        ]
    };
};
