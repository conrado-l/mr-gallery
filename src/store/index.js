// Vue
import Vue from 'vue'

// Vuex
import Vuex from 'vuex'

// Modules
import auth from './modules/auth/auth'
import photos from './modules/photos/photos'

Vue.use(Vuex)

const modules = {
  auth,
  photos
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules
})
