export type AllMaybeUndefined<T> = {
    [P in keyof T]: T[P] | undefined;
};
