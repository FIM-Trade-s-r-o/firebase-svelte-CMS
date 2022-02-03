function hasOwnProperty<T, K extends PropertyKey>(
    obj: T,
    prop: K
): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

class Schema {
    readonly #dataModel: object = {};
    constructor(model) {
        this.#dataModel = model;
    }
    get dataModel() {
        return this.#dataModel;
    }
    get properties(): Array<string> {
        return Object.getOwnPropertyNames(this.#dataModel);
    }
    forEach(callback): void {
        for (const property in this.#dataModel) {
            if (hasOwnProperty(this.#dataModel, property)) {
                if (
                    callback({
                        property,
                        type: this.#dataModel[property]
                    })
                ) return;
            }
        }
    }
    validate(potentialInstance: object): boolean {
        let isValid = true;
        const invalidate = (): true => {
            isValid = false;
            return true; // this will end forEach
        }
        this.forEach(({ property: requiredProperty , type: requiredType })=>{
            console.log(potentialInstance, requiredProperty, hasOwnProperty(potentialInstance, requiredProperty))
            if (hasOwnProperty(potentialInstance, requiredProperty)) {
                console.log('s')
                switch (requiredType) {
                    case Boolean:
                    case Number:
                    case String:
                    case Symbol:
                    case BigInt: {
                        console.log('f')
                        if (typeof potentialInstance[requiredProperty] !== typeof requiredType()) return invalidate();
                        break;
                    }
                    default: {
                       console.warn('Non-primitive property, omitting validation')
                    }
                }
            } else return invalidate();
        })
        return isValid;
    }
}

export default Schema;