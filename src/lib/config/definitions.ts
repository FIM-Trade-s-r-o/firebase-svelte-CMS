import type Schema from '$lib/schemas/lib'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '$lib/firebase'
import jwt from 'jsonwebtoken'

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

interface AdminAccount {
    email: string,
    password: string
}

interface GlobalConfig {
    adminAccounts?: Array<AdminAccount>,
    adminCollection?: string,
    collections: Array<Collection>
}

interface ConfigT {
    getAdminAccount: (emailToCheck: string) => Promise<AdminAccount | null>,
    getCollection: (name: string) => Collection
}

class Config implements ConfigT {
    #adminAccounts: Array<AdminAccount> | undefined
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
    async getAdminAccount (emailToCheck: string): Promise<AdminAccount | null> {
        if (this.#adminCollection) {
            const adminQuery = query(this.#adminCollection, where('email', '==', emailToCheck))
            const adminDocs = await getDocs(adminQuery)

            if (adminDocs.empty) {
                return null
            } else {
                return {
                    email: emailToCheck,
                    password: adminDocs.docs[0].get('password')
                }
            }
        } else {
            let match = null
            this.#adminAccounts.forEach(account => {
                if (account.email === emailToCheck) {
                    match = account
                }
            })
            return match
        }
    }

    login (adminAccount: AdminAccount, password: string) {
        if (adminAccount.password === password) {
            return jwt.sign(adminAccount.email, adminAccount.password, { expiresIn: `${10 * 60 * 1000}` })
        } else {
            throw new Error('Invalid password')
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
