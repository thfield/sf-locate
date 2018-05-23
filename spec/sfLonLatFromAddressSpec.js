'use strict'
const sfLonLatFromAddress = require('../lib/sfLonLatFromAddress')
const readCsv = require('../lib/readCsv')
const listing = readCsv('./data/raw/sr5d-tnui.csv')

let inputs = [
  {
    address: '4400 Mission Street',
    zip: '94112',
    name: 'Excelsior',
    test: 'should work with a full address',
    expected: ['-122.43323226','37.72702233']
  },
  {
    address: '100 Larkin St',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation',
    expected: ['-122.41585885','37.77934463']
  },
  {
    address: '100 Larkin St.',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation and punctuation',
    expected: ['-122.41585885','37.77934463']
  },
  {
    address: '960 4th Street',
    zip: '94158',
    name: 'Mission Bay',
    test: 'should work with 4th Street in SF',
    expected: ['-122.39309738','37.77536973']
  },
  {
    address: '960 4th Street',
    zip: '94607',
    name: 'Somewhere in Oakland',
    test: 'should work with 4th Street not in SF',
    expected: [null, null]
  },
]

describe('sfLonLatFromAddress', function () {
  let res = inputs.map(function (el) {
    return sfLonLatFromAddress(el, listing)
  })

  res.forEach(function (r, i) {
    let wording = inputs[i].test
    it(wording, function () {
      expect(r).toEqual(inputs[i].expected)
    })
  })
})
