import config from '$lib/config'

export async function handle ({ event, resolve }) {
    const sessionId = event.cookies.get('__session')
    const user = await config.verifyRequest(sessionId)
    event.locals.user = user
    return await resolve(event)
}

export function getSession ({ locals }) {
    return {
        user: locals.user && {
            ...locals.user
        }
    }
}
