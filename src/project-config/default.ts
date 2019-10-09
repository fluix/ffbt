import {Profile} from "../core/profile-registry";

export interface IProjectConfig {
    profiles: Record<string, Profile>;
    aliases: any;
    noParse: any;
}

export const defaultConfig: IProjectConfig = {
    profiles: {
        default: {
            // supportedBrowsers: "last 2 versions",
            // buildPath: "dist",
            // webpackPlugins: {},
        },
        "default:development": {
            _extends: "default",
            // sourceMapType: "(none)",
        },
        "default:production": {
            _extends: "default",
            // sourceMapType: "nosources-source-map",
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
