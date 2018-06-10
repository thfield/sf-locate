'use strict'

const Locator = require('../locator.js')
let SFLocator = new Locator(true)

let inputs = [
  {
    input: {address: '527 4th ave', zip: '94118'},
    description: 'a non-zeropadded numbered "ave" address',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '527 4th avenue', zip: '94118'},
    description: 'a non-zeropadded numbered, non-abbreviated "avenue" address',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '2101 Baker Street', zip: '94115'},
    description: 'a "street" address',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 baker street', zip: '94115'},
    description: 'an all lowercase address',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 Baker Street'},
    description: 'a valid address without zipcode',
    expected: 'noZip'
  },
  {
    input: {address: '2101 Baker St.', zip: '94115'},
    description: 'a valid address without a period after abbreviation',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '5000 Geary Boulevard', zip: '94118'},
    description: 'a non-abbreviated "boulevard" address',
    expected: '5000 GEARY BLVD'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '94131'},
    description: 'a non-abbreviated "drive" address',
    expected: '26 PORTOLA DR'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '94118'},
    description: 'an mismatched zip code/address',
    expected: 'unmatched'
  },
  {
    input: {address: '', zip: '94118'},
    description: 'a zip inside SF but no address',
    expected: 'noAddress'
  },
  {
    input: {address: '', zip: '12345'},
    description: 'a zip outside SF with no address',
    expected: 'noAddress'
  },
  {
    input: {address: '123 Doesnotexist Street', zip: '94118'},
    description: 'a non-existing street with zip inside SF',
    expected: 'unmatched'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zip: '12345'},
    description: 'an address inside SF with zip outside SF',
    expected: 'outsideSF'
  },
  {
    input: {foo: 'asdf'},
    description: 'a nonsense input',
    expected: 'noZip'
  }


]

let expecteds = {
  noZip: 'Has no zip code',
  noAddress: 'Has no address',
  outsideSF: 'Not an SF zip code',
  unmatched: 'Address not found',
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

describe('locate.findOne', function () {
  let res = inputs.map(function (el) {
    return SFLocator.findOne(el.input)
  })

  res.forEach(function (r, i) {
    it('with '.concat(inputs[i].description), function () {
      if (typeof r === 'object') {
        expect(r).toEqual(jasmine.objectContaining(expecteds[inputs[i].expected]))
      } else if (typeof r === 'string') {
        expect(r).toEqual(expecteds[inputs[i].expected])
      }
    })
  })
})

let several = [
  {address: '527 4th ave', zip: '94118'},
  {address: '2101 Baker Street', zip: '94115'},
  {address: '5000 Geary Boulevard', zip: '94118'}
]

describe('locate.findMany', function () {
  it('should return an array of found addresses when passed an array of valid addresses', function () {
    let res = SFLocator.findMany(several)
    expect(res.result).toEqual([
      jasmine.objectContaining(expecteds['527 04TH AVE']),
      jasmine.objectContaining(expecteds['2101 BAKER ST']),
      jasmine.objectContaining(expecteds['5000 GEARY BLVD'])
    ])
  })

  it('should return an array of found and not found addresses', function () {
    let severalMore = [{address: '123 Doesnotexist Street', zip: '94118'}].concat(several)
    let res = SFLocator.findMany(severalMore)
    expect(res.result).toEqual([
      expecteds.unmatched,
      jasmine.objectContaining(expecteds['527 04TH AVE']),
      jasmine.objectContaining(expecteds['2101 BAKER ST']),
      jasmine.objectContaining(expecteds['5000 GEARY BLVD'])
    ])
  })

  it('should return an array of addresses that did not match', function () {
    let unmatching = [{address: '123 Doesnotexist Street', zip: '94118'}]
    let severalMore = unmatching.concat(several)
    let res = SFLocator.findMany(severalMore)
    expect(res.unmatched).toEqual(unmatching)
  })

  it('should return an array of addresses that did not match and why', function () {
    let unmatching = [
      {address: '123 Doesnotexist Street', zip: '94118'},
      {address: '123 OutsideSF Street', zip: '12345'},
      {foo: 'asdf'}
    ]
    let expected = [
      {address: '123 Doesnotexist Street', zip: '94118', reason: expecteds.unmatched},
      {address: '123 OutsideSF Street', zip: '12345', reason: expecteds.outsideSF},
      {foo: 'asdf', reason: expecteds.noZip}
    ]
    let severalMore = unmatching.concat(several)

    let res = SFLocator.findMany(severalMore)
    expect(res.unmatched).toEqual(expected)
  })
})

describe('locate.reconsileUnmatched', function () {
  it('should return addresses "inside SF" that didnt match', function () {
    let unmatchingAddress = {address: '123 Doesnotexist Street', zip: '94118'}
    let list = [unmatchingAddress].concat(several)
    let matched = [expecteds.unmatched, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
    let expected = [unmatchingAddress]
    let res = SFLocator.reconsileUnmatched(list, matched)

    expect(res).toEqual(expected)
  })
  it('should return addresses "outside SF" that didnt match', function () {
    let unmatchingAddress = {address: '123 OutsideSF Street', zip: '12345'}
    let list = [unmatchingAddress].concat(several)
    let matched = [expecteds.outsideSF, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
    let expected = [unmatchingAddress]
    let res = SFLocator.reconsileUnmatched(list, matched)

    expect(res).toEqual(expected)
  })
})
