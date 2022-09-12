import config from '$lib/config'
import {invalid, redirect} from '@sveltejs/kit'
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from '@firebase/auth'
import { auth, user } from '$lib/firebase'
import { get } from 'svelte/store'

const login = async ({ request }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')

    if (await config.isAdminAccount(email)) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return {
            name: userCredential.user.displayName
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

export async function load () {
    console.log()
    if (get(user)) {
        console.log('red')
        return redirect(300, '/dashboard')
    }
}
