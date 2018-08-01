'use strict'
const readCsv = require('./lib/readCsv')
const sfZip = require('./lib/sfZip')
const addressParse = require('./lib/addressParse')
const midpoint = require('./lib/midpoint')
const d3 = require('d3-collection')
const nestedFind = require('./lib/nestedFind')

// TODO: name swap 'find' and 'search'
// TODO: throw errors instead of returning null

class Locator {
  // t is for testing (load smaller csv file, don't write files)
  constructor (t) {
    let inputFile = t ? './spec/testAddresses.csv' : './data/addressesProcessed.csv'
    this.addresses = readCsv(inputFile)
    // TODO: use a nested object alter nestedFind to detect type
    this.addresses = d3.nest()
      .key(function (d) { return d['street'] })
      .entries(this.addresses)
  }

  /** @function findOne - find an address
   * @param {object} address - an object representing an address
   * @param {string} address.number - the address number
   * @param {string} address.street - the address street name
   * @param {string} address.type - the address type
   * @param {string} address.zipcode - the zip code, 5 or 9 digit format
   * @param {object} options
   * @param {boolean} options.ignoreZip - ignore the zipcode when checking
   * @param {boolean} options.ignoreSFZip - don't check to see if zip is within SF
   * @param {boolean} options.ignoreZipMismatch - ignore if the zipcode doesn't match address
   */
  findOne (address, options = {}) {
    // findOne should just take objects and throw an error if input doesn't meet min requirements
    // min requirements:
    //   number
    //   street
    //   type
    //   zipcode
    // overridden by:
    //   ignoreZip
    //   ignoreStreetType

    let self = this

    if (address.zip) { address.zipcode = address.zip }

    // // check input has all required properties
    if (!address.number || !address.street) { throw new Error('Not enough address info') }

    if (options.ignoreStreetType !== true) {
      if (!address.type) { throw new Error ('Not enough address info') }
    }

    if (options.ignoreZip !== true) {
      if (!address.zipcode) { throw new Error ('Has no zip code') }
    }
    if (options.ignoreSFZip !== true && options.ignoreZip !== true) {
      // check for zip code to make sure it is in the city
      if (!sfZip(address)) { throw new Error('Not an SF zip code') }
    }

    let res = self.searchAddress(address, options)

    if (res.message === 'Address not found method searchAddress') {
      return new Error('Address not found')
    }

    if (res.hasOwnProperty('address') && address.id) { res.id = address.id }

    // report how match was made
    let ignored = Object.keys(options).filter(k => options[k] === true)

    if ( ignored.length > 0 ) {
      ignored = ignored.join(', ').replace(/ignore/g, '')
      res.method = `match ignored ${ignored}`
    } else {
      res.method = 'direct match with EAS listing'
    }


    return res
  }

  /** @function searchAddress - search for address from the listing
   * @param {object} address - an object representing an address
   * @param {object} options
   * @param {boolean} options.ignoreZipMismatch - ignore if the zipcode doesn't match address
   * @param {boolean} options.ignoreStreetType - ignore if the address doesn't have a type (st, ave, rd, etc)
   */
  searchAddress (address, options = {}) {
    let self = this
    // use addressParse to standardize the address

    // then match the normalized address to the listing of all addresses
    let street = nestedFind(self.addresses, address.street)
    if (!street) {
      throw new Error('Street not in listing')
    }
    let res = street.find(function (el) {
      if (options.ignoreStreetType === true) {
        return (el['number'] === address.number &&
          el['street'] === address.street)
      } else {
        return (el['number'] === address.number &&
          el['street'] === address.street &&
          el['type'] === address.type
        )
      }
    })

    if (res) {
      if (options.ignoreZipMismatch !== true && options.ignoreZip !== true) {
        if (address.zipcode && res.zipcode.toString() !== address.zipcode.toString()) {
          throw new Error('Zip Code and Address do not match')
        }
      }
      return res
    }
    return new Error('Address not found method searchAddress')
  }

  /** @function searchByNeighbors - find info about an address by interpolating the neighbors
   * @param {object} address - an object representing an address
   */
  searchByNeighbors (address) {
    let self = this
    let neighbors = [self.findNextDoor(address, 'up'), self.findNextDoor(address, 'down')]

    if (neighbors.some(d => d instanceof Error)) throw new Error('Not locatable by neighboring addresses')

    let point = midpoint.obj(neighbors[0], neighbors[1])

    // let addy = addressParse.normalString(address.address)
    let res = Object.assign({}, address, {zipcode: address.zipcode}, point)

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
    // if (address.id) { res.id = address.id }
    res.method = `match by neighboring interpolation`
    return res
  }

  // /** @function findMany
  //  * @param {object[]} list - an array of addresses to find
  //  * @returns {array}
  //  */
  // findMany (list) {
  //   let self = this
  //   let matched = list.map((el) => self.findOne(el))
  //   let unmatched = self.reconsileUnmatched(list, matched)
  //   return {result: matched, unmatched: unmatched}
  // }

  /** @function findNextDoor - find the neighboring address
   * @param {object} address - an object representing an address
   * @param {string} upDown - look up or down the street
   *
   */
  findNextDoor (address, upDown = 'up') {
    let self = this
    let addr = address
    if (!addr.number || !addr.street || !addr.type) {
      return new Error('cannot find next door without an address object')
      // addr = addressParse.standardize(addr)
    }

    let res
    let i = 0
    do {
      // add or subtract 2 to the address number
      addr = addressParse.nextDoor(addr, upDown)
      res = self.searchAddress(addr)

      if (res instanceof Error) { i++ }
      else { return res }
    } while (i < 10)

    return new Error('Nextdoor address not found')
  }

  // /** @function reconsileUnmatched
  //  * @param {array} list - list of addresses
  //  * @param {array} matched - result of Array.map(findOne)
  //  * @returns {array} only contains unmatched original addresses
  //  */
  // reconsileUnmatched (list, matched) {
  //   let unmatchedIndexes = []
  //   matched.forEach((d, i) => { if (typeof d === 'string') unmatchedIndexes.push([d, i]) })
  //   return unmatchedIndexes.map(d => {
  //     list[d[1]].reason = d[0]
  //     return list[d[1]]
  //   })
  // }
}

module.exports = Locator
