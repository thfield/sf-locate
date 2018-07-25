'use strict'
const readCsv = require('./lib/readCsv')
const sfZip = require('./lib/sfZip')
const addressParse = require('./lib/addressParse')
const midpoint = require('./lib/midpoint')
const d3 = require('d3-collection')
const nestedFind = require('./lib/nestedFind')

// TODO: name swap 'find' and 'search'
class Locator {
  // t is for testing (load smaller csv file, don't write files)
  constructor (t) {
    let inputFile = t ? './data/testAddresses.csv' : './data/addressesProcessed.csv'
    this.addresses = readCsv(inputFile)
    this.addresses = d3.nest()
      .key(function (d) { return d['street name'] })
      .entries(this.addresses)
    this.checkZipFirst = true
  }

  /** @function findOne - find an address
   * @param {object} address - an object representing an address
   * @param {string} address.zipcode - the zip code, 5 or 9 digit format
   * @param {string} address.address - the address, without apartment numbers ie '123 Sesame St'
   */
  findOne (address) {
    let self = this
    // check input has all required properties
    if (!address.zipcode) { return 'Has no zip code' }
    if (!address.address) { return 'Has no address' }
    if (address.address.length === 0) { return 'Has no address' }

    if (self.checkZipFirst) {
      // check for zip code to make sure it is in the city
      if (!sfZip(address)) { return 'Not an SF zip code' }
    }
    let res = self.searchAddress(address)
    if (res && res.hasOwnProperty('address') && address.id) { res.id = address.id }
    return res || 'Address not found'
  }

  /** @function searchAddress - search for address from the listing
   * @param {object} address - an object representing an address
   */
  searchAddress (address) {
    let self = this
    // use addressParse to standardize the address
    // TODO: should check to see if this step is necessary
    let addy = addressParse.standardize(address)

    // then match the normalized address to the listing of all addresses
    let street = nestedFind(self.addresses, addy.street)
    if (!street) {
      return null
    }
    let res = street.find(function (el) {
      return el.address === addy.address
    })

    if (res) {
      if (address.zipcode && res.zipcode.toString() !== address.zipcode.toString()) {
        return 'Zip Code and Address do not match'
      }
      return res
    }
    return null
  }

  /** @function searchByNeighbors - find info about an address by interpolating the neighbors
   * @param {object} address - an object representing an address
   */
  searchByNeighbors (address) {
    let self = this
    let neighbors = [self.findNextDoor(address, 'up'), self.findNextDoor(address, 'down')]
    if (neighbors.some(d => typeof d === 'string')) return 'Not locatable by neighboring addresses'

    let point = midpoint.obj(neighbors[0], neighbors[1])

    let addy = addressParse.normalString(address.address)
    let res = Object.assign({address:addy, zipcode: address.zipcode}, point)

    let props = [
      'assemdist',
      'bartdist',
      'congdist',
      'nhood',
      'prec_2010',
      'prec_2012',
      'supdist',
      'tractce10'
    ]

    let allsame = props.every(function (prop) {
      return neighbors[0][prop] === neighbors[1][prop]
    })
    if (allsame) {
      props.forEach(p => res[p] = neighbors[0][p])
    }
    if (address.id) { res.id = address.id }
    return res
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

  /** @function findNextDoor - find the neighboring address
   * @param {object} address - an object representing an address
   * @param {string} upDown - look up or down the street
   *
   */
  findNextDoor (address, upDown = 'up') {
    let self = this
    let addr = address
    if (!addr.number || !addr.street || !addr.type) {
      addr = addressParse.standardize(addr)
    }

    let res
    let i = 0
    do {
      // add or subtract 2 to the address number
      addr = addressParse.nextDoor(addr, upDown)
      res = self.searchAddress(addr)
      if (res) return res
      i++
    } while (i < 10)

    return 'Nextdoor address not found'
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
}

module.exports = Locator
