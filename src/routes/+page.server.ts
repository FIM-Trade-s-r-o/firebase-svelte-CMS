import config from '$lib/config'
import { invalid, redirect } from '@sveltejs/kit'

export async function load ({ locals }) {
    if (locals.user) {
        throw redirect(300, '/dashboard')
    }
}

const login = async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')

    const adminAccount = await config.getAdminAccount(email)
    if (adminAccount) {
        const token = config.login(adminAccount, password)
        cookies.set('sessionId', token)
        throw redirect(302, '/dashboard')
    } else {
        throw invalid(400, { code: 'userIsNotAdmin', message: '' })
    }
}


export const actions = {
    login
}
