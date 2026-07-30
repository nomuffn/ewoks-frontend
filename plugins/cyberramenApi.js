import Cookies from 'js-cookie'

export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const cyberramenApi = $axios.create({
        baseURL: baseURL + 'backend/api/cyberramen/',
        withCredentials: true, // sends all cookies
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
    })

    cyberramenApi.interceptors.request.use((config) => {
        const token = Cookies.get('csrftoken')
        if (token) {
            config.headers['X-CSRFToken'] = token
        }
        return config
    })

    // Inject to context as $api
    inject('crrApi', cyberramenApi)
}
