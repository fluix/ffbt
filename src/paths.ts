import {dirname, resolve} from "path";
import * as findUp from "find-up";
import {existsSync} from "fs";

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

export function locateFile(name: string, cwd = "", raiseErrorIfNotExists = true): string {
    const locatedPath = findUp.sync(name, {
        cwd,
        type: "file",
    });
    if (!locatedPath && raiseErrorIfNotExists) {
        throw new Error(`Can't locate ${name}`);
    }

    return locatedPath || "";
}

export function locateDirectory(name: string, cwd = "", raiseErrorIfNotExists = true): string {
    const locatedPath = findUp.sync(name, {
        cwd,
        type: "directory",
    });
    if (!locatedPath && raiseErrorIfNotExists) {
        throw new Error(`Can't locate ${name}`);
    }

    return locatedPath || "";
}

function locateEntrypoint(workdirPath: string, tsEntrypointName: string): string {
    const tsPath = resolve(workdirPath, `${tsEntrypointName}.ts`);
    const tsxPath = resolve(workdirPath, `${tsEntrypointName}.tsx`);

    if (existsSync(tsPath)) {
        return tsPath;
    } if (existsSync(tsxPath)) {
        return tsxPath;
    }

    throw new Error(`Can't find entrypoint by path ${tsPath}(x)`);
}
