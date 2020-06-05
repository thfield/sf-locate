'use strict'
console.time('sf-locate munging time')

const fs = require('fs')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const sfProps = require('./lib/sfProps')
const lineshapes = require('./lib/loadLineshapes')

// add additional addresses with lat/lon and zip to file `additional-addresses.csv`
// run this script
// concat output with output of munge.js

let inputFile = './data/additional-addresses.csv'
let outputFile = './data/more-addresses.csv'

const input = fs.createReadStream(inputFile, { encoding: 'utf8' })
const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })

let counter = 0
let parser = parse({columns: true, delimiter: ','})
let transformer = transform(function (record, callback) {
  console.log(record.address, record.number)
  let res = assignAddressProperties(record)
  // delete unwanted properties here
  // console.log(res['address name'])
  callback(null, res)
  counter++
}, {parallel: 10})
let stringifier = stringify({header: true})

input
  .pipe(parser)
  .pipe(transformer)
  .pipe(stringifier)
  .pipe(output)
  .on('finish', () => {
    console.log(`${counter} records processed`)
    console.timeEnd('sf-locate munging time')
  })

function assignAddressProperties (el) {
  let point = [el.longitude, el.latitude]
  let props = sfProps(point, lineshapes)
  let res = Object.assign({
    'eas baseid': null,
    'cnn': null,
    'address': null,
    'zipcode': null,
    'longitude': null,
    'latitude': null,
    'assemdist': null,
    'bartdist': null,
    'congdist': null,
    'nhood': null,
    'prec_2010': null,
    'prec_2012': null,
    'supdist': null,
    'tractce10': null,
    'number': null,
    'number suffix': null,
    'street': null,
    'type': null,
  }, el, props)

  return res
}
