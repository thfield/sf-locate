'use strict'
const turf = require('@turf/turf')

function boundaryTest (point, lineshapes) {
  let res = lineshapes.features.find(function (d) {
    let test = turf.booleanPointInPolygon(point, d)
    return test
  })

  return res.properties
}

module.exports = boundaryTest
