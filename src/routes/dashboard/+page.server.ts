const logOut = async ({ cookies }) => {
    cookies.delete('sessionId')
}

export const actions = {
    logOut
}
