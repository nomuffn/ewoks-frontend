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
                if (process.dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) {
                    const devProfile = { id: 1, username: 'Dev User', discordId: '000000000000000000', avatar: '' }
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('profile', JSON.stringify(devProfile))
                    }
                    return devProfile
                }
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('profile')
                }
                return false
            }
        },
        login: async () => {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('profile')
            }
            window.location.href = discordLogin
        },
        logout: async () => {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('profile')
            }
            window.location.href = discordLogout
        },
    }

    inject('auth', auth)
}
