import config from '$lib/config'
import { redirect } from '@sveltejs/kit'

export async function handle ({ event, resolve }) {
    const sessionId = event.cookies.get('sessionId')
    const isUserAdmin = await config.verifyRequest(sessionId)
    console.log(isUserAdmin, sessionId)
    if (!isUserAdmin) {
        throw redirect(300, '/')
    }
    const response = await resolve(event)
    return response
}
