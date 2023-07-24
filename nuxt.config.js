const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

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
    },

    publicRuntimeConfig: {
        baseURL: process.env.API_URL || 'https://muffnlabs.de/',
    },

    generate: {
        fallback: true,
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/scss/tailwind.css',
        'boxicons/css/boxicons.min.css',
        '~/assets/scss/global.scss',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '@/plugins/client-plugins', mode: 'client' },
        { src: '@/plugins/auth', mode: 'client' },
        '@/plugins/axios',
        '@/plugins/defaultApi',
        '@/plugins/mapttsApi',
        '@/plugins/cyberramenApi',
        { src: '~~/node_modules/vue-rellax/lib/nuxt-plugin', ssr: false },
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
                // theme: 'md-dark-indigo',
                theme: 'arya-blue',
                ripple: true, //whether the ripple animation is enabled, defaults to false
                components: [
                    'InputText',
                    'InputNumber',
                    'Button',
                    'Fieldset',
                    'Toast',
                    'Slider',
                    'ColorPicker',
                    'Dialog',
                    'Message',
                    'OverlayPanel',
                    'Dropdown',
                    'ContextMenu',
                    'TabMenu',
                    'Paginator',
                    'ProgressSpinner',
                    'RadioButton',
                    'Checkbox',
                    'DataTable',
                    'Column',
                    'ColumnGroup',
                    'DataTable',
                    'Panel',
                    'ConfirmDialog',
                    'InlineMessage',
                    'TabView',
                    'TabPanel',
                    'ProgressBar',
                ],
                // directives: ['Tooltip', 'Badge'], //an array of directives to be registered
            },
        ],
        ['nuxt-buefy', { css: false, materialDesignIcons: false }],
    ],

    router: {
        trailingSlash: false,
        middleware: 'trailingSlashRedirect',
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
        plugins: [new SpeedMeasurePlugin()],
        analyze: true,
        cache: true,
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
