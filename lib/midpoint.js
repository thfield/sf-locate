const turf = require('@turf/turf')

/** @function arr - returns the midpoint of two points
 * @param {array} one - [lon,lat]
 * @param {array} two - [lon,lat]
 * @returns {array}
 */
function arr (one, two) {
  let point1 = turf.point(one)
  let point2 = turf.point(two)
  return turf.midpoint(point1, point2).geometry.coordinates
}

/** @function obj - returns the midpoint of two points
 * @param {array} one - {longitude:'', latitude:''}
 * @param {array} two - {longitude:'', latitude:''}
 * @returns {array}
 */
function obj (one, two) {
  let point1 = turf.point([one.longitude, one.latitude])
  let point2 = turf.point([two.longitude, two.latitude])
  let mp = turf.midpoint(point1, point2).geometry.coordinates
  return {longitude: mp[0].toString(), latitude: mp[1].toString()}
}

module.exports = {arr, obj}
