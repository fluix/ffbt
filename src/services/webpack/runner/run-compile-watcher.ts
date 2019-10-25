import * as webpack from "webpack";
import {cleanupIfError} from "../../../core/cleanup";
import {printVerboseWebpackStats} from "../utils/output";
import {ServiceRunStrategy} from "../../run-strategy";

export class RunWebpackCompileWatcherStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        const watcher = compiler.watch({}, printVerboseWebpackStats);

        cleanupIfError(() => {
            watcher.close(() => {
                console.log(" 👍");
            });
        });
    }
}
