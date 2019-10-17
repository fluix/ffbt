export function readJson<TData = any>(pathToFile: string): TData {
    // TODO: read only JSON files via readFile, json parse
    return require(pathToFile) as TData;
}
