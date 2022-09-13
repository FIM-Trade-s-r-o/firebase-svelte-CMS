import {
    Markdown
} from './types'

function hasOwnProperty<T, K extends PropertyKey> (
    obj: T,
    prop: K
): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop)
}

type PropertyDescriptorType = BooleanConstructor | NumberConstructor | StringConstructor | SymbolConstructor | BigIntConstructor | Markdown
type SerializedPropertyDescriptorType = boolean | number | string | symbol | bigint

interface PropertyDescriptorT {
    type: PropertyDescriptorType,
    required: boolean
}
interface SerializedPropertyDescriptor {
    type: SerializedPropertyDescriptorType,
    required: boolean
}

class PropertyDescriptor implements PropertyDescriptorT {
    type
    required
    constructor (model, deserialize = false) {
        if (deserialize) {
            this.#deserialize(model)
        } else {
            this.#processFromLiteral(model)
        }
    }

    #processFromLiteral ({ type, required }: PropertyDescriptorT) {
        this.type = type
        this.required = required
    }

    #deserialize ({ type, required }: SerializedPropertyDescriptor) {
        switch (typeof type) {
            case 'boolean': {
                this.type = Boolean
                break
            }
            case 'number': {
                this.type = Number
                break
            }
            case 'string': {
                if (type === 'md') {
                    this.type = Markdown
                } else {
                    this.type = String
                }
                break
            }
            case 'symbol': {
                this.type = Symbol
                break
            }
            case 'bigint': {
                this.type = BigInt
                break
            }
            default: {
                console.trace('Deserialization')
                throw new Error(`Unsupported type: ${typeof type}`)
            }
        }
        this.required = required
    }

    validate (data): boolean {
        if (this.required && !data) {
            console.warn('Required property contains no information')
            return false
        }
        const actualType = typeof data
        switch (this.type) {
            case Boolean:
            case Number:
            case String:
            case Symbol:
            case BigInt: {
                const expectedType = typeof this.type()
                if (actualType !== expectedType) {
                    console.warn(`Type checking has failed at property with data: ${data},
                            expected type: ${expectedType},
                            actual type: ${actualType}`)
                    return false
                }
                break
            }
            case Markdown: {
                if (actualType !== 'string') {
                    console.warn(`Type checking has failed at property with data: ${data},
                       expected type: string,
                       actual type: ${actualType}`)
                    return false
                }
                break
            }
            default: {
                console.warn('Non-primitive property, omitting type validation')
            }
        }
        return true
    }

    toJSON (): SerializedPropertyDescriptor {
        return {
            type: this.type(),
            required: this.required
        }
    }
}

class Schema {
    readonly #dataModel: { [key: string]: PropertyDescriptor } = {}
    constructor (model, deserialize = false) {
        for (const property in model) {
            let type: PropertyDescriptorT | SerializedPropertyDescriptor
            let required = false
            if (typeof model[property] !== 'object') {
                type = model[property]
            } else {
                type = model[property].type
                required = model[property].required || false
            }
            this.#dataModel[property] = new PropertyDescriptor({
                type,
                required
            }, deserialize)
        }
    }

    get dataModel () {
        return this.#dataModel
    }

    get properties (): Array<string> {
        return Object.getOwnPropertyNames(this.#dataModel)
    }

    forEach (callback): void {
        for (const property in this.#dataModel) {
            if (hasOwnProperty(this.#dataModel, property)) {
                if (
                    callback({
                        property,
                        type: this.#dataModel[property]
                    })
                ) return
            }
        }
    }

    validate (potentialInstance: object): boolean {
        for (const property in this.#dataModel) {
            if (hasOwnProperty(potentialInstance, property)) {
                if (!this.#dataModel[property].validate(potentialInstance[property])) {
                    return false
                }
            } else if (this.#dataModel[property].required) {
                console.warn('Missing required property')
                return false
            }
        }
        return true
    }

    toJSON () {
        const json = {}
        for (const dataModelKey in this.#dataModel) {
            json[dataModelKey] = this.#dataModel[dataModelKey].toJSON()
        }
        return json
    }
}

export default Schema
