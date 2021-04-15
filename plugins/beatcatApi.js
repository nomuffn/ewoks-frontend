export default function ({ $axios, $config: { baseURL } }, inject) {
    // Create a custom axios instance
    const beatcatApi = $axios.create({
        baseURL: baseURL + "backend/api/beatcat/",
    });

    // Inject to context as $api
    inject("beatcatApi", beatcatApi);
}
