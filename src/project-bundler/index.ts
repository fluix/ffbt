import {ProjectConfig, ProjectProfile} from "../project-config";
import {inspect} from "util";
import {printCriticalError} from "../utils/message";
import {ProfileRegistry} from "../core/profile-registry";
import {omitBy, isNil} from "lodash";

interface RunOptions {
    outputPath: string,
    analyzeBundle: boolean,
}

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
    private profiles = new ProfileRegistry<ProjectProfile>();

    constructor(private config: ProjectConfig) {
        this.profiles.addMany(this.config.profiles as any);
    }

    run(profileName: string, workingDirectory: string, options: Partial<RunOptions>) {
        console.log("RUN BUILD", inspect(options, {showHidden: false, depth: null}));

        const profile = this.profiles.get(profileName);

        if (!profile) {
            printCriticalError(`Can't find profile with name ${profileName}`);
            return;
        }

        const optionsWithValue = omitBy(options, isNil);
        const profileWithOptions = {...profile, ...optionsWithValue};

        console.log("ProfileWithOptions", profileWithOptions);
    }
}
