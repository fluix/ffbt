"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
let wrongImports;
class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING(alias) {
        return `import ${alias} by relative path is forbidden`;
    }
    ;
    apply(sourceFile) {
        // fill variable in clojure to cache it between calls
        wrongImports = this.getOptions().ruleArguments.map((aliasName) => {
            return {
                alias: aliasName,
                regexp: new RegExp(`(\.\.\/)+${aliasName}`, "i")
            };
        });
        return this.applyWithWalker(new StrictAliasImportWalker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
// The walker takes care of all the work.
class StrictAliasImportWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        const nodeText = node.getText();
        const matchedAlias = wrongImports.find((restrictedImport) => {
            return restrictedImport.regexp.test(nodeText);
        });
        // create a failure at the current position if regex matches
        if (matchedAlias) {
            // cache expensive operations;
            const nodeStart = node.getStart();
            const nodeWidth = nodeText.length;
            // autofix for wrong imports
            const fix = new Lint.Replacement(nodeStart, nodeWidth, nodeText.replace(matchedAlias.regexp, matchedAlias.alias));
            this.addFailure(this.createFailure(nodeStart, nodeWidth, Rule.FAILURE_STRING(matchedAlias.alias), fix));
        }
        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
