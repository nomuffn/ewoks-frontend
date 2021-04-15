export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const mapttsApi = $axios.create({
        baseURL: baseURL + "backend/api/maptts/",
    });

    // Inject to context as $api
    inject("mapttsApi", mapttsApi);
}
