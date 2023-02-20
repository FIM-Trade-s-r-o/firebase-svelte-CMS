import config from '$lib/config'
import { fail, redirect } from '@sveltejs/kit'

export async function load ({ locals }) {
    if (locals.user) {
        throw redirect(300, '/dashboard')
    }
}

const login = async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')

    let adminAccount, token
    try {
        adminAccount = await config.getAdminAccount(email)
    } catch (error) {
        return fail(404, { code: 'cantFindAdminAccount', message: '' })
    }
    if (!adminAccount) {
        return fail(400, { code: 'userIsNotAdmin', message: '' })
    }
    try {
        token = config.login(adminAccount, password)
    } catch {
        return fail(400, { code: 'wrongPassword', message: '' })
    }
    cookies.set('__session', token)
    throw redirect(302, '/dashboard')
}


export const actions = {
    login
}
