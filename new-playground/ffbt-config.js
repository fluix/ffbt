module.exports = {
    environments: {
        default: {
        },
        development: {
            // exclusion. Overwrites real development values
        },
        production: {
            // exclusion. Overwrites real production values
        },
        ci: {
            _extends: "production", // extends "default" until _extends is specified
            analyzeBundle: true,
        },
        testing: {
            _extends: "development"
        }
    },
    noParse: [], // allow empty array and null, cast to undefined
    aliases: []
};
