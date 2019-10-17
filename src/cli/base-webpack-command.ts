import {flags} from "@oclif/command";
import {BaseCommand} from "./base-command";
import {ProjectConfig} from "../project-config";
import {isNil, omitBy} from 'lodash';
import * as path from "path";
import {createWebpackConfig} from "../services/webpack/config";
import {ServiceRunStrategy} from "../services/webpack/runner";
import * as webpack from "webpack";

function getAbsoluteWorkdirPath(workdirPath: string) {
    return workdirPath
        ? path.resolve(process.cwd(), workdirPath)
        : process.cwd();
}

export abstract class BaseWebpackCommand extends BaseCommand {
    static flags: flags.Input<any> = {
        output: flags.string({
            default: undefined,
        }),
        buildVersion: flags.string({
            default: undefined,
        }),
        analyze: flags.boolean({
            default: false,
        }),
        ...BaseCommand.flags,
    };

    abstract getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy;

    runWebpack(relativeWorkdir: string, profileName: string, flags: any) {
        const workdir = getAbsoluteWorkdirPath(relativeWorkdir);
        const projectConfig = this.createProjectConfig(workdir, profileName, flags);
        const webpackConfig = createWebpackConfig(projectConfig, workdir);

        this.getWebpackRunner(webpackConfig).run();
    }

    protected createProjectConfig(workdir: string, profileName: string, flags: Record<string, any>): ProjectConfig {
        const projectConfig = ProjectConfig.loadFromFile(workdir);
        projectConfig.setCurrentProfileName(profileName);

        // Skip all null and undefined values, they'll be replaced by default values later
        const optionsWithValue = omitBy({
            outputPath: flags.output,
            analyzeBundle: flags.analyze,
            buildVersion: flags.buildVersion,
            verboseMode: flags.verbose,
        }, isNil);

        projectConfig.overrideProfileSettings(optionsWithValue);

        return projectConfig;
    }
}
