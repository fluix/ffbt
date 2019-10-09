import {Prop} from "../core/prop";
import {defaultConfig, IProjectConfig} from "./default";
import {merge} from "lodash";
import {locatePath} from "../utils/path";
import {loadJSON} from "../utils/file";

export class ProjectConfig {
    private props: IProjectConfig;

    @Prop() profiles!: Pick<IProjectConfig, "profiles">;
    @Prop() aliases!: Pick<IProjectConfig, "aliases">;
    @Prop() noParse!: Pick<IProjectConfig, "noParse">;

    constructor(projectConfig: Partial<IProjectConfig>) {
        this.props = this.applyDefaultsToConfig(projectConfig);
    }

    private applyDefaultsToConfig(config: Partial<IProjectConfig>): IProjectConfig {
        return merge({} as IProjectConfig, defaultConfig, config);
    }

    static loadFromFile(workingDirectory: string): ProjectConfig {
        const configPath = locatePath("ffbt-config.js", workingDirectory);
        const config = loadJSON(configPath);

        return new this(config);
    }
}
