import {ProjectConfig} from "../../../../project-config";
import * as webpack from "webpack";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig) => webpack.Configuration;

export enum FFBTLayers {
    typescript = "typescript",
    styles = "styles",
    buildNotifications = "buildNotifications",
    bundleAnalyze = "bundleAnalyze",
    caching = "caching",
    cleanDist = "cleanDist",
    devServer = "devServer",
    globals = "globals",
    includeHtml = "includeHtml",
    indexFile = "indexFile",
    outputStats = "outputStats",
    staticAssets = "staticAssets",
}

export interface WebpackConfigLayer {
    name: FFBTLayers | string;
    configurator: WebpackLayerConfigurator;
}

export function registerLayer(name: FFBTLayers | string, configurator: WebpackLayerConfigurator): WebpackConfigLayer {
    return {
        name,
        configurator,
    }
}
