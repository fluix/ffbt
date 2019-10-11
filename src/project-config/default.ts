import {ProjectProfile} from "./index";

export interface IProjectConfig {
    profiles: {
        default: ProjectProfile;
        [key: string]: Partial<ProjectProfile>;
    }
    aliases: any;
    noParse: any;
}

export const defaultConfig: IProjectConfig = {
    profiles: {
        default: {
            browserlist: "last 2 versions",
            outputPath: "dist",
            sourceMapType: "(none)",
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
