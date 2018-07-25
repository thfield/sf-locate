'use strict'

/** @function nestedFind
 * @param data - a d3.nest().entries() object
 * @param keys - the keys to find values for, in nested order
 * @returns *falsey* if not found, otherwise *value*
 */
function nestedFind (data, ...keys) {
  let res = data.find(function (el) { return el.key === keys[0] })
  if (!res) return undefined
  if (keys.length > 1) {
    keys.shift()
    return nestedFind(res.values, ...keys)
  }
  return res.value ? res.value : res.values
}

module.exports = nestedFind
