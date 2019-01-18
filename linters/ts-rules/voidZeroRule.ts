/*
    copied from https://github.com/Microsoft/tslint-microsoft-contrib/pull/770
    Should be removed when tslint-microsoft-contrib@6.0.0 will be merged into tslint-config-airbnb
 */

import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";

const FAILURE_STRING = "Replace void 0 with undefined";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isVoidExpression(node)) {
            if (node.expression !== undefined && node.expression.getText() === "0") {
                const nodeStart = node.getStart();
                const nodeWidth = node.getWidth();
                const fix = new Lint.Replacement(nodeStart, nodeWidth, "undefined");

                ctx.addFailureAt(nodeStart, nodeWidth, FAILURE_STRING, fix);
            }
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
