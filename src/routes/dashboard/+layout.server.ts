import { redirect } from '@sveltejs/kit'


export async function load ({ locals }) {
    if (!locals.user) {
        throw redirect(300, '/')
    }
    return {
        user: locals.user
    }
}

