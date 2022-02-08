import type Schema from "$lib/schemas/lib";

interface Collection {
    name: string,
    schema: Schema
}

interface GlobalConfig {
    adminAccounts: Array<string>,
    collections: Array<Collection>,
}

class Config {
    adminAccounts: Array<string>;
    collections: Array<Collection>;
    constructor({ adminAccounts, collections }: GlobalConfig) {
        this.adminAccounts = adminAccounts;
        this.collections = collections;
    }
    isAdminAccount(emailToCheck: string): boolean {
        let match = false;
        this.adminAccounts.forEach(email => {
            if (email === emailToCheck) {
                match = true;
            }
        })
        return match;
    }
    getCollectionSchema(name: string): Schema {
        for (const collection of this.collections) {
            if (name === collection.name) {
                return collection.schema;
            }
        }
    }
}

export default Config;