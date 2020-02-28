import {flags} from "@oclif/command";
import {BaseCommand, BaseFlags} from "./base-command";
import {ProjectConfig} from "../project-config";
import {omitBy} from 'lodash';
import * as path from "path";
import {createWebpackConfig} from "../services/webpack/config";
import * as webpack from "webpack";
import * as Parser from "@oclif/parser";
import {ServiceRunStrategy} from "../services/run-strategy";
import {ProjectEnvProperties} from "../project-config/default";

export interface BaseWebpackFlags extends BaseFlags {
    output: string | undefined;
    buildVersion: string | undefined;
    env: string | undefined;
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
        env: flags.string({
            default: undefined,
            description: "environment name",
        }),
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
    protected abstract getDefaultEnvironment(): string;

    async run() {
        const flags = this.getFlags<BaseWebpackFlags>();

        const sourcesDirectory = this.getAbsoluteSourcesDirectory(this.getSourcesDirectory());
        const environment = flags.env || this.getDefaultEnvironment();

        const projectConfig = this.createProjectConfig(sourcesDirectory, environment, flags);
        const webpackConfig = createWebpackConfig(projectConfig, sourcesDirectory);

        this.printBannerWithBuildInfo(projectConfig, flags.verbose);

        this.getWebpackRunner(webpackConfig).run();
    }

    protected getSourcesDirectory(): string {
        const args = this.getArguments<any>();
        return args[Arguments.sourcesDirectory];
    }

    private createProjectConfig(sourcesDir: string, environmentName: string, flags: BaseWebpackFlags): ProjectConfig {
        const projectConfig = ProjectConfig.loadFromFile(sourcesDir);
        projectConfig.setCurrentEnvironmentName(environmentName);

        const flagsMappedToEnvFields: Partial<ProjectEnvProperties> = {
            outputPath: flags.output,
            analyzeBundle: flags.analyze,
            buildVersion: flags.buildVersion,
            verboseMode: flags.verbose,
        };

        const optionsWithValue = omitBy(flagsMappedToEnvFields, this.isFalseOrNil);
        projectConfig.overrideEnvironmentSettings(optionsWithValue);

        return projectConfig;
    }

    private isFalseOrNil = (value: any) => {
        return value === null || value === undefined || value === false;
    };

    private getAbsoluteSourcesDirectory(workdirPath: string) {
        return workdirPath
            ? path.resolve(process.cwd(), workdirPath)
            : process.cwd();
    }

    private printBannerWithBuildInfo(projectConfig: ProjectConfig, verbose: boolean) {
        console.log("Environment: " + projectConfig.env._name);
        console.log("Source Directory: " + projectConfig.paths.projectWorkingDirectory);

        if (verbose) {
            console.log("Current environment", projectConfig.env, "\n");
            console.log("Paths", projectConfig.paths.getAll(), "\n");
        }
    }
}
