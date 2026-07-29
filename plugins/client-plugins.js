import Vue from 'vue'
import Slider from '@vueform/slider/dist/slider.vue2.js'
import Loading from '@/components/LoadingSpinner.vue'
import VueGoodTablePlugin from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import vuetimeline from '@growthbunker/vuetimeline'
import VueTimers from 'vue-timers'

Vue.component('Slider', Slider)
Vue.component('Loading', Loading)
Vue.use(VueGoodTablePlugin)
Vue.use(vuetimeline)
Vue.use(VueTimers)

Vue.mixin({
    methods: {
        formatNum(val, maxDecimals = 2) {
            if (val === undefined || val === null || val === '') return '0'
            const num = Number(val)
            if (isNaN(num)) return val
            if (Number.isInteger(num)) return num.toLocaleString()
            const factor = Math.pow(10, maxDecimals)
            const rounded = Math.round(num * factor) / factor
            return rounded.toLocaleString(undefined, { maximumFractionDigits: maxDecimals })
        },
        formatPp(val) {
            return this.formatNum(val, 2)
        },
    },
})
