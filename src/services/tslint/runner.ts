import {Options as TsLintOptions, run as tsLintRunner} from "tslint/lib/runner";
import {ServiceRunStrategy} from "../run-strategy";

export class TsLintRunner implements ServiceRunStrategy {
    constructor(private config: TsLintOptions) {
    }

    run() {
        tsLintRunner(this.config, console)
            .then(returnCode => process.exitCode = returnCode)
            .catch(error => {
                console.error(error);
                process.exitCode = 1;
            });
    }
}
