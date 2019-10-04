import * as Lint from "tslint";
import * as ts from "typescript";

const bannedFunctions = ["fdescribe", "fit"];

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING(propName: string) {
        return `${propName} calls are not allowed`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFocusTestWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoFocusTestWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {

        const functionName = node.expression.getText();

        // create a failure at the current position if call is banned
        if (bannedFunctions.indexOf(functionName) !== -1) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING(functionName)));
        }

        // call the base version of this visitor to actually parse this node
        super.visitCallExpression(node);
    }
}
