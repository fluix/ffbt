import * as path from "path";
import {locateDirectory, locateEntrypoint, locateFile} from "./core/utils/path";

export interface ProjectPaths {
    project: {
        nodeModules: string;
        packageJson: string;
        config: string;
        root: string;
        entrypoint: string;
        workingDirectory: string;
    };
    ffbtRoot: string;
}

export function calculateProjectPaths(workingDirectory: string): ProjectPaths {
    const projectConfigPath = locateFile("ffbt-config.js", workingDirectory);
    const projectPackageJsonPath = locateFile("package.json", workingDirectory);

    return {
        ffbtRoot: path.dirname(locateFile("package.json", __dirname)),
        project: {
            workingDirectory,
            nodeModules: locateDirectory("node_modules", workingDirectory, false),
            packageJson: projectPackageJsonPath,
            config: projectConfigPath,
            root: path.dirname(projectConfigPath),
            entrypoint: locateEntrypoint(workingDirectory, "index"),
        }
    };
}
