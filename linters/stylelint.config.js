module.exports = {
    "rules": {
        // General
        "indentation": 4,
        "string-quotes": "double",
        "max-empty-lines": 1,
        "no-eol-whitespace": true,
        "no-missing-end-of-source-newline": true,
        // Block
        "block-no-empty": true,
        "block-opening-brace-newline-after": "always",
        "block-opening-brace-space-after": "always-single-line",
        "block-opening-brace-space-before": "always",
        "block-closing-brace-newline-after": "always",
        "block-closing-brace-newline-before": "always-multi-line",
        "block-closing-brace-space-before": "always-single-line",
        // Color
        "color-hex-case": "lower",
        "color-hex-length": "short",
        "color-no-invalid-hex": true,
        // Comment
        "comment-empty-line-before": [
            "always",
            {
                except: [
                    "first-nested"
                ],
                ignore: [
                    "stylelint-commands"
                ]
            }
        ],
        "comment-whitespace-inside": "always",
        // Declaration
        "declaration-bang-space-after": "never",
        "declaration-bang-space-before": "always",
        "declaration-block-semicolon-newline-after": "always-multi-line",
        "declaration-block-semicolon-space-after": "always-single-line",
        "declaration-block-semicolon-space-before": "never",
        "declaration-block-single-line-max-declarations": 1,
        "declaration-colon-space-after": "always-single-line",
        "declaration-colon-space-before": "never",
        // Function
        "function-calc-no-unspaced-operator": true,
        "function-comma-newline-after": "always-multi-line",
        "function-comma-space-after": "always-single-line",
        "function-comma-space-before": "never",
        "function-parentheses-newline-inside": "always-multi-line",
        "function-parentheses-space-inside": "never-single-line",
        "function-whitespace-after": "always",
        "function-url-quotes": "always",
        // Media
        "media-feature-colon-space-after": "always",
        "media-feature-colon-space-before": "never",
        "media-feature-range-operator-space-after": "always",
        "media-feature-range-operator-space-before": "always",
        "media-query-list-comma-newline-after": "always-multi-line",
        "media-query-list-comma-space-after": "always-single-line",
        "media-query-list-comma-space-before": "never",
        "media-feature-parentheses-space-inside": "never",
        // Number
        "number-leading-zero": "always",
        "number-no-trailing-zeros": true,
        "length-zero-no-unit": true,
        // Rule
        "declaration-block-no-shorthand-property-overrides": true,
        "declaration-block-trailing-semicolon": "always",
        "rule-empty-line-before": [
            "always-multi-line",
            {
                except: [
                    "first-nested"
                ],
                ignore: [
                    "after-comment"
                ]
            }
        ],
        // Selector
        "selector-combinator-space-after": "always",
        "selector-combinator-space-before": "always",
        "selector-list-comma-newline-after": "always",
        "selector-list-comma-space-before": "never",
        "selector-pseudo-element-colon-notation": "double",
        // Value
        "value-list-comma-newline-after": "always-multi-line",
        "value-list-comma-space-after": "always-single-line",
        "value-list-comma-space-before": "never",

        // Restrictions
        "unit-no-unknown" : true,
        "shorthand-property-no-redundant-values": true,
        "property-no-unknown": true,
        "declaration-block-no-duplicate-properties": true,
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-element-no-unknown": true,
        "value-no-vendor-prefix": true
    }
}
