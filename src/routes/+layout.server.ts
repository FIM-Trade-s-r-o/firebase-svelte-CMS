// import { redirect } from '@sveltejs/kit'
// import { user } from '$lib/firebase'
// import { get } from 'svelte/store'
//
// const redirectIfNotThere = async (currentUrl: string, targetUrl: string, exact: boolean) => {
//     const isThere = exact ? currentUrl === targetUrl : currentUrl.indexOf(targetUrl) !== -1
//     if (!isThere) {
//         throw redirect(300, targetUrl)
//     }
// }
//
// export async function load ({ url }) {
//     if (get(user)) {
//         await redirectIfNotThere(url.pathname, '/dashboard', false)
//     } else {
//         await redirectIfNotThere(url.pathname, '/', true)
//     }
// }
//
