import {flags} from "@oclif/command";
import {BaseCommand} from "./base-command";
import {ProjectConfig} from "../project-config";
import {isNil, omitBy} from 'lodash';
import * as path from "path";
import {createWebpackConfig} from "../services/webpack/config";
import {ServiceRunStrategy} from "../services/webpack/runner";
import * as webpack from "webpack";
import * as Parser from "@oclif/parser";

enum BaseWebpackCommandArguments {
    sourcesDirectory = "sources_directory",
}

function getAbsoluteWorkdirPath(workdirPath: string) {
    return workdirPath
        ? path.resolve(process.cwd(), workdirPath)
        : process.cwd();
}

export abstract class BaseWebpackCommand extends BaseCommand {
    static args: Array<Parser.args.IArg> = [
        {
            name: BaseWebpackCommandArguments.sourcesDirectory,
            description: "directory with sources of the application",
        }
    ];

    static flags: flags.Input<any> = {
        output: flags.string({
            default: undefined,
            description: "a directory where to put the bundled app",
        }),
        buildVersion: flags.string({
            default: undefined,
            description: "string represents version of the build. Can be used for CI needs",
        }),
        analyze: flags.boolean({
            default: false,
            description: "run bundle analyze tools",
        }),
        ...BaseCommand.flags,
    };

    abstract getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy;

    runWebpack(relativeWorkdir: string, environmentName: string, flags: any) {
        const workdir = getAbsoluteWorkdirPath(relativeWorkdir);
        const projectConfig = this.createProjectConfig(workdir, environmentName, flags);
        const webpackConfig = createWebpackConfig(projectConfig, workdir);

        this.getWebpackRunner(webpackConfig).run();
    }

    protected getSourcesDirectory(): string {
        const {args} = this.parse(BaseWebpackCommand);
        return args[BaseWebpackCommandArguments.sourcesDirectory];
    }

    protected createProjectConfig(workdir: string, environmentName: string, flags: Record<string, any>): ProjectConfig {
        const projectConfig = ProjectConfig.loadFromFile(workdir);
        projectConfig.setCurrentEnvironmentName(environmentName);

        // Skip all null and undefined values, they'll be replaced by default values later
        const optionsWithValue = omitBy({
            outputPath: flags.output,
            analyzeBundle: flags.analyze,
            buildVersion: flags.buildVersion,
            verboseMode: flags.verbose,
        }, isNil);

        projectConfig.overrideEnvironmentSettings(optionsWithValue);

        return projectConfig;
    }
}
