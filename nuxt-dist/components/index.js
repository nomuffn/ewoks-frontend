export { default as Logo } from '../../components/Logo.vue'
export { default as VuesaxLogo } from '../../components/VuesaxLogo.vue'

export const LazyLogo = import('../../components/Logo.vue' /* webpackChunkName: "components/logo" */).then(c => c.default || c)
export const LazyVuesaxLogo = import('../../components/VuesaxLogo.vue' /* webpackChunkName: "components/vuesax-logo" */).then(c => c.default || c)
