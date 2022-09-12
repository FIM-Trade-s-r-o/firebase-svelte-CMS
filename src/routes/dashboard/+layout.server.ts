import { user } from '$lib/firebase'
import { get } from 'svelte/store'

export async function load () {
    const userData = get(user)
    return {
        user: {
            displayName: userData.displayName
        }
    }
}

