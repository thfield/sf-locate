'use strict'
const boundaryTest = require('./boundaryTest')
const turf = require('@turf/turf')

/** @function sfProps
 * @param {array} point - format [lon, lat]
 * @param {} lineshapes - lineshapes object derived from datasf geojson download
 * @returns geolocated values of point derived from lineshapes it is within or null
 */
module.exports = function (point, lineshapes) {
  point = turf.point(point)

  let precinctProps = boundaryTest(point, lineshapes.precinct)
  let neighborhoodProps = boundaryTest(point, lineshapes.neighborhood)
  let tractProps = boundaryTest(point, lineshapes.tract)

  let props = [
    'assemdist',
    'bartdist',
    'congdist',
    'nhood',
    'prec_2010',
    'prec_2012',
    'supdist',
    'tractce10'
  ]

  let temp = Object.assign({}, precinctProps, neighborhoodProps, tractProps)
  let res = {}

  let notInSF = false

  props.forEach(function (p) {
    res[p] = temp[p]
    if (temp[p] === undefined && notInSF === false) { notInSF = true }
    // TODO: maybe not so restrictive? there could be a point with some properties and not others
  })
  return notInSF ? null : res
}
