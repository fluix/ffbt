import {CliInput} from "./CliInput";

describe("Cli Input model", () => {
    test("normalize all CliInput values", () => {
        const inputs = new CliInput({
            analyze: undefined,
            output: undefined,
        });

        expect(inputs.analyze).toBe(false);
        expect(inputs.output).toBeUndefined();
    });
});
