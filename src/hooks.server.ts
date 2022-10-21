import config from '$lib/config'

export async function handle ({ event, resolve }) {
    const sessionId = event.cookies.get('sessionId')
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

export async function handleFetch ({ event, request, fetch }) {
    request.headers.set('cookie', event.request.headers.get('cookie'))

    return fetch(request)
}
