import {ServiceRunStrategy} from "./index";
import * as webpack from "webpack";

export class MakeBundleStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        // console.log("RUN BUILD", inspect(projectConfig, {showHidden: false, depth: null}));
        const compiler = webpack(this.webpackConfig);

        compiler.run((error, stats) => {
            // eslint-disable-next-line no-console
            console.log(stats.toString({
                colors: true,
            }));
        });
    }
}
