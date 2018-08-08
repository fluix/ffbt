const path = require("path"),
    tslintRunner = require("tslint/lib/runner");

module.exports = function (ffbt_root, workdir, argv, projectConfig, PROJECT_ROOT_PATH) {
    argv = argv || {};
    const fix = (typeof argv.fix === "undefined") ? false : Boolean(argv.fix);
    const force = (typeof argv.force === "undefined") ? false : Boolean(argv.force);
    let configPath = path.resolve(ffbt_root, "./linters/tslint.json");

    if (projectConfig.tsLintConfigPath) {
        configPath = path.resolve(PROJECT_ROOT_PATH, projectConfig.tsLintConfigPath);
    }


    const runnerConfig = {
        config: configPath,
        exclude: "node_modules/**/*",
        files: path.resolve(workdir, "./**/*.ts?(x)"),
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
