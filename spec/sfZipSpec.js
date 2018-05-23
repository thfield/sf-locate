'use strict'
const sfZip = require('../lib/sfZip')

let inputs = [{
    address: '4400 Mission Street',
    zip: '94112',
    name: 'Excelsior',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    address: '4400 Mission Street',
    zip: 94112,
    name: 'Excelsior',
    test: 'should return true with a number as ZIP',
    expected: true
  },
  {
    address: '100 Larkin St',
    zip: '94102',
    name: 'Main Library',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    address: '100 Larkin St.',
    zip: '94102',
    name: 'Main Library',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    address: '960 4th Street',
    zip: '94158',
    name: 'Mission Bay',
    test: 'should return true for an SF zip code',
    expected: true
  },
  {
    address: '960 4th Street',
    zip: '94607',
    name: 'Somewhere in Oakland',
    test: 'should return false for an oakland zip',
    expected: false
  },
  {
    address: '123 Main St',
    zip: 'abc',
    name: 'not a zip code',
    test: 'should return false for somethign that is not a zip',
    expected: false
  },
  {
    address: '1 FRANK H OGAWA PLAZA',
    zip: '94612-1932',
    name: 'Oakland City Hall',
    test: 'should return false for a non SF zip+4',
    expected: false
  },
  {
    address: '4400 Mission Street',
    zip: '94112-1927',
    name: 'Excelsior',
    test: 'should return true for an SF zip+4',
    expected: true
  },
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
