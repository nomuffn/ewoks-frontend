export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    //ssr: false,

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
        baseURL: process.env.API_URL || "https://ewoks.de/",
        discordLogin:
            (process.env.API_URL || "https://ewoks.de/") +
            "backend/oauth/login/discord",
        discordLogout:
            (process.env.API_URL || "https://ewoks.de/") + "backend/logout",
    },

    generate: {
        fallback: true,
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        "vuesax/dist/vuesax.css",
        "boxicons/css/boxicons.min.css",
        "~/assets/scss/global.scss",
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: "@/plugins/vuesax", ssr: false },
        "@/plugins/defaultApi",
        "@/plugins/mapttsApi",
        "@/plugins/auth",
        "@/plugins/nl2br",
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        //'@nuxtjs/eslint-module',
        "@nuxt/components",
    ],

    router: {
        middleware: "defaultroute",
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        "@nuxtjs/proxy",
        "@nuxtjs/strapi",
        [
            "nuxt-matomo",
            {
                matomoUrl: "//matomo.ewoks.de/",
                siteId: 1,
            },
        ],
    ],

    strapi: {
        entities: ["pages", "structure"],
        url: process.env.STRAPI_URL || "https://ewoks.de/cms",
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
    server: {
        host: "0.0.0.0",
    },
};
