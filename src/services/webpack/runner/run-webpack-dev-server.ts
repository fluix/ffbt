import * as webpack from "webpack";
import {Configuration} from "webpack/types";
import * as WebpackDevServer from "webpack-dev-server";
import {cleanupIfError} from "../../../core/cleanup";
import {ServiceRunStrategy} from "../../run-strategy";

export class RunWebpackDevServerStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);

        // webpack-dev-server v5 takes the options as the first argument and the
        // compiler as the second, and reads port/host from those options rather
        // than from listen() arguments.
        const server = new WebpackDevServer(
            {
                port: 9091,
                host: "localhost",
                ...this.webpackConfig.devServer,
            },
            compiler,
        );

        server.start().catch(console.error);

        cleanupIfError(() => {
            server.stop();
        });
    }
}
