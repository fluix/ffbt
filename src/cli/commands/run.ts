import {Command, flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {ProjectBundler} from "../../project-bundler";
import {ProjectConfig} from "../../project-config";
import {inspect} from "util";
import * as path from "path";

enum Arguments {
    profileName = "profile_name",
    workingDirectory = "working_directory",
}

function getAbsoluteWorkdirPath(workdirPath: string) {
    return workdirPath
        ? path.resolve(process.cwd(), workdirPath)
        : process.cwd();
}

export default class RunWebpackCommand extends Command {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.profileName,
            required: true,
        },
        {
            name: Arguments.workingDirectory
        }
    ];

    static flags: flags.Input<any> = {
        optimize: flags.boolean({
            default: false,
        }),
        output: flags.string({
            default: undefined,
        })
    };



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

    async run() {
        const {args, flags} = this.parse(RunWebpackCommand);

        const workdir = getAbsoluteWorkdirPath(args[Arguments.workingDirectory]);
        const projectConfig = ProjectConfig.loadFromFile(workdir);
        const bundler = new ProjectBundler(projectConfig);

        console.log(inspect(bundler, {showHidden: false, depth: null}));

        bundler.run();
    }
}
