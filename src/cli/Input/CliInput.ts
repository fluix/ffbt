import {Profile} from "../../core/ProfileRegistry/ProfileRegistry";
import {AllMaybeUndefined} from "../../core/utility-types";

interface CliInputAttributes {
    analyze: Partial<boolean>;
    output: string | undefined;
}

interface BuildProfile extends Profile {
    analyzeBundle: boolean;
    outputPath: string | undefined;
}

export class CliInput implements CliInputAttributes {
    // TODO: replace on @Prop decorator
    analyze: boolean;
    output: string | undefined;

    constructor(private attributes: AllMaybeUndefined<CliInputAttributes>) {
        this.analyze = attributes.analyze || false;
        this.output = attributes.output;
    }

    createBuildProfile(): BuildProfile {
        return {
            analyzeBundle: this.analyze,
            outputPath: this.output,
        }
    }
}
