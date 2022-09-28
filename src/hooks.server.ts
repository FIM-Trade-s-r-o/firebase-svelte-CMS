import config from '$lib/config'
import {redirect} from '@sveltejs/kit'

const checkAuth = (token: string) => {
    console.log('handleFetch', token)
    const result = config.verifyRequest(token)
    console.log(result)
}

export async function handle ({ event, resolve }) {

    const sessionId = event.cookies.get('sessionId')
    let authenticated = true
    try {
        checkAuth(sessionId)
    } catch (error) {
        console.log(error)
        authenticated = false
    }
    if (!authenticated) {
        return redirect(300, '/')
    }
    const response = await resolve(event)
    return response
}
