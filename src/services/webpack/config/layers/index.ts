import {ProjectConfig} from "../../../../project-config";
import {Configuration} from "webpack/types";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig) => Configuration;
export type WebpackLayerConfig<T extends keyof Configuration> = Pick<Configuration, T>;
export type WebpackLayersGetter = (projectConfig: ProjectConfig) => Array<FFBTLayers>;

export enum FFBTLayers {
    base = "base",
    moduleNoParse = "moduleNoParse",
    moduleAliases = "moduleAliases",
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
    custom = "custom",
}

export interface WebpackConfigLayer {
    name: FFBTLayers;
    configurator: WebpackLayerConfigurator;
}

export function registerLayer(name: FFBTLayers, configurator: WebpackLayerConfigurator): WebpackConfigLayer {
    return {
        name,
        configurator,
    }
}
