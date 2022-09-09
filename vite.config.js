import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
    ssr: {
        noExternal: ['@popperjs/core']
    },
    plugins: [sveltekit()]
}

export default config
