import {resolve} from "path";
import * as findUp from "find-up";
import {existsSync} from "fs";

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
    const tsPath = resolve(workdirPath, `${tsEntrypointName}.ts`);
    const tsxPath = resolve(workdirPath, `${tsEntrypointName}.tsx`);

    if (existsSync(tsPath)) {
        return tsPath;
    } if (existsSync(tsxPath)) {
        return tsxPath;
    }

    throw new Error(`Can't find entrypoint by path ${tsPath}(x)`);
}
