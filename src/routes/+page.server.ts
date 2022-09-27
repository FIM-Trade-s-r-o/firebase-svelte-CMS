import config from '$lib/config'
import { invalid } from '@sveltejs/kit'
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from '@firebase/auth'
import { auth } from '$lib/firebase'

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

const resetPassword = async ({ request }) => {
    const data = await request.formData()
    const email = data.get('email')
    try {
        await sendPasswordResetEmail(auth, email)
    } catch (error) {
        throw invalid(400, { error })
    }
}

export const actions = {
    login,
    resetPassword
}
