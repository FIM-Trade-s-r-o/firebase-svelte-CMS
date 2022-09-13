import config from '$lib/config'

export async function load () {
    return {
        collections: config.serializedCollections
    }
}
