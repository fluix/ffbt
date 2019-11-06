import * as webpack from "webpack";
import {printVerboseWebpackStats} from "../utils/output";
import {ServiceRunStrategy} from "../../run-strategy";

export class MakeBundleStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        compiler.run((err, stats) => {
            printVerboseWebpackStats(err, stats);
            console.log("\nDone 🍺🍺🍺\n");
        });
    }
}
