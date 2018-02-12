"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const propNameRegexp = /^_?[^_]+$/;
class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING(propName) {
        return `${propName} has illegal underscore`;
    }
    apply(sourceFile) {
        return this.applyWithWalker(new NoUnderscoresPropsWalker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
// The walker takes care of all the work.
class NoUnderscoresPropsWalker extends Lint.RuleWalker {
    visitPropertyDeclaration(node) {
        const nodeName = node.name;
        const propName = nodeName.escapedText;
        // create a failure at the current position if regex not matches
        if (!propNameRegexp.test(propName)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING(propName)));
        }
        // call the base version of this visitor to actually parse this node
        super.visitPropertyDeclaration(node);
    }
}
