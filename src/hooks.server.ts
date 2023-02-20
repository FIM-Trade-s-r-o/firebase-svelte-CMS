import config from '$lib/config'

export async function handle ({ event, resolve }) {
    const sessionId = event.cookies.get('__session')
    try {
        const user = await config.verifyRequest(sessionId)
        event.locals.user = user
    } catch (error) {
        event.locals.user = null
    }
    return await resolve(event)
}

export function getSession ({ locals }) {
    return {
        user: locals.user && {
            ...locals.user
        }
    }
}
