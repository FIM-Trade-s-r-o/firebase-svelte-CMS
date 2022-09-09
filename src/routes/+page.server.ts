import config from '$lib/config/'
import { invalid } from '@sveltejs/kit'

const verifyUser = async ({ request }) => {
    const data = await request.formData()
    const email = data.get('email')

    if (await config.isAdminAccount(email)) {
        return {
            isAdmin: true
        }
    } else {
        throw invalid(400, { code: 'userIsNotAdmin', message: '' })
    }
}

export const actions = {
    default: verifyUser
}
