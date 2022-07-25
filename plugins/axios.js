import Vue from 'vue'
import Axios from 'axios'

// TODO combine axios injections

Axios.defaults.headers.common.Accept = 'application/json'

Vue.$http = Axios
Object.defineProperty(Vue.prototype, '$http', {
    get() {
        return Axios
    },
})
