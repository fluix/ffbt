import {ProjectConfig} from "../project-config";
import {inspect} from "util";
import webpackMerge = require("webpack-merge");

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

        const config = webpackMerge.smart(
            require("../webpack/layers/base"),
            require("../webpack/layers/typescript"),
            require("../webpack/layers/styles"),
            require("../webpack/layers/index-file"),
            require("../webpack/layers/include-html"),
            require("../webpack/layers/assets"),
            require("../webpack/layers/globals"),

            require("../webpack/layers/dev-server"),
            // require("../webpack/layers/bundle-analyze"),
        );

        // console.log("Webpack Config", inspect(config, {showHidden: false, depth: null}));
        console.log("Webpack Config", config);
    }
}
