'use strict'

import Vue from 'vue'
import axios from 'axios'
import authStore from '../store/modules/auth/auth'

const config = {
  baseURL: process.env.VUE_APP_API_BASE_URL
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    if (authStore?.state?.token) {
      config.headers = {
        Authorization: `Bearer ${authStore.state.token}`
      }
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
