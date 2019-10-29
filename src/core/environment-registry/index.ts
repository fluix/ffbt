export interface Environment {
    _extends?: string;
    _displayName?: string;
}

export const CIRCULAR_DEPENDENCY_ERROR_TEXT = "Found circular dependency in environment list";

export class EnvironmentRegistry<TEnv extends Environment> {
    private environments = new Map<string, TEnv>();

    get size(): number {
        return this.environments.size;
    }

    add(name: string, env: TEnv): TEnv {
        const newEnv = this.extendEnv(env);
        newEnv._displayName = name;

        this.environments.set(name, newEnv);

        return newEnv;
    }

    addMany(environments: Record<string, TEnv>) {
        Object.keys(environments).forEach((name) => {
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
        parentEnv._displayName = parentEnvName;

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
        const parentNames = parents.map(parent => parent._displayName);
        return [...parentNames, env._displayName, env._extends].join(" -> ");
    }

    private extendEnv(env: TEnv): TEnv {
        if (!env._extends) {
            return env;
        }

        const parentEnv = this.get(env._extends);

        return {
            ...parentEnv,
            ...env,
        };
    }

    get(name: string): TEnv {
        const env = this.environments.get(name);

        if (!env) {
            throw new Error(`Environment with name ${name} doesn't exist`);
        }

        return env;
    }
}
