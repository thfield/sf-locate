'use strict'
const fs = require('fs')
const path = require('path')

const json2csv = require('json2csv').parse

const readFile = require('./lib/readFile')
const readCsv = require('./lib/readCsv')

const lineshapes = require('./lib/loadLineshapes')
const listing = readCsv('../data/raw/sr5d-tnui.csv')

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

function errorHandler (err) {
  throw err
}

function assignAddressProperties (el) {
  let point = [el.Longitude, el.Latitude]
  return getProps(point)
}
