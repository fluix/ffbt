import {Profile, ProfileRegistry} from "./index";

interface TestBuildProfile extends Profile {
    a?: any;
    b?: any;
    c?: any;
}

describe("Build Profile", () => {
    let profiles: ProfileRegistry<TestBuildProfile>;

    beforeEach(() => {
         profiles = new ProfileRegistry();
    });

    describe("register/get profile", () => {
        test("profile can be registered by name", () => {
            expect(profiles.size).toBe(0);

            profiles.add("myProfile", {a: 1});
            expect(profiles.size).toBe(1);
        });

        test("profile contains its name after registering", () => {
            profiles.add("A", {a: 1});

            expect(profiles.get("A")).toStrictEqual({
                _displayName: "A",
                a: 1,
            });
        });

        test("get registered profile by name", () => {
            profiles.add("myProfile", {a: 1});

            const myProfile = profiles.get("myProfile");
            expect(myProfile.a).toBe(1);
        });

        // TODO: make error snapshot
        test("throw error if trying to get profile that doesn't exist", () => {
            expect(() => {
                profiles.get("profileThatDoesntExist");
            }).toThrowError();
        });

        test("add many profiles", () => {
            profiles.addMany({
                p1: {},
                p2: {}
            });

            expect(profiles.size).toBe(2);
            expect(profiles.get("p1")._displayName).toBe("p1");
            expect(profiles.get("p2")._displayName).toBe("p2");
        });

        test.todo("add many in proper order");
        test.todo("add many and handle circular dependencies");
    });

    describe("extension", () => {
        test("profiles can be extended from each other during register", () => {
            profiles.add("profileA", {a: 1});
            profiles.add("profileB", {
                _extends: "profileA",
                b: 2
            });

            expect(profiles.get("profileB")).toMatchObject({
                _extends: "profileA",
                a: 1,
                b: 2,
            });
        });

        test("Profiles can be extended recursively", () => {
            profiles.add("profileA", {a: 1});
            profiles.add("profileB", {
                _extends: "profileA",
                b: 2
            });
            profiles.add("profileC", {
                _extends: "profileB",
                c: 3,
            });

            expect(profiles.get("profileC")).toMatchObject({
                _extends: "profileB",
                a: 1,
                b: 2,
                c: 3
            });
        });

        test("Profile name doesn't change after extension", () => {
            profiles.add("profileA", {a: 1});
            profiles.add("profileB", {
                _extends: "profileA",
                b: 2
            });

            expect(profiles.get("profileB")).toStrictEqual({
                _displayName: "profileB",
                _extends: "profileA",
                a: 1,
                b: 2
            })
        });

        test.todo("if extends is empty - extends from default");

        // TODO: make error snapshot
        test("throw error if profile trying to extend itself", () => {
            expect(() => {
                profiles.add("profileA", {
                    _extends: "profileA",
                    a: 1
                });
            }).toThrowError();
        });

        // TODO: make error snapshot
        test("error if extends profile that doesn't exist", () => {
            expect(() => {
                profiles.add("profileA", {
                    _extends: "profileThatDoesntExist"
                });
            }).toThrowError();
        });
    });
});
