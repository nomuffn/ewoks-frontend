export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: "Ewoks",
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            {
                charset: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                hid: "description",
                name: "description",
                content: "",
            },
        ],
        link: [
            {
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico",
            },
        ],
        bodyAttrs: {
            class: "hidden darken",
            "vs-theme": "dark",
        },
    },

    publicRuntimeConfig: {
        baseURL: process.env.BASE_URL || "https://ewoks.de/",
    },

    generate: {
        fallback: true,
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        "vuesax/dist/vuesax.css",
        "~assets/default.css",
        "boxicons/css/boxicons.min.css",
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        "@/plugins/vuesax",
        "@/plugins/defaultApi",
        "@/plugins/mapttsApi",
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        //'@nuxtjs/eslint-module',
    ],

    router: {
        middleware: "defaultroute",
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        "@nuxtjs/proxy",
        [
            "nuxt-matomo",
            {
                matomoUrl: "//matomo.ewoks.de/",
                siteId: 1,
            },
        ],
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
    server: {
        host: "0.0.0.0",
    },
};
