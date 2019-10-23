import {flags} from "@oclif/command";
import {BaseCommand, BaseFlags} from "./base-command";
import {ProjectConfig} from "../project-config";
import {isNil, omitBy} from 'lodash';
import * as path from "path";
import {createWebpackConfig} from "../services/webpack/config";
import * as webpack from "webpack";
import * as Parser from "@oclif/parser";
import {ServiceRunStrategy} from "../services/run-strategy";

export interface BaseWebpackFlags extends BaseFlags {
    output: string | undefined;
    buildVersion: string | undefined;
    analyze: boolean;
}

enum Arguments {
    sourcesDirectory = "sources_directory",
}

/**
 * Parent class to run any webpack command. Just extend from it and enjoy
 */
export abstract class BaseWebpackCommand extends BaseCommand {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.sourcesDirectory,
            description: "directory with sources of the application",
            required: false,
        }
    ];

    static flags: flags.Input<BaseWebpackFlags> = {
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

    protected abstract getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy;
    protected abstract getEnvironment(): string;

    async run() {
        const flags = this.getFlags<BaseWebpackFlags>();

        const sourcesDirectory = this.getAbsoluteSourcesDirectory(this.getSourcesDirectory());
        const environment = this.getEnvironment();

        const projectConfig = this.createProjectConfig(sourcesDirectory, environment, flags);
        const webpackConfig = createWebpackConfig(projectConfig, sourcesDirectory);

        this.getWebpackRunner(webpackConfig).run();
    }

    protected getSourcesDirectory(): string {
        const args = this.getArguments<any>();
        return args[Arguments.sourcesDirectory];
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

    private getAbsoluteSourcesDirectory(workdirPath: string) {
        return workdirPath
            ? path.resolve(process.cwd(), workdirPath)
            : process.cwd();
    }
}
