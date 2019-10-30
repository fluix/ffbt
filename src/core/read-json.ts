import * as path from "path";
import * as fs from "fs";

const jsonExtension = ".json";

function isJsonFile(pathToFile: string): Boolean {
    const fileExtension = path.extname(pathToFile);

    return fileExtension === jsonExtension;
}

export function readJson<TData = any>(pathToFile: string): TData {
    if (!isJsonFile(pathToFile)) {
        throw new Error("Only json files are supported");
    }

    try {
        const jsonFile = fs.readFileSync(pathToFile, {encoding: "utf8"});
        return JSON.parse(jsonFile) as TData;
    } catch (e) {
        throw e;
    }
}
