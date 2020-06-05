'use strict'
const sfDupeStreets = require('../lib/sfDupeStreets')

let inputs = [
  {
    type: 'AVE',
    street: 'ANZA',
    test: 'should return the other for a street in the system',
    expected: ['ST']
  },
  {
    type: 'TER',
    street: 'GRAND VIEW',
    test: 'should return the other for a street in the system',
    expected: ['AVE']
  },
  {
    type: 'PL',
    street: 'SAINT FRANCIS',
    test: 'should return the other for a street in the system',
    expected: ['BLVD']
  },
  {
    type: 'AVE',
    street: 'PRESIDIO',
    test: 'should return two for a three-typed',
    expected: ['BLVD', 'TER']
  },
  {
    type: 'DR',
    street: 'YERBA BUENA',
    test: 'should return two for a three-typed',
    expected: ['AVE','LN','RD']
  },
  {
    type: 'ST',
    street: 'MARKET',
    test: 'should return false for a street without a duplicate name',
    expected: false
  },
  {
    type: undefined,
    street: 'BROADWAY',
    test: 'should return false for a street without a type',
    expected: false
  },
  {
    type: 'ST',
    street: 'GEARY',
    test: 'should work with geary',
    expected: ['BLVD']
  },
  {
    type: 'BLVD',
    street: 'GEARY',
    test: 'should work with geary',
    expected: ['ST']
  }
]

describe('sfDupeStreets', function () {
  let res = inputs.map(sfDupeStreets)
  res.forEach(function (r, i) {
    let wording = inputs[i].test
    it(wording, function () {
      expect(r).toEqual(inputs[i].expected)
    })
  })
})
