import {ProjectEnv} from "./index";
import * as webpack from "webpack";

export interface IProjectConfig {
    environments: Record<string, Partial<ProjectEnv>> & {
        default: ProjectEnv;
    };
    aliases?: Pick<webpack.Resolve, "alias">;
    noParse?: Pick<webpack.Module, "noParse">;
}

export const defaultConfig: IProjectConfig = {
    environments: {
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
            moveLibrariesToSeparateBundle: true,
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
