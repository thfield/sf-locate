'use strict'
const sfZip = require('../lib/sfZip')

let inputs = [
  {
    zipcode: '94112',
    name: 'Excelsior',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    zipcode: 94112,
    name: 'Excelsior',
    test: 'should return true with a number as ZIP',
    expected: true
  },
  {
    zipcode: '94102',
    name: 'Main Library',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    zipcode: '94102',
    name: 'Main Library',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    zipcode: '94158',
    name: 'Mission Bay',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    zipcode: '94607',
    name: 'Somewhere in Oakland',
    test: 'should return false for an oakland zip',
    expected: false
  },
  {
    zipcode: 'abc',
    name: 'not a zip code',
    test: 'should return false for somethign that is not a zip',
    expected: false
  },
  {
    zipcode: '94612-1932',
    name: 'Oakland City Hall',
    test: 'should return false for a non SF zip+4',
    expected: false
  },
  {
    zipcode: '94112-1927',
    name: 'Excelsior',
    test: 'should return true for an SF zip+4',
    expected: true
  },
  {
    zipcode: '941121927',
    name: 'Excelsior',
    test: 'should return true for an SF zip+4 with no separator',
    expected: true
  },
  {
    zipcode: '  94112',
    name: 'Excelsior',
    test: 'should strip leading spaces from a zip code string',
    expected: true
  },
  {
    zipcode: '94112 ',
    name: 'Excelsior',
    test: 'should strip trailing spaces from a zip code string',
    expected: true
  }
]

describe('sfZip', function () {
  let res = inputs.map(sfZip)
  res.forEach(function (r, i) {
    let wording = inputs[i].test
    it(wording, function () {
      expect(r).toEqual(inputs[i].expected)
    })
  })
})
