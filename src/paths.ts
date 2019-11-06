import {dirname} from "path";
import {locateDirectory, locateEntrypoint, locateFile} from "./core/locate";
import {Memoize} from "./core/memoize-decorator";

export class ProjectPaths {
    constructor(private workingDirectory: string) {
    }

    getAll() {
        return {
            ffbtRoot: this.ffbtRoot,
            projectConfig: this.projectConfig,
            projectPackageJson: this.projectPackageJson,
            projectRoot: this.projectRoot,
            projectWorkingDirectory: this.projectWorkingDirectory,
            projectNodeModules: this.projectNodeModules,
            projectEntrypoint: this.projectEntrypoint,
            projectTsConfig: this.projectTsConfig,
        }
    }

    @Memoize()
    get ffbtRoot(): string {
        return dirname(locateFile("package.json", __dirname));
    }

    @Memoize()
    get projectConfig(): string {
        return locateFile("ffbt-config.js", this.workingDirectory);
    }

    @Memoize()
    get projectPackageJson(): string {
        return locateFile("package.json", this.workingDirectory);
    }

    @Memoize()
    get projectRoot(): string {
        return dirname(this.projectConfig);
    }

    @Memoize()
    get projectWorkingDirectory(): string {
        return this.workingDirectory;
    }

    @Memoize()
    get projectNodeModules(): string {
        return locateDirectory("node_modules", this.workingDirectory, false);
    }

    @Memoize()
    get projectEntrypoint(): string {
        return locateEntrypoint(this.workingDirectory, "index");
    }

    @Memoize()
    get projectTsConfig(): string {
        return locateFile("tsconfig.json", this.projectRoot);
    }
}
