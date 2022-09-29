import config from '$lib/config'
import { redirect } from '@sveltejs/kit'


export async function load ({ cookies }) {
    const sessionId = cookies.get('sessionId')
    const isUserAdmin = await config.verifyRequest(sessionId)
    if (!isUserAdmin) {
        throw redirect(300, '/')
    }
    // TODO: email from token
    return {
        user: {
            displayName: ''
        }
    }
}

