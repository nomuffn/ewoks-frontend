export default function ({ $axios }, inject) {
    // Create a custom axios instance
    const defaultApi = $axios.create({
        baseURL: "https://ewoks.de/api/",
    });

    // Inject to context as $api
    inject("defaultApi", defaultApi);
}
