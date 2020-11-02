import Vue from 'vue'

// Mutations
import types from './photos.mutations'
import commonTypes from '@/store/common/common.mutation'

// Services
import APIService from '@/services/apiService'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({
  photos: [],
  currentPage: 1,
  fetchingPhotos: false,
  fetchingPhotoDetail: false
})

const state = initialState()

const getters = {
  /**
   * Gets the photos
   * @param state
   * @returns {array}
   */
  getPhotos: state => {
    return state.photos.map(photo => {
      return {
        ...photo,
        thumbnailPhoto: photo.cropped_picture,
        fullPhoto: photo.full_picture || null,
        title: photo.author ? `By ${photo.author} ` : '',
        description: photo.camera && photo.tags ? `Camera model: ${photo.camera} | Hashtags: ${photo.tags || ''}` : '',
        detailLoaded: photo.detailLoaded || false
      }
    })
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
   * Checks if a photo's details was already loaded
   * @param state
   * @returns {boolean}
   */
  getIsPhotoDetailsLoaded: state => photoId => {
    return state.photos.some(photo => (photo.id === photoId) && photo.detailLoaded)
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
   * Gets the fetching state for the photos
   * @param state
   * @returns {boolean}
   */
  getIsFetchingPhotos: state => {
    return state.fetchingPhotos
  },
  /**
   * Gets the fetching state for the photo details
   * @param state
   * @returns {boolean}
   */
  getIsFetchingPhotoDetails: state => {
    return state.fetchingPhotoDetail
  },
  /**
   * Gets the amount of photos
   * @param state
   * @returns {number}
   */
  getPhotosAmount: state => {
    return state.photos.length
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
   */
  [types.SET_NEXT_PAGE] (state) {
    state.currentPage += 1
  },
  /**
   * Sets the photos
   * @param state
   * @param {array} photos
   */
  [types.SET_PHOTOS] (state, photos) {
    state.photos = [...state.photos, ...photos]
  },
  /**
   * Sets the photo details
   * @param state
   * @param {object} photoDetails
   */
  [types.SET_PHOTO_DETAILS] (state, photoDetails) {
    const photoIndex = state.photos.findIndex(photo => photo.id === photoDetails.id)
    Vue.set(state.photos, photoIndex, { ...photoDetails, detailLoaded: true })
  },
  /**
   * Sets the fetching status for the photos
   * @param state
   * @param {boolean} status
   */
  [types.SET_FETCHING_PHOTOS_STATUS] (state, status) {
    state.fetchingPhotos = status
  },
  /**
   * Sets the fetching status for the photo details
   * @param state
   * @param {boolean} status
   */
  [types.SET_FETCHING_PHOTO_DETAILS_STATUS] (state, status) {
    state.fetchingPhotoDetail = status
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
      commit(types.SET_FETCHING_PHOTOS_STATUS, true)

      // Make the request
      APIService.get('images', { page: getters.getCurrentPage })
        .then((res) => {
          // Check if the pictures field is valid
          if (res?.data?.pictures && Array.isArray(res.data.pictures)) {
            commit(types.SET_PHOTOS, res.data.pictures)
            commit(types.SET_NEXT_PAGE)
            resolve()
          } else {
            console.error('An error has occurred while trying to fetch the photos', res)
            reject(res)
          }
        })
        .catch((err) => {
          console.error('An error has occurred while trying to fetch the photos', err)
          reject(err)
        })
        .finally(() => {
          commit(types.SET_FETCHING_PHOTOS_STATUS, false)
        })
    })
  },
  /**
   * Fetches and sets the photo detail
   * @param commit
   * @param dispatch
   * @param getters
   * @param {string} photoId
   */
  fetchPhotoDetail ({ commit, dispatch, getters }, photoId) {
    return new Promise((resolve, reject) => {
      commit(types.SET_FETCHING_PHOTO_DETAILS_STATUS, true)

      APIService.get(`images/${photoId}`, {})
        .then((res) => {
          // Check if the data field is valid
          if (res?.data && typeof res.data === 'object') {
            commit(types.SET_PHOTO_DETAILS, res.data)
            resolve()
          } else {
            console.error('An error has occurred while trying to fetch the photo detail', res)
            reject(res)
          }
        })
        .catch((err) => {
          console.error('An error has occurred while trying to fetch the photo detail', err)
          reject(err)
        })
        .finally(() => {
          commit(types.SET_FETCHING_PHOTO_DETAILS_STATUS, false)
        })
    })
  },
  /**
   * Resets the store's state.
   * @param commit
   */
  resetStore ({ commit }) {
    commit(commonTypes.RESET_STORE)
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
