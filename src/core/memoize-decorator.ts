interface ObjectWithMemoizedData extends Object {
    __memoizeDecoratorData?: Record<any, any>;
}

/**
 * Decorates method/getter call
 * @param descriptor - PropertyDescriptor. See details in Object.defineProperty docs (Link below)
 * @param type - Specifies which property to decorate
 * @param propertyKey - method/getter name
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
function decoratePropertyDescriptor(descriptor: PropertyDescriptor, type: "value" | "get", propertyKey: string) {
    const originalFunc = descriptor[type];
    descriptor[type] = function(this: ObjectWithMemoizedData, ...args: Array<any>) {
        if (!this.__memoizeDecoratorData) {
            this.__memoizeDecoratorData = {};
        }

        const hasCachedValue = this.__memoizeDecoratorData.hasOwnProperty(propertyKey);
        if (!hasCachedValue) {
            this.__memoizeDecoratorData[propertyKey] = originalFunc.apply(this, args);
        }

        return this.__memoizeDecoratorData[propertyKey];
    };
}

/**
 * Caches function execution result between calls
 */
export function Memoize(): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (descriptor.set) {
            throw new Error("Can't memoize descriptor with setter");
        }

        const decorationType = descriptor.get ? "get" : "value";

        decoratePropertyDescriptor(descriptor, decorationType, propertyKey as string);

        return descriptor;
    };
}

export function dropCacheFor<TObject>(obj: TObject, method: keyof TObject) {
    const cachedValues = (<ObjectWithMemoizedData>obj).__memoizeDecoratorData;

    if (!cachedValues) {
        return;
    }

    delete cachedValues[method];
}
