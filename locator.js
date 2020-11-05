'use strict'
// const d3 = require('d3-collection')
const sqlite3 = require('sqlite3')

// const readCsv = require('./lib/readCsv')
const sfZip = require('./lib/sfZip')
const sfDupeStreets = require('./lib/sfDupeStreets')
const addressParse = require('./lib/addressParse')
const midpoint = require('./lib/midpoint')
// const nestedFind = require('./lib/nestedFind')


// TODO: name swap 'find' and 'search'
// TODO: throw errors instead of returning null
// TODO: option to replace entered zipcode with zip matching address

class Locator {
  constructor () {
    this.db = new sqlite3.Database('./data/sf.sqlite', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err)
      }
      console.log('Connected to the database.')
    });
  }

  close() {
    let self = this
    self.db.close()
    console.log('Closed database connection.')
  }

  get(sql, params = []) {
    let self = this
    return new Promise((resolve, reject) => {
      self.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /** @function findOne - find an address
   * @param {object} address - an object representing an address
   * @param {string} address.number - the address number
   * @param {string} address.street - the address street name
   * @param {string} address.type - the address type
   * @param {string} address.zipcode - the zip code, 5 or 9 digit format
   * @param {object} options - dictionary of booleans
   * @param {boolean} options.ignoreZip - ignore the zipcode when checking
   * @param {boolean} options.ignoreSFZip - don't check to see if zip is within SF
   * @param {boolean} options.ignoreZipMismatch - ignore if the zipcode doesn't match address
   * @param {boolean} options.replaceZipMismatch - replace entered zipcode with zip of matching address
   * @param {boolean} options.ignoreStreetType - ignore if the address doesn't have a type (st, ave, rd, etc)
   * @param {boolean} options.tryOtherType - see if the street could have another type (st, ave, rd, etc) and use it
   */
  async findOne (address, options = {}) {
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

    let res =  await self.searchAddress(address, options)
      .catch((err)=>{
        throw err
      })

    if (res.message === 'Address not found method searchAddress') {
      throw new Error('Address not found')
    }

    if (res.hasOwnProperty('address') && address.id) { res.id = address.id }

    // report how match was made
    let ignored = Object.keys(options).filter(k => options[k] === true)

    if ( ignored.length > 0 ) {
      ignored = ignored.join(', ')
      res.method = `match used ${ignored}`
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
   * @param {boolean} options.tryOtherType - see if the street could have another type (st, ave, rd, etc)
   */
  async searchAddress (address, options = {}) {
    let self = this
    // use addressParse to standardize the address

    if (options.tryOtherType === true) {
      let otherTypes = sfDupeStreets(address)
      if (otherTypes && otherTypes.length === 1) {
        address.type = otherTypes[0]
      }
    }

    // then match the normalized address to the listing of all addresses
    // let street = nestedFind(self.addresses, address.street)
    let street = await self.get('SELECT street from sanfrancisco where street = ?', [address.street])
    if (!street) {
      throw new Error('Street not in listing')
    }
    let sql
    let params
    if (options.ignoreStreetType === true) {
      sql = 'SELECT * FROM sanfrancisco WHERE street = ? AND number = ? '
      params = [address.street, address.number]
    } else {
      sql = 'SELECT * FROM sanfrancisco WHERE street = ? AND number = ? AND type = ?'
      params = [address.street, address.number, address.type]
    }
    let res = await self.get(sql, params)

    if (res) {
      if (options.ignoreZipMismatch !== true && options.ignoreZip !== true) {
        if (address.zipcode && res.zipcode.toString() !== address.zipcode.toString()) {
          throw new Error('Zip Code and Address do not match')
        }
      } else {
        res.originalZip = address.zipcode
      }
      return res
    }
    return new Error('Address not found method searchAddress')
  }

  /** @function searchByNeighbors - find info about an address by interpolating the neighbors
   * @param {object} address - an object representing an address
   * @param {object} options - options
   * @param {boolean} options.interpolate - search by interpolation
   * @param {boolean} options.nextDoor - match to a "next door" address
   */
  async searchByNeighbors (address, options = {}) {
    let self = this
    let res = {}
    let neighbors
    try {
      neighbors = [
        await self.findNextDoor(address, 'up', options), 
        await self.findNextDoor(address, 'down', options)
      ]
    } catch (error) {
      throw new Error('Not locatable by neighboring addresses')
    }
    
    if (options.nextDoor) {
      console.log('inside nextDoor')
      if (neighbors.some(d => d.hasOwnProperty('address'))) {
        let located = neighbors.find(d => d.hasOwnProperty('address'))
        res = Object.assign({}, located, address)
        res.method = `match by neighbor address`
      } else {
        console.log('haskjdhf')
      }
    } else {
      if (neighbors.some(d => d instanceof Error)) {
        throw new Error('Not locatable by neighboring addresses')
      }
      let point = midpoint.obj(neighbors[0], neighbors[1])
      res = Object.assign({}, address, point)

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
      res.method = `match by neighboring interpolation`
    }
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
   * @param {object} options - options object passed from searchByNeighbors call
   * @param {boolean} options.ignoreZipMismatch - ignore if the zipcode doesn't match address
   * @param {boolean} options.ignoreStreetType - ignore if the address doesn't have a type (st, ave, rd, etc)
   *
   */
  async findNextDoor (address, upDown = 'up', options = {}) {
    let self = this
    let addr = address
    if (!addr.number || !addr.street || !addr.type) {
      if (options.ignoreStreetType) {
        if (!addr.number || !addr.street) {
          throw new Error('cannot find next door without an address object')
        } 
      } else {
        throw new Error('cannot find next door without an address object')
      }
    }

    let res
    let i = 0
  
    let max = 4
    do {
      // add or subtract 2 to the address number
      addr = addressParse.NeighborSearch.nextDoor(addr, upDown)
      res = await self.searchAddress(addr, options)

      if (res instanceof Error) { i++ }
      else { return res }
    } while (i < max)

    throw new Error('Nextdoor address not found')
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
