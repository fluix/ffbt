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
        analyze: flags.boolean({
            default: false,
        }),
        output: flags.string({
            default: undefined,
        })
    };

    async run() {
        // TODO: Provide interface for arugments and flags
        const {args, flags} = this.parse(RunWebpackCommand);

        const workdir = getAbsoluteWorkdirPath(args[Arguments.workingDirectory]);
        const projectConfig = ProjectConfig.loadFromFile(workdir);
        const bundler = new ProjectBundler(projectConfig);

        // console.log(inspect(bundler, {showHidden: false, depth: null}));

        const profileName = args[Arguments.profileName];

        bundler.run(profileName, workdir, {
            outputPath: flags.output,
            analyzeBundle: flags.analyze,
        });
    }
}
