import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import {cleanupIfError} from "../../../core/cleanup";
import {ServiceRunStrategy} from "../../run-strategy";

export class RunWebpackDevServerStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        const server = new WebpackDevServer(compiler, this.webpackConfig.devServer);

        const {port, host} = {
            port: 9091,
            host: "localhost",
            ...this.webpackConfig.devServer,
        };

        server.listen(port, host);

        cleanupIfError(() => {
            server.close();
        });
    }
}
