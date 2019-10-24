import {WebpackLayerConfigurator} from "../index";
import * as WebpackBuildNotifierPlugin from "webpack-build-notifier";

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
            })
        ]
    };
};
