export default ({ $axios, $config: { baseURL } }, inject) => {
    const discordLogin = baseURL + 'backend/oauth/login/discord'
    const discordLogout = baseURL + 'backend/logout'

    const auth = {
        fetch: async () => {
            try {
                const result = await $axios.$get(baseURL + 'backend/profile', {
                    withCredentials: true,
                })

                if (!result) throw new Error()

                localStorage.setItem('profile', JSON.stringify(result))
                return result
            } catch (e) {
                localStorage.removeItem('profile')
                return false
            }
        },
        login: async () => {
            localStorage.removeItem('profile')
            window.location.href = discordLogin
        },
        logout: async () => {
            localStorage.removeItem('profile')
            window.location.href = discordLogout
        },
    }

    inject('auth', auth)
}
