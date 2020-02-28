import * as webpack from "webpack";
import {cleanupIfError} from "../../../core/cleanup";
import {printWebpackStats} from "../utils/output";
import {ServiceRunStrategy} from "../../run-strategy";

export class RunWebpackCompileWatcherStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        const printStats = printWebpackStats(this.webpackConfig.stats);

        const watcher = compiler.watch({}, printStats);

        cleanupIfError(() => {
            watcher.close(() => {
                console.log(" 👍");
            });
        });
    }
}
