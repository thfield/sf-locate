'use strict'
const readCsv = require('./lib/readCsv')
const sfZip = require('./lib/sfZip')
const addressParse = require('./lib/addressParse')

const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

class Locator {
  // t is for testing (load smaller csv file)
  constructor (t) {
    let inputFile = t ? './data/test.csv' : './data/addressesProcessed.csv'
    this.addresses = readCsv(inputFile)
    this.foo = 'asdf'
  }

  /** @function findOne
   * @param {object} address - an object representing an address
   * @param {string} address.zipcode - the zip code, 5 or 9 digit format
   * @param {string} address.address - the address, without apartment numbers ie '123 Sesame St'
   */
  findOne (address) {
    // check input has all required properties
    if (!address.zipcode) { return 'Has no zip code' }
    if (!address.address) { return 'Has no address' }
    if (address.address.length === 0) { return 'Has no address' }

    // check for zip code to make sure it is in the city
    if (!sfZip(address)) { return 'Not an SF zip code' }

    // use addressParse to normalize the address
    let addy = addressParse(address.address)
    let addresses = this.addresses
    // then match the normalized address to the listing of all addresses
    let res = addresses.find(function (el) {
      return el.address === addy && el.zipcode === address.zipcode
    })
    return res || 'Address not found'
  }

  /** @function findMany
   * @param {object[]} list - an array of addresses to find
   * @returns {array}
   */
  findMany (list) {
    let self = this
    let matched = list.map((el) => self.findOne(el))
    let unmatched = self.reconsileUnmatched(list, matched)
    return {result: matched, unmatched: unmatched}
  }

  /** @function reconsileUnmatched
   * @param {array} list - list of addresses
   * @param {array} matched - result of Array.map(findOne)
   * @returns {array} only contains unmatched original addresses
   */
  reconsileUnmatched (list, matched) {
    let unmatchedIndexes = []
    matched.forEach((d, i) => { if (typeof d === 'string') unmatchedIndexes.push([d, i]) })
    return unmatchedIndexes.map(d => {
      list[d[1]].reason = d[0]
      return list[d[1]]
    })
  }

  /** @function csvList
   * @param {string} inputFile - path to csv
   */
  csvList (inputFile) {
    let basePath = path.dirname(inputFile)
    let baseFileName = path.basename(inputFile, '.csv')
    let outputFile = `${basePath}/${baseFileName}-output.csv`

    const unmatchedFile = `${basePath}/${baseFileName}-unmatched.csv`
    let input

    try {
      input = fs.createReadStream(inputFile, { encoding: 'utf8' })
    } catch (err) {
      return new Error(`specified file ${inputFile} does not exist`)
    }

    const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })
    const unmatched = fs.createWriteStream(unmatchedFile, { encoding: 'utf8' })

    let parser = parse({columns: true, delimiter: ','})
    let transformer = transform(function (record, callback) {
      let res = fn(record)
      callback(null, res)
    }, {parallel: 10})
    let stringifier = stringify({header: true})

    input
      .pipe(parser)
      .pipe(transformer)
      .pipe(stringifier)
      .pipe(output)
      .on('finish', () => {
        console.log(`saved to ${outputFile}`)
      })
  }
}

module.exports = Locator
