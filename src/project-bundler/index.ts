import {ProjectConfig} from "../project-config";
import {inspect} from "util";

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
        console.log("RUN BUILD", inspect(this.config, {showHidden: false, depth: null}));
    }
}
