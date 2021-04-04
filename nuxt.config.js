export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Ewoks',
        htmlAttrs: {
            lang: 'en',
        },
        meta: [{
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: ''
            },
        ],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        }],
        bodyAttrs: {
            class: 'hidden darken',
            'vs-theme': "dark"
        },
    },

    generate: {
        fallback: true
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        "vuesax/dist/vuesax.css",
        "~assets/default.css",
        'boxicons/css/boxicons.min.css',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['@/plugins/vuesax'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        //'@nuxtjs/eslint-module',
    ],

    router: {
        middleware: 'defaultroute',
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        ['nuxt-matomo', {
            matomoUrl: '//matomo.ewoks.de/',
            siteId: 1
        }],
        '@nuxtjs/auth-next'
    ],
    auth: {
        strategies: {
            discord: {
                scheme: 'oauth2',
                endpoints: {
                    authorization: 'https://discord.com/api/oauth2/authorize',
                    token: 'https://discord.com/api/oauth2/token',
                    userInfo: 'https://discord.com/api/users/@me'
                },
                scope: ['identify', 'email'],
                clientId: '813212218476462081',
                clientSecret: 'm3ej6lPYUDDkR-QkjFCmoT7tR1Au0EMV',
                redirectUri: "http://localhost:3000/login",
                grantType: 'authorization_code',
                responseType: 'token',
                token: {
                    property: 'access_token',
                    type: 'Bearer',
                    maxAge: 1800
                },
                refreshToken: {
                    property: 'refresh_token',
                    maxAge: 60 * 60 * 24 * 30
                },

                // accessType: undefined,
                // logoutRedirectUri: undefined,
                // state: 'UNIQUE_AND_NON_GUESSABLE',
                // codeChallengeMethod: '',
                // responseMode: '',
                // acrValues: '',
                // autoLogout: false
            }
        }
    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        browserBaseURL: 'https://api.ewoks.de'
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
	server: {
        host: "0.0.0.0"
    }
}
