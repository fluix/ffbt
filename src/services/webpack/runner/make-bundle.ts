import {ServiceRunStrategy} from "./index";
import * as webpack from "webpack";
import {printVerboseWebpackStats} from "../utils/output";

export class MakeBundleStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        compiler.run(printVerboseWebpackStats);
    }
}
