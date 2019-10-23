import {Options as TsLintOptions, run as tsLintRunner} from "tslint/lib/runner";

export class TsLintRunner {
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
