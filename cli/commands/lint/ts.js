const path = require("path"),
    tslintRunner = require("tslint/lib/runner");

module.exports = function (ffbt_root, workdir, argv) {
    argv = argv || {};
    const fix = (typeof argv.fix === "undefined") ? false : Boolean(argv.fix);
    const force = (typeof argv.force === "undefined") ? false : Boolean(argv.force);
    const runnerConfig = {
        config: path.resolve(ffbt_root, "./linters/tslint.json"),
        exclude: "node_modules/**/*",
        files: path.resolve(workdir, "./**/*.ts"),
        fix,
        force,
        format: "stylish"
    };

    tslintRunner.run(runnerConfig, {
        log: console.log,
        error: (m) => console.error(m),
    })
        .then((rc) => process.exitCode = rc)
        .catch((e) => {
            console.error(e);
            process.exitCode = 1;
        });
};
