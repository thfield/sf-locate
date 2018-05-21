'use strict'
const path = require('path')
const boundaryTest = require('./boundaryTest')
const readFile = require('./readFile')
const turf = require('@turf/turf')

let precinctFile = 'fhns-n8qp'
let precinctPath = path.join('.', 'geo', `${precinctFile}.json`)
let precinctGeo = readFile(precinctPath)

let neighborhoodFile = 'p5b7-5n3h'
let neighborhoodPath = path.join('.', 'geo', `${neighborhoodFile}.json`)
let neighborhoodGeo = readFile(neighborhoodPath)

let tractFile = 'rarb-5ahf'
let tractPath = path.join('.', 'geo', `${tractFile}.json`)
let tractGeo = readFile(tractPath)

let point = [-122.41959854, 37.77565625]

let res = getProps(point)

console.log(res)

function getProps (point) {
  point = turf.point(point)

  let precinctProps = boundaryTest(point, precinctGeo)
  let neighborhoodProps = boundaryTest(point, neighborhoodGeo)
  let tractProps = boundaryTest(point, tractGeo)

  let props = [
    'bartdist',
    'assemdist',
    'prec_2012',
    'prec_2010',
    'supdist',
    'congdist',
    'nhood',
    'name10'
  ]

  let temp = Object.assign({}, precinctProps, neighborhoodProps, tractProps)
  let res = {}
  props.forEach(function (p) {
    res[p] = temp[p]
  })
  return res
}

function errorHandler (err) {
  throw err
}
