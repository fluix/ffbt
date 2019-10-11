// See the config options here: https://kulshekhar.github.io/ts-jest/user/config/
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    modulePathIgnorePatterns: [
        "<rootDir>/dist",
        "<rootDir>/old_src",
        "<rootDir>/new-playground",
    ]
};
