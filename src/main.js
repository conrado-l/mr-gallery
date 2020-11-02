// Vue
import Vue from 'vue'

// Plugins
import './plugins/axios'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueToast from 'vue-toast-notification'

// Components
import App from './App.vue'

// Styles
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import './assets/styles/styles.scss'

Vue.config.productionTip = false

Vue.use(VueToast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
