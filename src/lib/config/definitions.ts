import type Schema from '$lib/schemas/lib'
// TODO: migrate this to admin SDK
import type { CollectionReference } from 'firebase-admin/firestore'
// import { collection, getDocs, query, where } from 'firebase-admin/firestore'
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
    JWTSecret: string,
    collections: Array<Collection>
}

interface User {
    name: string
}

interface ConfigT {
    getAdminAccount: (emailToCheck: string) => Promise<AdminAccount | null>,
    getCollection: (name: string) => Collection
}

class Config implements ConfigT {
    readonly #adminAccounts: Array<AdminAccount> | undefined
    readonly #adminCollection: CollectionReference | undefined
    readonly #JWTSecret: string
    readonly collections: Array<Collection>
    constructor ({ adminAccounts, adminCollection, JWTSecret, collections }: GlobalConfig) {
        if (!adminAccounts && !adminCollection) {
            console.error('Bad confuguration, there are no admin accounts specified, neither collection of admins')
        }
        if (adminAccounts) {
            this.#adminAccounts = adminAccounts
        }
        if (adminCollection) {
            this.#adminCollection = firestore.collection(adminCollection)
            // this.#adminCollection = collection(firestore, adminCollection)
        }
        this.#JWTSecret = JWTSecret
        this.collections = []
        for (const collection of collections) {
            this.collections.push(new Collection(collection))
        }
    }

    // Calling of this function must be on server side
    async getAdminAccount (emailToCheck: string): Promise<AdminAccount | null> {
        if (this.#adminCollection) {
            const adminQuery = this.#adminCollection.where('email', '==', emailToCheck)
            const adminDocs = await adminQuery.get()
            // const adminQuery = query(this.#adminCollection, where('email', '==', emailToCheck))
            // const adminDocs = await getDocs(adminQuery)

            if (adminDocs.empty) {
                return null
            } else {
                return {
                    email: emailToCheck,
                    password: adminDocs.docs[0].get('password')
                }
            }
        } else if (this.#adminAccounts) {
            for (const account of this.#adminAccounts) {
                if (account.email === emailToCheck) {
                    return account
                }
            }
            return null
        } else {
            console.error('Invalid CMS configuration: missing admin definition')
        }
    }

    login (adminAccount: AdminAccount, password: string) {
        if (adminAccount.password === password) {
            return jwt.sign(adminAccount, this.#JWTSecret, { expiresIn: 30 * 60 * 1000 })
        } else {
            throw new Error('Invalid password')
        }
    }

    async verifyRequest (token = ''): Promise<User | null> {
        if (token !== undefined && token !== '') {
            let account: AdminAccount
            try {
                account = <AdminAccount>jwt.verify(token, this.#JWTSecret)
            } catch (error) {
                console.log(error)
                return null
            }
            if (account?.email && account?.password) {
                const adminAccount = await this.getAdminAccount(account.email)
                const userIsAdmin = account.email === adminAccount.email && account.password === adminAccount.password
                if (userIsAdmin) {
                    return {
                        name: account.email
                    }
                } else {
                    return null
                }
            }
        }
        return null
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
