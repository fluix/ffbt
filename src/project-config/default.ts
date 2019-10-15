import {ProjectProfile} from "./index";

export interface IProjectConfig {
    profiles: Record<string, Partial<ProjectProfile>> & {
        default: ProjectProfile;
    };
    aliases: any;
    noParse: any;
}

export const defaultConfig: IProjectConfig = {
    profiles: {
        default: {
            browserlist: "last 2 versions",
            outputPath: "dist",
            sourceMapType: "(none)",
            buildVersion: "--not-specified--",
        },
        "default:development": {
            _extends: "default",
        },
        "default:production": {
            _extends: "default",
            sourceMapType: "nosources-source-map",
        },
        development: {
            _extends: "default:development"
        },
        production: {
            _extends: "default:production"
        }
    },
    noParse: undefined,
    aliases: [],
};
