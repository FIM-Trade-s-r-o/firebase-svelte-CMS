// CMS config

interface GlobalConfig {
    serviceAccounts: Array<string>,
    collections: Array<string>,
    isInServiceAccounts: (email: string) => boolean
}

const config: GlobalConfig = {
    serviceAccounts: ['filip.holcik.official@gmail.com'],
    collections: ['articles'],
    isInServiceAccounts: (emailToCheck) => {
        let match = false;
        config.serviceAccounts.forEach(email => {
            if (email === emailToCheck) {
                match = true;
            }
        })
        return  match;
    }
}

const collections = config.collections;
const isServiceAccount = config.isInServiceAccounts
export {
    collections,
    isServiceAccount
};