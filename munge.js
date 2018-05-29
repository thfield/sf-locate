'use strict'
// const Json2csvParser = require('json2csv').Parser
const fs = require('fs');
const Json2csvTransform = require('json2csv').Transform;
const readCsv = require('./lib/readCsv')
// const writeStringToFile = require('./lib/writeStringToFile')

const sfProps = require('./lib/sfProps')

const lineshapes = require('./lib/loadLineshapes')
// let eas = readCsv('./data/raw/sr5d-tnui.csv')
let inputFile = './data/test.csv'
let outputFile = './data/addressesWithProps.csv'

// try {
//   eas = eas.map(streamAddress)
// } catch (err) {
//   errorHandler(err)
// }
//
// function errorHandler (err) {
//   throw err
// }

function assignAddressProperties (el) {
  let point = [el.Longitude, el.Latitude]
  let props = sfProps(point, lineshapes)
  return Object.assign(el, props)
}

// function streamAddress (el) {
//   const fields = [
//     'Address',
//     'Address Number',
//     'Street Name',
//     'Street Type',
//     'Zipcode',
//     'Longitude',
//     'Latitude',
//     'assemdist',
//     'bartdist',
//     'congdist',
//     'nhood',
//     'prec_2010',
//     'prec_2012',
//     'supdist',
//     'tractce10'
//   ]
//   const opts = { fields }
//   const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' }
//
//   const input = fs.createReadStream(inputPath, { encoding: 'utf8' });
//   const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
//   const json2csv = new Json2csvTransform(opts, transformOpts);
//
//   const processor = input.pipe(json2csv).pipe(output);
//
//   // You can also listen for events on the conversion and see how the header or the lines are coming out.
//   json2csv
//     .on('header', header => console.log(header))
//     .on('line', line => console.log(line))
//     .on('error', err => console.log(err));
// }