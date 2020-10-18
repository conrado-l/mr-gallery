// Mutations
import types from './photos.mutations'
import commonTypes from '@/store/common/common.mutation'

// Services
import APIService from '@/services/apiService'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({
  photos: [],
  currentPage: 1,
  fetching: false
})

const state = initialState()

const getters = {
  /**
   * Gets the photos
   * @param state
   * @returns {array}
   */
  getPhotos: state => {
    return state.photos
  },
  /**
   * Checks if there are any loaded photos
   * @param state
   * @returns {boolean}
   */
  getArePhotosAvailable: state => {
    return !!state.photos.length
  },
  /**
   * Gets the current page
   * @param state
   * @returns {number}
   */
  getCurrentPage: state => {
    return state.currentPage
  },
  /**
   * Gets the URL for fetching the photos with pagination
   * @param state
   * @returns {string}
   */
  getPaginatedUrlPhotos: state => {
    return `images/${state.currentPage}`
  },
  /**
   * Gets the fetching state
   * @param state
   * @returns {boolean}
   */
  getIsFetching: state => {
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
   * Sets the current page
   * @param state
   * @param {number} pageNumber
   */
  [types.SET_PHOTOS] (state, pageNumber) {
    state.currentPage = pageNumber
  },
  /**
   * Sets the photos
   * @param state
   * @param {array} photos
   */
  [types.SET_PHOTOS] (state, photos) {
    state.photos = photos
  },
  /**
   * Sets the fetching status
   * @param state
   * @param {boolean} status
   */
  [types.SET_FETCHING_STATUS] (state, status) {
    state.fettching = status
  }
}

const actions = {
  /**
   * Fetches and sets the photos
   * @param commit
   * @param dispatch
   * @param getters
   */
  fetchPhotos ({ commit, dispatch, getters }) {
    return new Promise((resolve, reject) => {
      // Make the request to AgileEngine's API
      APIService.get('images', { page: getters.getCurrentPage })
        .then((res) => {
          // Check if the pictures field is valid
          if (res?.data?.pictures && typeof res.data.pictures === 'object') {
            commit(types.SET_PHOTOS, res.data.pictures)
            resolve()
          } else {
            console.error('An error has occurred while trying to fetch the images', res)
            reject(res)
          }
        })
        .catch((err) => {
          console.error('An error has occurred while trying to fetch the images', err)
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
