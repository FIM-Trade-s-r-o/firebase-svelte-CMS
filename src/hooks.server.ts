export async function handleFetch ({ request, fetch }) {

    console.log(request, fetch)

    return fetch(request)
}
