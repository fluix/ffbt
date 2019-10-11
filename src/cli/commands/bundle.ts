import {Command, flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {ProjectBundler} from "../../project-bundler";
import {ProjectConfig} from "../../project-config";
import * as path from "path";
import {isNil, omitBy} from 'lodash';

enum Arguments {
    profileName = "profile_name",
    workingDirectory = "working_directory",
}

function getAbsoluteWorkdirPath(workdirPath: string) {
    return workdirPath
        ? path.resolve(process.cwd(), workdirPath)
        : process.cwd();
}

export default class CreateBundleCommand extends Command {
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
        const {args, flags} = this.parse(CreateBundleCommand);

        const workdir = getAbsoluteWorkdirPath(args[Arguments.workingDirectory]);
        const profileName = args[Arguments.profileName];

        const projectConfig = this.createProjectConfig(workdir, profileName, flags);
        const bundler = new ProjectBundler(projectConfig);

        bundler.run(workdir);
    }

    private createProjectConfig(workdir: string, profileName: string, flags: Record<string, any>): ProjectConfig {
        const projectConfig = ProjectConfig.loadFromFile(workdir);
        projectConfig.setCurrentProfileName(profileName);

        // Skip all null and undefined values, they'll be replaced by default values later
        const optionsWithValue = omitBy({
            outputPath: flags.output,
            analyzeBundle: flags.analyze,
        }, isNil);

        projectConfig.overrideProfileSettings(optionsWithValue);

        return projectConfig;
    }
}
