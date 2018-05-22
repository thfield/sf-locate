'use strict'
const fs = require('fs')
const path = require('path')
const boundaryTest = require('./lib/boundaryTest')
const readFile = require('./lib/readFile')
const readCsv = require('./lib/readCsv')
const turf = require('@turf/turf')
const json2csv = require('json2csv').parse

let precinctFile = 'fhns-n8qp'
let precinctPath = path.join('.', 'geo', `${precinctFile}.json`)
let precinctGeo = readFile(precinctPath)

let neighborhoodFile = 'p5b7-5n3h'
let neighborhoodPath = path.join('.', 'geo', `${neighborhoodFile}.json`)
let neighborhoodGeo = readFile(neighborhoodPath)

let tractFile = 'rarb-5ahf'
let tractPath = path.join('.', 'geo', `${tractFile}.json`)
let tractGeo = readFile(tractPath)

try {
  let addresses = readCsv('./data/test.csv')
  addresses = addresses.map(assignAddressProperties)
  console.log(addresses[0])
  // const fields = Object.keys(addresses[0])
  // const opts = { fields }
  //
  // const csv = json2csv(addresses, opts)
  // fs.writeFileSync(csv, 'data/output.csv')
} catch (err) {
  errorHandler(err)
}

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

function assignAddressProperties (el) {
  let point = [el.Longitude, el.Latitude]
  return getProps(point)
}
