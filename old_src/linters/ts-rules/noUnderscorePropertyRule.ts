import * as ts from "typescript";
import * as Lint from "tslint";

const propNameRegexp = /^_?[^_]+$/;

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING(propName: string) {
        return `${propName} has illegal underscore`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnderscoresPropsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoUnderscoresPropsWalker extends Lint.RuleWalker {
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {

        const nodeName = node.name as ts.Identifier;
        const propName = nodeName.escapedText as string;

        // create a failure at the current position if regex not matches
        if (!propNameRegexp.test(propName)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING(propName)));
        }

        // call the base version of this visitor to actually parse this node
        super.visitPropertyDeclaration(node);
    }
}
