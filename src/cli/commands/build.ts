import {BaseWebpackCommand} from "../base-webpack-command";
import {MakeBundleStrategy} from "../../services/webpack/runner/make-bundle";
import * as webpack from "webpack";
import {ServiceRunStrategy} from "../../services/run-strategy";

export default class BuildCommand extends BaseWebpackCommand {
    static description = "create an application bundle (for production, for example)";

    static args = BaseWebpackCommand.args;
    static flags = BaseWebpackCommand.flags;

    protected getDefaultEnvironment(): string {
        return "production";
    }

    protected getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new MakeBundleStrategy(webpackConfig);
    }
}
