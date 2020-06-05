'use strict'
const turf = require('@turf/turf')

/**
 * @param {object} point - a geoJSON Point
 * @param {object} lineshapes - a geoJSON FeatureCollection
 * @returns {object} the properties of the geojson boundary the point is within
 */
function boundaryTest (point, lineshapes) {
  let res = lineshapes.features.find(function (d) {
    let test = turf.booleanPointInPolygon(point, d)
    return test
  })

  return res ? res.properties : 'Containing boundary not found'
}

module.exports = boundaryTest
