'use strict'

const Locator = require('../index.js')
let SFLocator = new Locator()

let inputs = [
  {
    input: {address: '527 4th ave', zip: '94118'},
    test: 'should work with a non-zeropadded numbered "ave" address',
    method: 'findOne',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '527 4th avenue', zip: '94118'},
    test: 'should work with a non-zeropadded numbered, non-abbreviated "avenue" address',
    method: 'findOne',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '2101 Baker Street', zip: '94115'},
    test: 'should work with a "street" address',
    method: 'findOne',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 baker street', zip: '94115'},
    test: 'capitalization should not matter',
    method: 'findOne',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 Baker Street'},
    test: 'should not work without a zip code',
    method: 'findOne',
    expected: null
  },
  {
    input: {address: '2101 Baker St.', zip: '94115'},
    test: 'should work without a period after abbreviation',
    method: 'findOne',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '5000 Geary Boulevard', zip: '94118'},
    test: 'should work a non-abbreviated "boulevard" address',
    method: 'findOne',
    expected: '5000 GEARY BLVD'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '94131'},
    test: 'should work a non-abbreviated "drive" address',
    method: 'findOne',
    expected: '26 PORTOLA DRIVE'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '94118'},
    test: 'should not work a mismatched zip code address',
    method: 'findOne',
    expected: null
  },
  {
    input: {address: '', zip: '94118'},
    test: 'should not work without an address',
    method: 'findOne',
    expected: null
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '94118'},
    test: 'should not work a mismatched zip code address',
    method: 'findOne',
    expected: null
  }
]

let expecteds = {
  '527 04TH AVE': {
    Address: '527 04TH AVE',
    Zipcode: '94118',
    Longitude: '-122.46229088',
    Latitude: '37.77862614',
    assemdist: '19',
    bartdist: '8',
    congdist: '12',
    nhood: 'Inner Richmond',
    prec_2010: '2131',
    prec_2012: '9132',
    supdist: '1',
    tractce10: '045100'
  },
  '2101 BAKER ST': {
    Address: '2101 BAKER ST',
    Zipcode: '94115',
    Longitude: '-122.44456085',
    Latitude: '37.79053179',
    assemdist: '19',
    bartdist: '8',
    congdist: '12',
    nhood: 'Pacific Heights',
    prec_2010: '2209',
    prec_2012: '9236',
    supdist: '2',
    tractce10: '013400'
  },
  '5000 GEARY BLVD': {
    Address: '5000 GEARY BLVD',
    Zipcode: '94118',
    Longitude: '-122.47316088',
    Latitude: '37.78085651',
    assemdist: '19',
    bartdist: '8',
    congdist: '12',
    nhood: 'Outer Richmond',
    prec_2010: '2111',
    prec_2012: '9109',
    supdist: '1',
    tractce10: '042602'
  },
  '26 PORTOLA DR': {
    Address: '26 PORTOLA DR',
    Zipcode: '94131',
    Longitude: '-122.44398743',
    Latitude: '37.75012393',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Twin Peaks',
    prec_2010: '3836',
    prec_2012: '7836',
    supdist: '8',
    tractce10: '020402'
  }
}

describe('locator', function () {
  let res = inputs.map(function (el) {
    return Locator[el.method](el.input)
  })

  res.forEach(function (r, i) {
    it(inputs[i].test, function () {
      expect(r).toEqual(jasmine.objectContaining(expecteds[inputs[i].expected)])
    })
  })
})
