/**
 * API Service
 */

const apiURL = 'http://interview.agileengine.com'

/**
 * Sends a GET request
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function get (url, params) {
  return window.axios.get(`${apiURL}/${url}`, { params: { ...params } })
}

/**
 * Sends a POST request with the proper params
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function post (url, params) {
  return window.axios.post(`${apiURL}/${url}`, params)
}

export default {
  get,
  post
}
