import {dirname} from "path";
import {locateDirectory, locateEntrypoint, locateFile} from "./core/locate";

export interface ProjectPaths {
    project: {
        nodeModules: string;
        packageJson: string;
        config: string;
        root: string;
        entrypoint: string;
        workingDirectory: string;
        tsConfig: string;
    };
    ffbtRoot: string;
}

export function calculateProjectPaths(workingDirectory: string): ProjectPaths {
    const projectConfigPath = locateFile("ffbt-config.js", workingDirectory);
    const projectPackageJsonPath = locateFile("package.json", workingDirectory);
    const projectRoot = dirname(projectConfigPath);

    return {
        ffbtRoot: dirname(locateFile("package.json", __dirname)),
        project: {
            workingDirectory,
            nodeModules: locateDirectory("node_modules", workingDirectory, false),
            packageJson: projectPackageJsonPath,
            config: projectConfigPath,
            root: projectRoot,
            entrypoint: locateEntrypoint(workingDirectory, "index"),
            tsConfig: locateFile("tsconfig.json", projectRoot),
        }
    };
}
