import {Prop} from "../core/prop";
import {defaultConfig, IProjectConfig, ProjectEnv, ProjectEnvProperties} from "./default";
import {merge} from "lodash";
import {EnvironmentRegistry} from "../core/environment-registry";
import {DeepPartial} from "utility-types";
import {WebpackLayerConfigurator} from "../services/webpack/config";
import {locateFile} from "../core/locate";
import {ProjectPaths} from "./paths";

const CONFIG_FILE_NAME = "ffbt-config.js";

export class ProjectConfig {
    private props: IProjectConfig;
    private readonly environments = new EnvironmentRegistry<ProjectEnv>();
    private currentEnvName: string = "default";

    @Prop() configureWebpack!: WebpackLayerConfigurator;

    public readonly paths: ProjectPaths;

    constructor(
        public readonly sourcesDirectory: string,
        projectConfig: DeepPartial<IProjectConfig> = {},
        defaults = defaultConfig,
    ) {
        this.props = merge({} as IProjectConfig, defaults, projectConfig);
        this.fixIncorrectConfigValuesForWebpack();
        this.environments.addMany(this.props.environments);

        this.paths = new ProjectPaths(this);
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
        const noParse = this.env.noParse;
        const noParseIsEmptyArray = Array.isArray(noParse) && !noParse.length;
        const noParseIsNull = noParse === null;

        if (noParseIsEmptyArray || noParseIsNull) {
            this.env.noParse = undefined;
        }
    }

    static getPathToConfigFile(sourcesDirectory: string): string | null {
        return locateFile(CONFIG_FILE_NAME, sourcesDirectory, false) || null;
    }

    static loadFromFile(sourcesDirectory: string): ProjectConfig {
        const configPath = this.getPathToConfigFile(sourcesDirectory);

        if (!configPath) {
            // It's OK if we can't find the config, just create it from default values
            return new this(sourcesDirectory);
        }

        const config = require(configPath);
        return new this(sourcesDirectory, config);
    }
}
