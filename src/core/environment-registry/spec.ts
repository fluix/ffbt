import {Environment, EnvironmentRegistry} from "./index";

interface TestEnv extends Environment {
    a?: any;
    b?: any;
    c?: any;
}

describe("Environment", () => {
    let environments: EnvironmentRegistry<TestEnv>;

    beforeEach(() => {
         environments = new EnvironmentRegistry();
    });

    describe("register/get environment", () => {
        test("env can be registered by name", () => {
            expect(environments.size).toBe(0);

            environments.add("myEnvironment", {a: 1});
            expect(environments.size).toBe(1);
        });

        test("env contains its name after registering", () => {
            environments.add("A", {a: 1});

            expect(environments.get("A")).toStrictEqual({
                _displayName: "A",
                a: 1,
            });
        });

        test("get registered env by name", () => {
            environments.add("myEnvironment", {a: 1});

            const myEnvironment = environments.get("myEnvironment");
            expect(myEnvironment.a).toBe(1);
        });

        // TODO: make error snapshot
        test("throw error if trying to get env that doesn't exist", () => {
            expect(() => {
                environments.get("envThatDoesntExist");
            }).toThrowError();
        });

        test("add many environments", () => {
            environments.addMany({
                p1: {},
                p2: {}
            });

            expect(environments.size).toBe(2);
            expect(environments.get("p1")._displayName).toBe("p1");
            expect(environments.get("p2")._displayName).toBe("p2");
        });

        test.todo("add many in proper order");
        test.todo("add many and handle circular dependencies");
    });

    describe("extension", () => {
        test("environments can be extended from each other during register", () => {
            environments.add("envA", {a: 1});
            environments.add("envB", {
                _extends: "envA",
                b: 2
            });

            expect(environments.get("envB")).toMatchObject({
                _extends: "envA",
                a: 1,
                b: 2,
            });
        });

        test("envs can be extended recursively", () => {
            environments.add("envA", {a: 1});
            environments.add("envB", {
                _extends: "envA",
                b: 2
            });
            environments.add("envC", {
                _extends: "envB",
                c: 3,
            });

            expect(environments.get("envC")).toMatchObject({
                _extends: "envB",
                a: 1,
                b: 2,
                c: 3
            });
        });

        test("Env name doesn't change after extension", () => {
            environments.add("envA", {a: 1});
            environments.add("envB", {
                _extends: "envA",
                b: 2
            });

            expect(environments.get("envB")).toStrictEqual({
                _displayName: "envB",
                _extends: "envA",
                a: 1,
                b: 2
            })
        });

        test.todo("if extends is empty - extends from default");

        // TODO: make error snapshot
        test("throw error if env trying to extend itself", () => {
            expect(() => {
                environments.add("envA", {
                    _extends: "envA",
                    a: 1
                });
            }).toThrowError();
        });

        // TODO: make error snapshot
        test("error if extends env that doesn't exist", () => {
            expect(() => {
                environments.add("envA", {
                    _extends: "envThatDoesntExist"
                });
            }).toThrowError();
        });
    });
});
