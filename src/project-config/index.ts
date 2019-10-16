import {Prop} from "../core/prop";
import {defaultConfig, IProjectConfig} from "./default";
import {merge} from "lodash";
import {Profile, ProfileRegistry} from "../core/profile-registry";
import * as webpack from "webpack";
import {locateFile} from "../paths";

export interface ProjectProfileProperties {
    outputPath: string;
    browserlist: string | Array<string>; // See https://github.com/browserslist/browserslist for syntax
    sourceMapType: "(none)" | webpack.Options.Devtool;
    buildVersion: string;
    staticFilesSizeThresholdKb: number;
    optimizeBundle: boolean;
}

export interface ProjectProfile extends Profile, ProjectProfileProperties {
}

export class ProjectConfig {
    private props: IProjectConfig;
    private readonly profiles = new ProfileRegistry<ProjectProfile>();
    private currentProfileName: string = "default";

    // We don't care about types in this getters, just proxy values which comes from props
    // If you try to specify types you'll get a lot of type errors in webpack layers
    // TODO: try th handle these problems and specify types
    @Prop() aliases!: any;
    @Prop() noParse!: any;

    constructor(projectConfig: Partial<IProjectConfig>) {
        this.props = this.applyDefaultsToConfig(projectConfig);

        this.profiles.addMany(this.props.profiles);
    }

    setCurrentProfileName(currentProfileName: string) {
        this.currentProfileName = currentProfileName;
    }

    get profile(): ProjectProfile {
        return this.profiles.get(this.currentProfileName);
    }

    overrideProfileSettings(optionsWithValue: Partial<ProjectProfileProperties>) {
        merge(this.profile, optionsWithValue);
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
