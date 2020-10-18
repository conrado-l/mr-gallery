// Mutations
import types from './auth.mutations'
import commonTypes from '@/store/common/common.mutation'

// Services
import APIService from '@/services/apiService'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({
  token: null,
  authenticated: false,
  fetching: false
})

const state = initialState()

const getters = {
  /**
   * Gets the token
   * @param state
   * @returns {string}
   */
  getToken: state => {
    return state.token
  },
  /**
   * Gets the authenticated state for the current user
   * @param state
   * @returns {boolean}
   */
  getIsUserAuthenticated: state => {
    return state.authenticated
  },
  /**
   * Gets the fetching state
   * @param state
   * @returns {boolean}
   */
  getFetchingState: state => {
    return state.fetching
  }
}

const mutations = {
  /**
   * Resets the store's state
   * @param state
   */
  [commonTypes.RESET_STORE] (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  /**
   * Sets the token
   * @param state
   * @param {string} token
   */
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  /**
   * Sets the authentication status
   * @param state
   * @param {boolean} status
   */
  [types.SET_AUTHENTICATED_STATUS] (state, status) {
    state.authenticated = status
  }
}

const actions = {
  /**
   * Fetches and sets the Bearer token
   * @param commit
   * @param dispatch
   */
  fetchToken ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      const url = 'auth'
      const payload = { apiKey: '23567b218376f79d9415' }

      // Make the request to AgileEngine's API
      APIService.post(url, payload)
        .then(res => {
          // Check if the token is valid
          if (res?.data?.token && typeof res.data.token === 'string') {
            commit(types.SET_TOKEN, res.data.token)
            commit(types.SET_AUTHENTICATED_STATUS, true)
            resolve()
          } else {
            console.error('An error has occurred while trying to authenticate', res)
            reject(res)
          }
        })
        .catch((err) => {
          console.error('An error has occurred while trying to authenticate', err)
          reject(err)
        })
    })
  },
  /**
   * Resets the store's state.
   * @param commit
   */
  resetStore ({ commit }) {
  }
}

export default {
  namespaced: true,
  initialState,
  state,
  getters,
  mutations,
  actions
}
