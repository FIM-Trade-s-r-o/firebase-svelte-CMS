import adapter from 'svelte-adapter-firebase'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess(),

    kit: {
        adapter: adapter(),
        vite: {
            ssr: {
                noExternal: ['@popperjs/core']
            }
        }
    }
}

export default config
