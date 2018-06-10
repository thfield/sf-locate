'use strict'

let validZips = [
  94102,
  94103,
  94104,
  94105,
  94107,
  94108,
  94109,
  94110,
  94111,
  94112,
  94114,
  94115,
  94116,
  94117,
  94118,
  94119,
  94120,
  94121,
  94122,
  94123,
  94124,
  94125,
  94126,
  94127,
  94128,
  94129,
  94130,
  94131,
  94132,
  94133,
  94134,
  94137,
  94139,
  94140,
  94141,
  94142,
  94143,
  94144,
  94145,
  94146,
  94147,
  94151,
  94158,
  94159,
  94160,
  94161,
  94163,
  94164,
  94172,
  94177,
  94188,
]

/**
 * @param {object} input address object with property "zipcode"
 * @returns {boolean} true if input is one of the valid san francisco zipcode codes
 */
module.exports = function (input) {
  let res = Object.assign({}, input)
  // check if format is zipcode+4
  if (/\d{5}[- ]\d{4}/.test(res.zipcode)) {
    res.zipcode = res.zipcode.slice(0, 5)
  }
  // check if format is 9-digit zipcode
  if (/\d{9}/.test(res.zipcode)) {
    res.zipcode = res.zipcode.slice(0, 5)
  }
  res.zipcode = +res.zipcode
  return validZips.includes(res.zipcode)
}
