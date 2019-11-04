describe("don't compile me", () => {
    test("don't throw type error while compiling project", () => {
        const x = 1;
        x = 2;
        expect(1).toBe(1);
    });
});
