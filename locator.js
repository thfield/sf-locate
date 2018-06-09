'use strict'
// const fs = require('fs')
const readCsv = require('./lib/readCsv')
const sfZip = require('./lib/sfZip')
const addressParse = require('./lib/addressParse')

class Locator {
  constructor () {
    this.inputFile = './data/addressesProcessed.csv'
    this.addresses = readCsv(this.inputFile)
  }

  worked () {
    console.log(this.addresses[0])
  }

  /** @function findAddress
   * @param {object} address - an object representing an address
   * @param {string} address.zip - the zip code, 5 or 9 digit format
   * @param {string} address.address - the address, without apartment numbers ie '123 Sesame St'
   */
  findAddress (address) {
    // first check for zip code to make sure it is in the city
    if (!sfZip(address)) { return 'Not an SF Zip code' }
    // then use addressParse to normalize the address
    let addy = addressParse(address.address)
    // then match the normalized address to the listing of all addresses
    let res = this.addresses.find(function (el) {
      return el.Address === addy
    })
    return res || null
  }

}

module.exports = Locator