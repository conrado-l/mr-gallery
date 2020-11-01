/**
 * Copies a text to the clipboard
 * @param {string} text
 */
export function copyTextToClipboard (text) {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
