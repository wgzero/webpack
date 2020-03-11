import Vue from 'vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'

import './assets/css/reset.css'

// import axios from 'axios'
// axios.defaults.withCredentials = true
// axios.defaults.crossDomain = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.timeout = 5000 // 请求超时
// axios.defaults.baseURL = 'http://summer.wgzero.com'

// Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#root")