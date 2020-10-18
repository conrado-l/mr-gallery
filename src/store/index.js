// Vue
import Vue from 'vue'

// Vuex
import Vuex from 'vuex'

// Modules
import auth from './modules/auth/auth'

Vue.use(Vuex)

const modules = {
  auth
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
