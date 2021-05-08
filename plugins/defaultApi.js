export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const defaultApi = $axios.create({
        baseURL: baseURL + "backend/api/scoresaber/",
    });

    // Inject to context as $api
    inject("defaultApi", defaultApi);
}
