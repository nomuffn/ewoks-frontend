export default ({ $axios, $config: { baseURL } }, inject) => {
    const isAuthenticated = async () =>
        await $axios.$get(baseURL + 'backend/isAuthenticated', {
            withCredentials: true,
        })
    inject('isAuthenticated', isAuthenticated)
}
