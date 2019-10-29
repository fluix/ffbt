import {ProjectConfig} from "./index";
import {defaultConfig} from "./default";

describe("Project Config", () => {
    test("use default profile by default", () => {
        const projectConfig = new ProjectConfig();
        expect(projectConfig.env._displayName).toBe("default");
    });

    test("applies default values to the config", () => {
        const aliases = {"key": "value"};

        const projectConfig = new ProjectConfig({
            aliases,
        });

        projectConfig.setCurrentEnvironmentName("default");
        expect(projectConfig.aliases).toEqual(aliases);
    });

    test("deep merge default and custom settings", () => {
        const defaultConfig: any = {
            environments: {
                default: {
                    a: {
                        value: 1,
                        value2: 2,
                    },
                    a1: {
                        value: 3,
                    }
                }
            }
        };

        const customConfig: any = {
            environments: {
                default: {
                    a: {
                        value: "newValue",
                    }
                },
            }
        };

        const projectConfig = new ProjectConfig(customConfig, defaultConfig);

        expect(projectConfig.env).toMatchObject({
            "a": {
                "value": "newValue",
                "value2": 2
            },
            "a1": {
                "value": 3
            },
        });
    });

    test("converts [], null in noParse to undefined (required by webpack)", () => {
        const configWithArrayNoParse = new ProjectConfig({noParse: []} as any);
        expect(configWithArrayNoParse.noParse).toBeUndefined();

        const configWithNullNoParse = new ProjectConfig({noParse: null} as any);
        expect(configWithNullNoParse.noParse).toBeUndefined();
    });

    test("shallow override environment settings", () => {
        const projectConfig = new ProjectConfig();
        const originalEnvValue = projectConfig.env.buildVersion;

        projectConfig.overrideEnvironmentSettings({
            buildVersion: originalEnvValue + "1",
        });

        expect(projectConfig.env.buildVersion).toBe(originalEnvValue + "1");
    });
});
