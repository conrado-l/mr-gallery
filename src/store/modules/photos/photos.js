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
   * Gets the thumbnail photos
   * NOTE: This is a caveat/workaround for the library that I'm currently using, I know this is not the best way to do it
   * @param state
   * @returns {array}
   */
  getThumbnailPhotos: state => {
    return state.photos.map(photo => {
      return {
        ...photo,
        src: photo.cropped_picture
      }
    })
  },
  /**
   * Gets the full size photos
   * NOTE: This is a caveat/workaround for the library that I'm currently using, I know this is not the best way to do it
   * @param state
   * @returns {array}
   */
  getFullSizePhotos: state => {
    return state.photos.map(photo => {
      return {
        title: photo.author ? `By ${photo.author} ` : '',
        description: photo.camera && photo.tags ? `Camera model: ${photo.camera} | Hashtags: ${photo.tags || ''}` : '',
        src: photo.full_picture || photo.cropped_picture
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
   * Checks if a photo was already loaded
   * @param state
   * @returns {boolean}
   */
  getIsFullPhotoAlreadyLoaded: state => photoId => {
    return state.photos.some(photo => (photo.id === photoId) && photo.full_picture)
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
  [types.SET_CURRENT_PAGE] (state) {
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
    state.photos = state.photos.map(photo => {
      // Update the photo with the actual details
      if (photo.id === photoDetails.id) {
        return {
          ...photoDetails,
          src: photoDetails.full_picture
        }
      } else {
        return photo
      }
    })
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
      // Make the request
      APIService.get('images', { page: getters.getCurrentPage })
        .then((res) => {
          // Check if the pictures field is valid
          if (res?.data?.pictures && typeof res.data.pictures === 'object') {
            commit(types.SET_PHOTOS, res.data.pictures)
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
      APIService.get(`images/${photoId}`, {})
        .then((res) => {
          // Check if the data field is valid
          if (res?.data && typeof res.data === 'object') {
            commit(types.SET_PHOTO_DETAILS, res.data)
            resolve()
          } else {
            console.error('An error has occurred while trying to fetch the image detail', res)
            reject(res)
          }
        })
        .catch((err) => {
          console.error('An error has occurred while trying to fetch the image detail', err)
          reject(err)
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
