import {Prop} from "../core/prop";
import {defaultConfig, IProjectConfig} from "./default";
import {merge} from "lodash";
import {Environment, EnvironmentRegistry} from "../core/environment-registry";
import * as webpack from "webpack";
import {locateFile} from "../core/locate";

export interface ProjectEnvProperties {
    outputPath: string;
    browserlist: string | Array<string>; // See https://github.com/browserslist/browserslist for syntax
    sourceMapType: "(none)" | webpack.Options.Devtool;
    buildVersion: string;
    staticFilesSizeThresholdKb: number;
    optimizeBundle: boolean;
    analyzeBundle: boolean;
    verboseMode: boolean;
    cleanDistFolderBeforeBuild: boolean;
    moveLibrariesToSeparateBundle: boolean;
}

export interface ProjectEnv extends Environment, ProjectEnvProperties {
}

export class ProjectConfig {
    private props: IProjectConfig;
    private readonly environments = new EnvironmentRegistry<ProjectEnv>();
    private currentEnvName: string = "default";

    // We don't care about types in this getters, just proxy values which comes from props
    // If you try to specify types you'll get a lot of type errors in webpack layers
    // TODO: try to handle these problems and specify types
    @Prop() aliases!: any;
    @Prop() noParse!: any;

    constructor(projectConfig: Partial<IProjectConfig>) {
        this.props = this.applyDefaultsToConfig(projectConfig);

        this.environments.addMany(this.props.environments);
    }

    setCurrentEnvironmentName(currentEnvName: string) {
        this.currentEnvName = currentEnvName;
    }

    get env(): ProjectEnv {
        return this.environments.get(this.currentEnvName);
    }

    overrideEnvironmentSettings(optionsWithValue: Partial<ProjectEnvProperties>) {
        merge(this.env, optionsWithValue);
    }

    private applyDefaultsToConfig(config: Partial<IProjectConfig>): IProjectConfig {
        return merge({} as IProjectConfig, defaultConfig, config);
    }

    static loadFromFile(workingDirectory: string): ProjectConfig {
        const configPath = locateFile("ffbt-config.js", workingDirectory);
        const config = require(configPath);

        return new this(config);
    }
}
