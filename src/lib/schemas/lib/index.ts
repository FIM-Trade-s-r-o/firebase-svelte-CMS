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

interface PropertyDescriptor {
    type: PropertyDescriptorType,
    required: boolean
}

class Schema {
    readonly #dataModel: { [key: string]: PropertyDescriptor } = {}
    constructor (model) {
        for (const property in model) {
            if (typeof model[property] !== 'object') {
                model[property] = {
                    type: model[property],
                    required: false
                }
            }
        }
        this.#dataModel = model
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
            const { type: requiredType, required } = this.#dataModel[property]

            if (hasOwnProperty(potentialInstance, property)) {
                if (required && !potentialInstance[property]) {
                    console.warn('Required property contains no information')
                    return false
                }
                const actualType = typeof potentialInstance[property]
                switch (requiredType) {
                case Boolean:
                case Number:
                case String:
                case Symbol:
                case BigInt: {
                    const expectedType = typeof requiredType()
                    if (actualType !== expectedType) {
                        console.warn(`Type checking has failed at property: ${property},
                            expected type: ${expectedType},
                            actual type: ${actualType}`)
                        return false
                    }
                    break
                }
                case Markdown: {
                    if (actualType !== 'string') {
                        console.warn(`Type checking has failed at property: ${property},
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
            } else if (required) {
                console.warn('Missing required property')
                return false
            }
        }
        return true
    }
}

export default Schema
