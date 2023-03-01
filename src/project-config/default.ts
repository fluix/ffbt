import {Environment} from "../core/environment-registry";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {Configuration} from "webpack/types";
import {WebpackLayerConfigurator, WebpackLayersGetter} from "../services/webpack/config/layers";

export interface IProjectConfig {
    environments: Record<string, Partial<ProjectEnv>> & {
        default: ProjectEnv;
    };
    configureWebpack?: WebpackLayerConfigurator;
    disableWebpackLayers?: WebpackLayersGetter;
}

export interface ProjectEnv extends Environment, ProjectEnvProperties {
}

export enum OutputStatsStyles {
    minimal = "minimal",
    normal = "normal",
    verbose = "verbose",
}

export interface ProjectEnvProperties {
    outputPath: string;
    browserlist: string | Array<string>; // See https://github.com/browserslist/browserslist for syntax
    sourceMapType: "(none)" | Configuration["devtool"];
    buildVersion: string;
    staticFilesSizeThresholdKb: number;
    optimizeBundle: boolean;
    analyzeBundle: boolean;
    verboseMode: boolean;
    enableTypeChecking: boolean;
    showBuildNotifications: boolean;
    cleanDistFolderBeforeBuild: boolean;
    htmlWebpackPluginConfig: Partial<HtmlWebpackPlugin.Options>,
    devServerConfig: Configuration["devServer"];
    enableCacheBusting: boolean;
    entrypointName: string;
    tsconfigPath: string;
    aliases: Record<string, string>;
    noParse?: RegExp | RegExp[] | ((content: string) => boolean);
    buildStatsStyle: OutputStatsStyles;
}

export const defaultConfig: IProjectConfig = {
    environments: {
        default: {
            browserlist: "last 2 versions",
            outputPath: "dist",
            sourceMapType: "(none)",
            buildVersion: String(Date()),
            staticFilesSizeThresholdKb: 8,
            optimizeBundle: false,
            analyzeBundle: false,
            verboseMode: false,
            showBuildNotifications: true,
            enableTypeChecking: true,
            cleanDistFolderBeforeBuild: false,
            htmlWebpackPluginConfig: {},
            enableCacheBusting: false,
            entrypointName: "index",
            tsconfigPath: "./tsconfig.json",
            aliases: {},
            noParse: undefined,
            buildStatsStyle: OutputStatsStyles.minimal,
            devServerConfig: {
                port: 9393,
                host: "0.0.0.0",
                open: true,
                historyApiFallback: true,
            },
        },
        development: {
            _extends: "default",
            sourceMapType: "eval-source-map",
        },
        production: {
            _extends: "default",
            sourceMapType: "nosources-source-map",
            optimizeBundle: true,
            showBuildNotifications: false,
            enableTypeChecking: false,
            cleanDistFolderBeforeBuild: true,
            enableCacheBusting: true,
            buildStatsStyle: OutputStatsStyles.normal,
        }
    },
    configureWebpack: undefined,
    disableWebpackLayers: () => [],
};
