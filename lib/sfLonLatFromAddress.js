'use strict'
const sfZip = require('./sfZip')
const addressParse = require('./addressParse')

/** @function sfLonLatFromAddress
 * @param {object} address - values must include 'address' & 'zip'
 * @param {object} listing - list of city addresses from datasf, JSON.parse'd -- lookup table
 * @returns {array} [lon, lat] of address
 */
module.exports = function (address, listing) {

  let errorRes = assignLonLatProps(address, [null, null])

  // check zipcode
  let zipcheck = sfZip(address)
  if (zipcheck === false) { return errorRes }

  // parse address
  let addy = addressParse.normalString(address.address)
  if (addy === null) { return errorRes }

  // lookup address in listing
  let res = listing.find(function (el) {
    return el.address === addy
  })
  if (res === undefined) { return errorRes }

  // return [lon, lat] from listing
  return assignLonLatProps(address, [res.longitude, res.latitude])
}

function assignLonLatProps (address, point) {
  return Object.assign({lon: point[0], lat: point[1]}, address)
}