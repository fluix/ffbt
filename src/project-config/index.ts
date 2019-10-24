import {Prop} from "../core/prop";
import {defaultConfig, IProjectConfig, ProjectEnv, ProjectEnvProperties} from "./default";
import {merge} from "lodash";
import {EnvironmentRegistry} from "../core/environment-registry";
import {locateFile} from "../core/locate";
import {DeepPartial} from "utility-types";

export class ProjectConfig {
    private props: IProjectConfig;
    private readonly environments = new EnvironmentRegistry<ProjectEnv>();
    private currentEnvName: string = "default";

    // We don't care about types in this getters, just proxy values which comes from props
    // If you try to specify types you'll get a lot of type errors in webpack layers
    @Prop() aliases!: any;
    @Prop() noParse!: any;

    constructor(projectConfig: DeepPartial<IProjectConfig> = {}) {
        this.props = merge({} as IProjectConfig, defaultConfig, projectConfig);
        this.fixIncorrectConfigValuesForWebpack();

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

    // Normalize some values that seems to be correct but webpack interprets them as incorrect
    private fixIncorrectConfigValuesForWebpack() {
        const noParseIsEmptyArray = Array.isArray(this.noParse) && !this.noParse.length;
        const noParseIsNull = this.noParse === null;

        if (noParseIsEmptyArray || noParseIsNull) {
            this.props.noParse = undefined;
        }
    }

    static loadFromFile(workingDirectory: string): ProjectConfig {
        const configPath = locateFile("ffbt-config.js", workingDirectory);
        const config = require(configPath);

        return new this(config);
    }
}
