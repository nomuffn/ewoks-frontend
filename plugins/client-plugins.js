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
