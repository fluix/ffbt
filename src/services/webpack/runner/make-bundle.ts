import * as webpack from "webpack";
import {Configuration} from "webpack/types";
import {printWebpackStats} from "../utils/output";
import {ServiceRunStrategy} from "../../run-strategy";

export class MakeBundleStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        const printStats = printWebpackStats(this.webpackConfig.stats);

        compiler.run((err, stats) => {
            printStats(err, stats);
            console.log("\nDone 🍺🍺🍺\n");
        });
    }
}
