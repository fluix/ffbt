import {ProjectConfig} from "./index";

fdescribe("Project Config", () => {
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

    test("deeply applies defaults", () => {
        const projectConfig = new ProjectConfig({
            environments: {
                default: {
                    buildVersion: "1",
                },
                development: {
                    buildVersion: "2",
                },
            }
        });

        projectConfig.setCurrentEnvironmentName("default");
        expect(projectConfig.env.buildVersion).toBe("1");

        projectConfig.setCurrentEnvironmentName("development");
        expect(projectConfig.env.buildVersion).toBe("2");
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
    })
});
