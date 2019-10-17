import {ProjectProfile} from "./index";
import * as webpack from "webpack";

export interface IProjectConfig {
    profiles: Record<string, Partial<ProjectProfile>> & {
        default: ProjectProfile;
    };
    aliases?: Pick<webpack.Resolve, "alias">;
    noParse?: Pick<webpack.Module, "noParse">;
}

export const defaultConfig: IProjectConfig = {
    profiles: {
        default: {
            browserlist: "last 2 versions",
            outputPath: "dist",
            sourceMapType: "(none)",
            buildVersion: String(Date()),
            staticFilesSizeThresholdKb: 8,
            optimizeBundle: false,
            analyzeBundle: false,
            verboseMode: false,
            cleanDistFolderBeforeBuild: false,
        },
        "default:development": {
            _extends: "default",
        },
        "default:production": {
            _extends: "default",
            sourceMapType: "nosources-source-map",
            optimizeBundle: true,
            cleanDistFolderBeforeBuild: true,
        },
        development: {
            _extends: "default:development"
        },
        production: {
            _extends: "default:production"
        }
    },
    noParse: undefined,
    aliases: {},
};
