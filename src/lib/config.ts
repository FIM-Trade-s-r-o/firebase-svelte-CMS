// CMS config

interface GlobalConfig {
    serviceAccounts: Array<string>,
    isInServiceAccounts: (email: string) => boolean
}

const config: GlobalConfig = {
    serviceAccounts: ['filip.holcik.official@gmail.com'],
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

const isServiceAccount = config.isInServiceAccounts
export {
    isServiceAccount
};