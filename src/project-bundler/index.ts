import {ProjectConfig} from "../project-config";
import {WebpackLayerConfigurator} from "../webpack/types";
import {calculateProjectPaths} from "../paths";
import * as webpack from "webpack";
import webpackMerge = require("webpack-merge");

export class ProjectBundler {
    constructor(private config: ProjectConfig) {
    }

    run(workingDirectory: string) {
        // console.log("RUN BUILD", inspect(this.config, {showHidden: false, depth: null}));

        const config = this.createWebpackConfig(workingDirectory);

        // console.log("Webpack Config", inspect(config, {showHidden: false, depth: null}));
        // console.log("Webpack Config", config);

        const compiler = webpack(config);

        compiler.run((error, stats) => {
            // eslint-disable-next-line no-console
            console.log(stats.toString({
                colors: true,
            }));
        });
    }

    private createWebpackConfig(workingDirectory: string): webpack.Configuration {
        const layers: Array<WebpackLayerConfigurator> = [
            require("../webpack/layers/base").baseConfigLayer,
            require("../webpack/layers/typescript").typescriptConfigLayer,
            require("../webpack/layers/styles").stylesConfigLayer,
            require("../webpack/layers/index-file").indexFileConfigLayer,
            require("../webpack/layers/include-html").includeHtmlConfigLayer,
            require("../webpack/layers/assets").assetsConfigLayer,
            require("../webpack/layers/globals").globalsConfigLayer,

            require("../webpack/layers/dev-server").devServerConfigLayer,
        ];

        if (this.config.profile.analyzeBundle) {
            layers.push(require("../webpack/layers/bundle-analyze").bundleAnalyzeConfigLayer);
        }

        const paths = calculateProjectPaths(workingDirectory);
        const configuredWebpackLayers = layers.map(layer => layer(this.config, paths));

        return webpackMerge.smart(...configuredWebpackLayers);
    }
}
