export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const cyberramenApi = $axios.create({
        baseURL: baseURL + 'backend/api/cyberramen/',
        withCredentials: true, // sends all cookies
    })

    // Inject to context as $api
    inject('crrApi', cyberramenApi)
}
