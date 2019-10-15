import * as path from "path";
import * as fs from "fs";
import * as findUp from "find-up";

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

export function locateEntrypoint(workdirPath: string, tsEntrypointName: string): string {
    const tsPath = path.resolve(workdirPath, `${tsEntrypointName}.ts`);
    const tsxPath = path.resolve(workdirPath, `${tsEntrypointName}.tsx`);

    if (fs.existsSync(tsPath)) {
        return tsPath;
    } if (fs.existsSync(tsxPath)) {
        return tsxPath;
    }

    throw new Error(`Can't find entrypoint by path ${tsPath}(x)`);
}

export function locateTsConfigFile(projectRoot: string): string {
    return locateFile("tsconfig.json", projectRoot);
}
