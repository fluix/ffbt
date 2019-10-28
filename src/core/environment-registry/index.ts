export interface Environment {
    _extends?: string;
    _displayName?: string;
}

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
            this.resolveEnvDependencyAndAdd(name, environments[name], environments, []);
        });
    }

    private resolveEnvDependencyAndAdd(
        name: string,
        env: TEnv,
        environments: Record<string, TEnv>,
        parents: Array<TEnv>,
    ) {
        const parentEnvName = env._extends;
        if (parentEnvName) {
            const parentEnv = environments[parentEnvName];
            if (!parentEnv) {
                throw new Error(`Can't extend environment ${name} from ${parentEnvName} because it doesn't exist`);
            }

            if (parents.includes(parentEnv)) {
                throw new Error("Circular dependency found");
            }

            this.resolveEnvDependencyAndAdd(parentEnvName, parentEnv, environments, [...parents, env]);
        }

        this.add(name, env);
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
