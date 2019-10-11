import * as path from "path";
import * as fs from "fs";
import * as findUp from "find-up";

export function locatePath(name: string, cwd = "", raiseErrorIfNotExists = true): string {
    const locatedPath = findUp.sync(name, {
        cwd,
    });
    if (!locatedPath && raiseErrorIfNotExists) {
        throw new Error(`Can't locate ${name}`);
    }

    return locatedPath || "";
}

export function locateEntrypoint(workdirPath: string, tsEntrypointName: string): string | null {
    const tsPath = path.resolve(workdirPath, `${tsEntrypointName}.ts`);
    const tsxPath = path.resolve(workdirPath, `${tsEntrypointName}.tsx`);

    if (fs.existsSync(tsPath)) {
        return tsPath;
    } if (fs.existsSync(tsxPath)) {
        return tsxPath;
    }
    return null;
}

export function locateTsConfigFile(projectRoot: string): string {
    return locatePath("tsconfig.json", projectRoot);
}
