// Mutations
import types from './auth.mutations'
import commonTypes from '@/store/common/common.mutation'

// Services
import APIService from '@/api/api-service'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({
  token: null
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
  }
}

const actions = {
  /**
   * Fetches the Bearer token
   * @param commit
   * @param dispatch
   */
  fetchToken ({ commit, dispatch }) {

    return new Promise((resolve, reject) => {
      const URL = 'http://interview.agileengine.com/auth'

      APIService.post(URL)
        .then((res) => {
          debugger
          commit(types.SET_TOKEN, res.data)
          resolve()
        })
        .catch((err) => {
          console.error('An error has occured while fetching the object detail', err)
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
