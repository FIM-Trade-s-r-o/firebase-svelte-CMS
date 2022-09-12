import { auth } from '$lib/firebase'
import { signOut } from 'firebase/auth'
import { invalid } from '@sveltejs/kit'

const logOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        throw invalid(500, { error })
    }
}

export const actions = {
    logOut
}
