import {ProjectConfig} from "../../../project-config";
import * as webpack from "webpack";
import {calculateProjectPaths, ProjectPaths} from "../../../paths";
import * as webpackMerge from "webpack-merge";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => webpack.Configuration;

export function createWebpackConfig(projectConfig: ProjectConfig, workingDirectory: string): webpack.Configuration {
    const layers: Array<WebpackLayerConfigurator> = [
        require("./layers/base").baseConfigLayer,
        require("./layers/typescript").typescriptConfigLayer,
        require("./layers/styles").stylesConfigLayer,
        require("./layers/index-file").indexFileConfigLayer,
        require("./layers/include-html").includeHtmlConfigLayer,
        require("./layers/assets").assetsConfigLayer,
        require("./layers/globals").globalsConfigLayer,
        require("./layers/dev-server").devServerConfigLayer,
    ];

    if (projectConfig.profile.analyzeBundle) {
        layers.push(require("./layers/bundle-analyze").bundleAnalyzeConfigLayer);
    }

    if (projectConfig.profile.cleanDistFolderBeforeBuild) {
        layers.push(require("./layers/clean-dist").cleanDistFolderConfigLayer);
    }

    if (projectConfig.profile.moveLibrariesToSeparateBundle) {
        layers.push(require("./layers/vendor-bundle").vendorBundleConfigLayer);
    }

    if (projectConfig.profile.optimizeBundle) {
        layers.push(require("./layers/caching").cachingConfigLayer);
    }

    const paths = calculateProjectPaths(workingDirectory);
    const configuredWebpackLayers = layers.map(layer => layer(projectConfig, paths));

    return webpackMerge.smart(...configuredWebpackLayers);
}
