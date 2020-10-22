// Vue
import Vue from 'vue'

// Vuetify
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'

// Plugins
import VuetifyToast from 'vuetify-toast-snackbar-ng'

Vue.use(VuetifyToast)
Vue.use(Vuetify, {
  components: {
    VIcon,
    VBtn,
    VSnackbar
  }
})

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#53284f',
        secondary: '#7ca3dc',
        accent: '#8c9eff',
        error: '#b71c1c'
      }
    }
  }
})
