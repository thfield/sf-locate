'use strict'
const fs = require('fs')
const readCsv = require('./lib/readCsv')

class Locator {
  constructor () {
    this.inputFile = './data/test.csv'
    // this.inputFile = './data/addressesWithProps.csv'
    this.addresses = readCsv(this.inputFile)
  }

  worked () {
    console.log(this.addresses[0])
  }

  findAddress (address) {
    this.addresses.find()
  }
}

module.exports = Locator