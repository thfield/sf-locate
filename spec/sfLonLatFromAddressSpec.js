'use strict'
const sfLonLatFromAddress = require('../lib/sfLonLatFromAddress')
const readCsv = require('../lib/readCsv')
const listing = readCsv('./data/raw/sr5d-tnui.csv')

let inputs = [
  {
    address: '4400 Mission Street',
    zip: '94112',
    name: 'Excelsior',
    test: 'should work with a full address'
  },
  {
    address: '100 Larkin St',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation'
  },
  {
    address: '100 Larkin St.',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation and punctuation'
  },
  {
    address: '960 4th Street',
    zip: '94158',
    name: 'Mission Bay',
    test: 'should work with 4th Street in SF'
  },
  {
    address: '960 4th Street',
    zip: '94607',
    name: 'Somewhere in Oakland',
    test: 'should return something for a street not in SF'
  }
]
let expected = [
  {
    address: '4400 Mission Street',
    zip: '94112',
    name: 'Excelsior',
    test: 'should work with a full address',
    lon: '-122.43323226',
    lat: '37.72702233'
  }, {
    address: '100 Larkin St',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation',
    lon: '-122.41585885',
    lat: '37.77934463'
  }, {
    address: '100 Larkin St.',
    zip: '94102',
    name: 'Main Library',
    test: 'should work with an abbreviation and punctuation',
    lon: '-122.41585885',
    lat: '37.77934463'
  }, {
    address: '960 4th Street',
    zip: '94158',
    name: 'Mission Bay',
    test: 'should work with 4th Street in SF',
    lon: '-122.39309738',
    lat: '37.77536973'
  }, {
    address: '960 4th Street',
    zip: '94607',
    name: 'Somewhere in Oakland',
    test: 'should return something for a street not in SF',
    lon: null,
    lat: null
  }
]

describe('sfLonLatFromAddress', function () {
  let res = inputs.map(function (el) {
    return sfLonLatFromAddress(el, listing)
  })

  res.forEach(function (r, i) {
    let wording = inputs[i].test
    it(wording, function () {
      expect(r).toEqual(expected[i])
    })
  })
})
