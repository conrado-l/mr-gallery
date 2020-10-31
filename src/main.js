// Vue
import Vue from 'vue'

// Plugins
import './plugins/axios'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Components
import App from './App.vue'

// Styles
import 'roboto-fontface/css/roboto/roboto-fontface.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
