import {ProjectConfig} from "../../../project-config";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import {FFBTLayers, registerLayer, WebpackConfigLayer} from "./layers";

export function createWebpackConfig(projectConfig: ProjectConfig, workingDirectory: string): webpack.Configuration {
    const layers: Array<WebpackConfigLayer> = [
        registerLayer(FFBTLayers.base, require("./layers/base")),
        registerLayer(FFBTLayers.moduleAliases, require("./layers/module-aliases")),
        registerLayer(FFBTLayers.moduleNoParse, require("./layers/module-no-parse")),
        registerLayer(FFBTLayers.outputStats, require("./layers/output-stats")),
        registerLayer(FFBTLayers.typescript, require("./layers/typescript")),
        registerLayer(FFBTLayers.styles, require("./layers/styles")),
        registerLayer(FFBTLayers.indexFile, require("./layers/index-file")),
        registerLayer(FFBTLayers.includeHtml, require("./layers/include-html")),
        registerLayer(FFBTLayers.staticAssets, require("./layers/static-assets")),
        registerLayer(FFBTLayers.globals, require("./layers/globals")),
        registerLayer(FFBTLayers.devServer, require("./layers/dev-server")),
    ];

    if (projectConfig.env.showBuildNotifications) {
        layers.push(registerLayer(FFBTLayers.buildNotifications, require("./layers/build-notfications")));
    }

    if (projectConfig.env.analyzeBundle) {
        layers.push(registerLayer(FFBTLayers.bundleAnalyze, require("./layers/bundle-analyze")));
    }

    if (projectConfig.env.cleanDistFolderBeforeBuild) {
        layers.push(registerLayer(FFBTLayers.cleanDist, require("./layers/clean-dist")));
    }

    if (projectConfig.env.enableCacheBusting) {
        layers.push(registerLayer(FFBTLayers.caching, require("./layers/caching")));
    }

    const customWebpackLayer = projectConfig.configureWebpack;
    if (customWebpackLayer) {
        layers.push(registerLayer(FFBTLayers.custom, customWebpackLayer));
    }

    const disabledLayers = projectConfig.disableWebpackLayers(projectConfig);
    const layersWithoutDisabled = layers.filter(layer => !disabledLayers.includes(layer.name));
    const configuredWebpackLayers = layersWithoutDisabled.map(layer => layer.configurator(projectConfig));

    if (projectConfig.env.verboseMode) {
        console.log("Enabled webpack config layers:");
        console.log(layersWithoutDisabled.map(layer => layer.name));
        console.log();
    }

    return webpackMerge.merge(...configuredWebpackLayers as [webpack.Configuration]);
}
