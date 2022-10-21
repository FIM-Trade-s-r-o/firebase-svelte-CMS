import { redirect } from '@sveltejs/kit'

const logOut = async ({ cookies }) => {
    cookies.delete('__session')
    throw redirect(300, '/')
}

export const actions = {
    logOut
}
