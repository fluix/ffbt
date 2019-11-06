import {formatters, lint as styleLintRunner, LinterOptions as StyleLintOptions, LinterResult} from "stylelint";
import {ServiceRunStrategy} from "../run-strategy";

export class StyleLintRunner implements ServiceRunStrategy {
    constructor(private config: Partial<StyleLintOptions>, private force = false) {
    }

    get noErrorExitCode() {
        return this.force;
    }

    run() {
        styleLintRunner(this.config)
            .then(this.printResult)
            .catch(this.handleUnexpectedError);
    }

    private printResult = (data: LinterResult) => {
        // do things with data.output, data.errored,
        // and data.results
        const formattedResult = formatters.string(data.results);
        console.log(formattedResult); // eslint-disable-line no-console
        if (data.errored && !this.noErrorExitCode) {
            process.exitCode = 1;
        }
    };

    private handleUnexpectedError = (error: { stack: unknown }) => {
        // do things with err e.g.
        console.error(error.stack); // eslint-disable-line no-console
        if (!this.noErrorExitCode) {
            process.exitCode = 1;
        }
    };
}
