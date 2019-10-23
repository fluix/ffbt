import {BaseWebpackCommand} from "../base-webpack-command";
import {MakeBundleStrategy} from "../../services/webpack/runner/make-bundle";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import * as webpack from "webpack";

export default class BuildCommand extends BaseWebpackCommand {
    static description = "build application for production";

    static args = BaseWebpackCommand.args;
    static flags = BaseWebpackCommand.flags;

    protected getEnvironment(): string {
        return "production";
    }

    protected getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new MakeBundleStrategy(webpackConfig);
    }
}
