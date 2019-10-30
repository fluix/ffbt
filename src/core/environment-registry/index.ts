export interface Environment {
    _extends?: string;
    _name?: string;
}

export const CIRCULAR_DEPENDENCY_ERROR_TEXT = "Found circular dependency in environment list";
const DEFAULT_ENV_NAME = "default";

export class EnvironmentRegistry<TEnv extends Environment> {
    private environments = new Map<string, TEnv>();

    get size(): number {
        return this.environments.size;
    }

    add(name: string, env: TEnv): TEnv {
        const newEnv = this.extendEnv(env);
        newEnv._name = name;

        this.environments.set(name, newEnv);

        return newEnv;
    }

    addMany(environments: Record<string, TEnv>) {
        Object.keys(environments).forEach((name) => {
            const isEnvironmentAlreadyAdded = this.environments.get(name) !== undefined;
            if (isEnvironmentAlreadyAdded) {
                return;
            }

            this.resolveParentEnvAndAdd(name, environments[name], environments, []);
        });
    }

    private resolveParentEnvAndAdd(
        name: string,
        env: TEnv,
        environments: Record<string, TEnv>,
        parents: Array<TEnv>,
    ) {
        const parentEnvName = env._extends;
        if (!parentEnvName) {
            this.add(name, env);
            return;
        }

        const parentEnv = environments[parentEnvName];
        parentEnv._name = parentEnvName;

        if (!parentEnv) {
            throw new Error(`Can't extend environment ${name} from ${parentEnvName} because it doesn't exist`);
        }

        if (parents.includes(parentEnv)) {
            const dependencyChain = this.buildDependencyChainString(parents, env);
            throw new Error(`${CIRCULAR_DEPENDENCY_ERROR_TEXT}: ${dependencyChain}`);
        }

        this.resolveParentEnvAndAdd(parentEnvName, parentEnv, environments, [...parents, env]);

        this.add(name, env);
    }

    private buildDependencyChainString(parents: Array<TEnv>, env: TEnv): string {
        const parentNames = parents.map(parent => parent._name);
        return [...parentNames, env._name, env._extends].join(" -> ");
    }

    private extendEnv(env: TEnv): TEnv {
        const extendTarget = env._extends || DEFAULT_ENV_NAME;

        const parentEnv = this.get(extendTarget);

        return this.mergeEnvironments(parentEnv, env);
    }

    get(name: string): TEnv {
        const env = this.environments.get(name);
        if (env) {
            return env;
        }

        if (name === DEFAULT_ENV_NAME) {
            return {} as TEnv;
        }

        throw new Error(`Environment with name ${name} doesn't exist`);
    }

    private mergeEnvironments(e1: TEnv, e2: TEnv): TEnv {
        return {
            ...e1,
            ...e2,
        };
    }
}
