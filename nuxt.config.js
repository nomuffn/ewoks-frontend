export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'muffnlabs',
        htmlAttrs: {
            lang: 'en',
        },
        meta: [
            {
                charset: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            // {
            //     hid: "description",
            //     name: "description",
            //     content: ""
            // }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
        ],
        bodyAttrs: {
            class: 'darken',
            'vs-theme': 'dark',
        },
    },

    publicRuntimeConfig: {
        baseURL: process.env.API_URL || 'https://muffnlabs.de/',
        discordLogin:
            (process.env.API_URL || 'https://muffnlabs.de/') +
            'backend/oauth/login/discord',
        discordLogout:
            (process.env.API_URL || 'https://muffnlabs.de/') + 'backend/logout',
    },

    generate: {
        fallback: true,
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/scss/tailwind.css',
        'vuesax/dist/vuesax.css',
        'boxicons/css/boxicons.min.css',
        '~/assets/scss/global.scss',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@plugins/global-components',
        '@/plugins/vuesax',
        '@/plugins/defaultApi',
        '@/plugins/mapttsApi',
        '@/plugins/auth',
        '@/plugins/axios',
        { src: '~~/node_modules/vue-rellax/lib/nuxt-plugin', ssr: false },
        { src: '@/plugins/vuetimeline.js' },
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        //'@nuxtjs/eslint-module',
        '@nuxtjs/composition-api/module',
        '@nuxt/postcss8',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        [
            'nuxt-matomo',
            {
                matomoUrl: '//matomo.muffnlabs.de/',
                siteId: 1,
            },
        ],
        [
            'primevue/nuxt',
            {
                theme: 'saga-blue',
                ripple: true, //whether the ripple animation is enabled, defaults to false
                components: [
                    'InputText',
                    'Button',
                    'Toast',
                    'Slider',
                    'ColorPicker',
                    'Dialog',
                    'Message',
                    'OverlayPanel',
                ],
                // directives: ['Tooltip', 'Badge'], //an array of directives to be registered
            },
        ],
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        postcss: {
            plugins: {
                tailwindcss: {},
                autoprefixer: {},
            },
        },
    },
    server: {
        host: '0.0.0.0',
    },

    watchers: {
        webpack: {
            ignored: /node_modules/,
        },
    },
}
