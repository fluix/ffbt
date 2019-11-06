import {CIRCULAR_DEPENDENCY_ERROR_TEXT, Environment, EnvironmentRegistry} from "./index";

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

    describe("add/get environment", () => {
        test("env can be registered by name", () => {
            expect(environments.size).toBe(0);

            environments.add("myEnvironment", {a: 1});
            expect(environments.size).toBe(1);
        });

        test("env contains its name after registering", () => {
            environments.add("A", {a: 1});

            expect(environments.get("A")).toStrictEqual({
                _name: "A",
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
                e1: {},
                e2: {}
            });

            expect(environments.size).toBe(2);
            expect(environments.get("e1")._name).toBe("e1");
            expect(environments.get("e2")._name).toBe("e2");
        });

        test("add many in proper order", () => {
            environments.addMany({
                e1: {
                    _extends: "e2"
                },
                e2: {
                    a: "1",
                }
            });

            expect(environments.get("e2")).toMatchObject({
                a: "1",
            });
        });

        test("add many and handle circular dependencies", () => {
            expect(() => {
                environments.addMany({
                    e1: {
                        _extends: "e2"
                    },
                    e2: {
                        _extends: "e1"
                    }
                });
            }).toThrow(new RegExp(CIRCULAR_DEPENDENCY_ERROR_TEXT));
        });

        test("don't add the similar environment twice", () => {
            const spyForAdd = spyOn(environments, "add").and.callThrough();

            environments.addMany({
                e1: {
                    _extends: "e2"
                },
                e2: {}
            });

            expect(spyForAdd.calls.count()).toBe(2);
            expect(spyForAdd.calls.argsFor(0)[0]).toBe("e2");
            expect(spyForAdd.calls.argsFor(1)[0]).toBe("e1");
        });
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
                _name: "envB",
                _extends: "envA",
                a: 1,
                b: 2
            })
        });

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

        test("if extends is empty - extends from default", () => {
            environments.add("default", {a: 1});
            environments.add("e1", {b: 2});

            expect(environments.get("e1")).toMatchObject({
                a: 1,
                b: 2
            });
        });
    });
});
