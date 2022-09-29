import config from '$lib/config'
import { invalid } from '@sveltejs/kit'

const login = async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')

    const adminAccount = await config.getAdminAccount(email)
    if (adminAccount) {
        const token = config.login(adminAccount, password)
        cookies.set('sessionId', token)
        return {
            name: email,
            token
        }
    } else {
        throw invalid(400, { code: 'userIsNotAdmin', message: '' })
    }
}


export const actions = {
    login
}
