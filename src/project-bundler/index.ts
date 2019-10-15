import {ProjectConfig} from "../project-config";
import {inspect} from "util";
import webpackMerge = require("webpack-merge");
import {WebpackLayerConfigurator} from "../webpack/types";
import {calculateProjectPaths, ProjectPaths} from "../paths";

export class ProjectBundler {
    constructor(private config: ProjectConfig) {
    }

    run(workingDirectory: string) {
        // console.log("RUN BUILD", inspect(this.config, {showHidden: false, depth: null}));

        const layers: Array<WebpackLayerConfigurator> = [
            require("../webpack/layers/base").baseConfigLayer,
            require("../webpack/layers/typescript").typescriptConfigLayer,
            require("../webpack/layers/styles").stylesConfigLayer,
            require("../webpack/layers/index-file").indexFileConfigLayer,
            require("../webpack/layers/include-html").includeHtmlConfigLayer,
            require("../webpack/layers/assets").assetsConfigLayer,
            require("../webpack/layers/globals").globalsConfigLayer,

            require("../webpack/layers/dev-server").devServerConfigLayer,
            // require("../webpack/layers/bundle-analyze").bundleAnalyzeConfigLayer,
        ];

        const paths = calculateProjectPaths(workingDirectory);
        const configuredWebpackLayers = layers.map(layer => layer(this.config, paths));
        const config = webpackMerge.smart(...configuredWebpackLayers);

        // console.log("Webpack Config", inspect(config, {showHidden: false, depth: null}));
        console.log("Webpack Config", config);
    }
}
