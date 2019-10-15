import * as path from "path";
import {locateDirectory, locateEntrypoint, locateFile} from "./core/utils/path";

export interface ProjectPaths {
    ffbtRoot: string;
    workingDirectory: string;
    projectNodeModulesPath: string;
    projectPackageJsonPath: string;
    projectConfigPath: string;
    projectRootPath: string;
    entrypointPath: string;
}

export function calculateProjectPaths(workingDirectory: string): ProjectPaths {
    const projectConfigPath = locateFile("ffbt-config.js", workingDirectory);
    const projectPackageJsonPath = locateFile("package.json", workingDirectory);

    return {
        workingDirectory,
        projectConfigPath,
        projectPackageJsonPath,
        entrypointPath: locateEntrypoint(workingDirectory, "index"),
        ffbtRoot: path.dirname(locateFile("package.json", __dirname)),
        projectNodeModulesPath: locateDirectory("node_modules", workingDirectory, false),
        projectRootPath: path.dirname(projectConfigPath),
    };
}
