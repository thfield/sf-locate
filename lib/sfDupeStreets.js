'use strict'

let sameStreetnameDifferentType = {
  'ANZA': ['AVE', 'ST'],
  'APPLETON': ['AVE', 'ST'],
  'ASHBURY': ['ST', 'TER'],
  'BAKER': ['CT', 'ST'],
  'BUENA VISTA': ['AVE', 'TER'],
  'CALIFORNIA': ['AVE', 'ST'],
  'CLIPPER': ['ST', 'TER'],
  'COLLEGE': ['AVE', 'TER'],
  'DAVIS': ['CT', 'ST'],
  'DOLORES': ['ST', 'TER'],
  'FUNSTON': ['AVE', 'RD'],
  'GATEVIEW': ['AVE', 'CT'],
  'GEARY': ['BLVD', 'ST'],
  'GIRARD': ['RD', 'ST'],
  'GRAND VIEW': ['AVE', 'TER'],
  'HARDIE': ['AVE', 'PL'],
  'HOFFMAN': ['AVE', 'ST'],
  'INNES': ['AVE', 'CT'],
  'JENNINGS': ['CT', 'ST'],
  'KEYES': ['ALY', 'AVE'],
  'LE CONTE': ['AVE', 'CIR'],
  'LUNADO': ['CT', 'WAY'],
  'MASON': ['CT', 'ST'],
  'MERCHANT': ['RD', 'ST'],
  'MESA': ['AVE', 'ST'],
  'MINT': ['PLZ', 'ST'],
  'MONETA': ['CT', 'WAY'],
  'MORAGA': ['AVE', 'ST'],
  'ORD': ['CT', 'ST'],
  'PARK': ['BLVD', 'ST'],
  'POPE': ['RD', 'ST'],
  'PORTOLA': ['DR', 'ST'],
  'RALSTON': ['AVE', 'ST'],
  'RIDGE': ['CT', 'LN'],
  'SAINT FRANCIS': ['BLVD', 'PL'],
  'SCOTT': ['ALY', 'ST'],
  'SHERIDAN': ['AVE', 'ST'],
  'SPEAR': ['AVE', 'ST'],
  'STANYAN': ['BLVD', 'ST'],
  'SUMMIT': ['ST', 'WAY'],
  'SUMNER': ['AVE', 'ST'],
  'TALBERT': ['CT', 'ST'],
  'TAYLOR': ['RD', 'ST'],
  'TREAT': ['AVE', 'WAY'],
  'TURK': ['BLVD', 'ST'],
  'WASHINGTON': ['BLVD', 'ST'],
  'WOOL': ['CT', 'ST'],
  'WRIGHT': ['LOOP', 'ST'],
  'YOUNG': ['CT', 'ST'],
  'PRESIDIO': ['AVE', 'BLVD', 'TER'],
  'CRESCENT': ['AVE','CT','WAY'],
  'LINCOLN': ['BLVD','CT','WAY'],
  'YERBA BUENA': ['AVE','DR','LN','RD']
}

/**
 * @param {object} input address object
 * @param {object} input.street streetname e.g. "MAIN", "MARKET"
 * @param {object} input.type streettype e.g. "ST", "AVE"
 * @returns {string | boolean} other street type or false
 */
module.exports = function (input) {
  if (!sameStreetnameDifferentType[input.street]) {
    return false
  }
  let res = sameStreetnameDifferentType[input.street]
  let i = res.indexOf(input.type)
  if (i < 0) {
    res = new Error('weird problem with sfDupeStreets')
  } else {
    res = res.slice(0,res.length)
    res.splice(i,1)
  }
  return res
}
