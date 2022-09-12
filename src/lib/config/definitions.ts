import type Schema from '$lib/schemas/lib'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '$lib/firebase'

interface Sorting {
    property: string,
    sort: 'asc' | 'desc'
}

interface CollectionT {
    name: string,
    schema: Schema,
    sortBy?: Sorting
}

class Collection implements CollectionT {
    name: string
    schema: Schema
    sortBy?: Sorting
    constructor ({ name, schema, sortBy }: CollectionT) {
        this.name = name
        this.schema = schema
        this.sortBy = sortBy
    }

    toJSON () {
        return {
            name: this.name,
            schema: this.schema.toJSON(),
            sortBy: this.sortBy
        }
    }
}

interface GlobalConfig {
    adminAccounts?: Array<string>,
    adminCollection?: string,
    collections: Array<Collection>
}

interface ConfigT {
    isAdminAccount: (emailToCheck: string) => Promise<boolean>,
    getCollection: (name: string) => Collection
}

class Config implements ConfigT {
    #adminAccounts: Array<string> | undefined
    #adminCollection: CollectionReference | undefined
    collections: Array<Collection>
    constructor ({ adminAccounts, adminCollection, collections }: GlobalConfig) {
        if (!adminAccounts && !adminCollection) {
            console.error('Bad confuguration, there are no admin accounts specified, neither collection of admins')
        }
        if (adminAccounts) {
            this.#adminAccounts = adminAccounts
        }
        if (adminCollection) {
            this.#adminCollection = collection(firestore, adminCollection)
        }
        this.collections = []
        for (const collection of collections) {
            this.collections.push(new Collection(collection))
        }
    }

    // Calling of this function must be on server side
    async isAdminAccount (emailToCheck: string): Promise<boolean> {
        if (this.#adminCollection) {
            const adminQuery = query(this.#adminCollection, where('email', '==', emailToCheck))
            const adminDocs = await getDocs(adminQuery)

            return !adminDocs.empty
        } else {
            let match = false
            this.#adminAccounts.forEach(email => {
                if (email === emailToCheck) {
                    match = true
                }
            })
            return match
        }
    }

    getCollection (name: string): Collection {
        for (const collection of this.collections) {
            if (name === collection.name) {
                return collection
            }
        }
    }

    get serializedCollections () {
        const serializedCollections = []
        for (const collection of this.collections) {
            serializedCollections.push(collection.toJSON())
        }
        return serializedCollections
    }
}

export default Config
export type { ConfigT }
