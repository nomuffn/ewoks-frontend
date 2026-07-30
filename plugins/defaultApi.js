import Cookies from 'js-cookie'

export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const defaultApi = $axios.create({
        baseURL: baseURL + 'backend/api/',
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
    })

    defaultApi.interceptors.request.use((config) => {
        const token = Cookies.get('csrftoken')
        if (token) {
            config.headers['X-CSRFToken'] = token
        }
        return config
    })

    // Inject to context as $api
    inject('defaultApi', defaultApi)
}

