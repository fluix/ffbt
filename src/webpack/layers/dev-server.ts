import {WebpackLayerConfigurator} from "../types";
import * as WebpackDevServer from "webpack-dev-server";

export const devServerConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const devServerConfig: WebpackDevServer.Configuration = {
        open: true,
        overlay: true,
        port: 9393,
        inline: true,
        contentBase: projectConfig.profile.outputPath,
        host: "0.0.0.0",
        historyApiFallback: true,
        publicPath: "/",
        stats: {
            colors: true,
        },
    };

    return {
        devServer: devServerConfig,
    }
};
