import type Schema from '$lib/schemas/lib'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '$lib/firebase'

interface Sorting {
    property: string,
    sort: 'asc' | 'desc'
}

interface Collection {
    name: string,
    schema: Schema,
    sortBy?: Sorting
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
        this.collections = collections
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
}

export default Config
export type { ConfigT }
