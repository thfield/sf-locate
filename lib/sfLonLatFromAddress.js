'use strict'
const sfZip = require('./sfZip')
const addressParse = require('./addressParse')

/**
 * @param {object} address - values must include 'address' & 'zip'
 * @param {object} listing - list of city addresses from datasf, JSON.parse'd -- lookup table
 * @returns {array} [lon, lat] of address
 */
module.exports = function (address, listing) {
  let errorRes = [null, null]

  // check zipcode
  let zipcheck = sfZip(address)
  if (zipcheck === false) { return errorRes }

  // parse address
  address.address = addressParse(address.address)
  if (address.address === null) { return errorRes }

  // lookup address in listing
  let res = listing.find(function (el) {
    return el.Address === address.address
  })
  if (res === undefined) { return errorRes }

  // return [lon, lat] from listing
  return [res.Longitude, res.Latitude]
}
