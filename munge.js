'use strict'
console.time('sf-locate munging time')

const fs = require('fs')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const sfProps = require('./lib/sfProps')
const lineshapes = require('./lib/loadLineshapes')

// let inputFile = './data/test.csv'
let inputFile = './data/raw/sr5d-tnui.csv'
let outputFile = './data/addressesProcessed.csv'

const input = fs.createReadStream(inputFile, { encoding: 'utf8' })
const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })

// const fields = [
//   'address',
//   'address number',
//   'street name',
//   'street type',
//   'zipcode',
//   'longitude',
//   'latitude',
//   'assemdist',
//   'bartdist',
//   'congdist',
//   'nhood',
//   'prec_2010',
//   'prec_2012',
//   'supdist',
//   'tractce10'
// ]

let counter = 0
let parser = parse({columns: true, delimiter: ','})
let transformer = transform(function (record, callback) {
  // skip if record['street name'] === 'UNKNOWN'
  let res = assignAddressProperties(record)
  // delete unwanted properties here
  res.number = res['address number']
  res['number suffix'] = res['address number suffix']
  res.street = res['street name']
  res.type = res['street type']
  delete res['address number']
  delete res['address number suffix']
  delete res['street name']
  delete res['street type']
  delete res.location

  callback(null, res)
  counter++
}, {parallel: 100})
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
  return Object.assign({}, el, props)
}
