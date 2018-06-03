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
let outputFile = './data/addressesWithProps.csv'

const input = fs.createReadStream(inputFile, { encoding: 'utf8' })
const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })

let counter = 0
let parser = parse({columns: true, delimiter: ','})
let transformer = transform(function (record, callback) {
  let res = assignAddressProperties(record)
  // delete unwanted properties here
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
  let point = [el.Longitude, el.Latitude]
  let props = sfProps(point, lineshapes)
  return Object.assign(el, props)
}
