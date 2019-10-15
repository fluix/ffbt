import {ProjectConfig} from "../project-config";
import {inspect} from "util";
import webpackMerge = require("webpack-merge");
import {ProjectPaths, WebpackLayerConfigurator} from "../webpack/types";

// const FFBT_ROOT_PATH = path.dirname(locatePath("node_modules", __dirname));
// const PROJECT_NODE_MODULES_PATH = locatePath("node_modules", workdir, false);

// const PROJECT_PACKAGE_JSON_PATH = locatePath("package.json", workdir);
// const PROJECT_ROOT_PATH = path.dirname(PROJECT_CONFIG_PATH);
// const ENTRYPOINT_PATH = locateEntrypoint(workdir);
//
// const PROJECT_PACKAGE_JSON = require(PROJECT_PACKAGE_JSON_PATH);
//
// const BUILD_WORKDIR = workdir
//     ? path.resolve(PROJECT_ROOT_PATH, workdir)
//     : PROJECT_ROOT_PATH;

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

        const paths: ProjectPaths = {
            workingDirectory,
        };

        const configuredWebpackLayers = layers.map(layer => layer(this.config, paths));
        const config = webpackMerge.smart(...configuredWebpackLayers);

        // console.log("Webpack Config", inspect(config, {showHidden: false, depth: null}));
        console.log("Webpack Config", config);
    }
}
