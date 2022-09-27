import { user } from '$lib/firebase'
import { get } from 'svelte/store'

export async function load () {
    // const userData = get(user)
    // TODO: email from token
    return {
        user: {
            displayName: ''
        }
    }
}

