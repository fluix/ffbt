export function Prop(propertyName?: string): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        const normalizedPropName = propertyName || propertyKey;

        function getter(this: any) {
            return this.props[normalizedPropName];
        }

        function setter(this: any, value: any) {
            this.props[normalizedPropName] = value;
        }

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
