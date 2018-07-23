'use strict'

const Locator = require('../locator.js')
let SFLocator = new Locator(true) // pass true in constructor for "testing mode"

let inputs = [
  {
    input: {address: '527 4th ave', zipcode: '94118'},
    description: 'a non-zeropadded numbered "ave" address',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '527 4th avenue', zipcode: '94118'},
    description: 'a non-zeropadded numbered, non-abbreviated "avenue" address',
    expected: '527 04TH AVE'
  },
  {
    input: {address: '2101 Baker Street', zipcode: '94115'},
    description: 'a "street" address',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 baker street', zipcode: '94115'},
    description: 'an all lowercase address',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '2101 Baker Street'},
    description: 'a valid address without zipcode',
    expected: 'noZip'
  },
  {
    input: {address: '2101 Baker St.', zipcode: '94115'},
    description: 'a valid address without a period after abbreviation',
    expected: '2101 BAKER ST'
  },
  {
    input: {address: '5000 Geary Boulevard', zipcode: '94118'},
    description: 'a non-abbreviated "boulevard" address',
    expected: '5000 GEARY BLVD'
  },
  {
    input: {address: '26 PORTOLA DRIVE', zipcode: '94131'},
    description: 'a non-abbreviated "drive" address',
    expected: '26 PORTOLA DR'
  },
  {
    input: {address: '959 JACKSON ST', zipcode: '94102'},
    description: 'an address inside SF with mismatched zip inside SF',
    expected: 'mismatchZip'
  },
  {
    input: {address: '959 JACKSON ST', zipcode: '12345'},
    description: 'an address inside SF with zip outside SF',
    expected: 'outsideSF'
  },
  {
    input: {address: '', zipcode: '94118'},
    description: 'a zip inside SF but no address',
    expected: 'noAddress'
  },
  {
    input: {address: '', zipcode: '12345'},
    description: 'a zip outside SF with no address',
    expected: 'noAddress'
  },
  {
    input: {address: '123 Doesnotexist Street', zipcode: '94118'},
    description: 'a non-existing street with zip inside SF',
    expected: 'unmatched'
  },
  {
    input: {address: '123 Doesnotexist Street', zipcode: '12345'},
    description: 'a non-existing street with zip outside SF',
    expected: 'outsideSF'
  },
  {
    input: {foo: 'asdf'},
    description: 'a nonsense input',
    expected: 'noZip'
  },

]

let expecteds = {
  noZip: 'Has no zip code',
  noAddress: 'Has no address',
  outsideSF: 'Not an SF zip code',
  mismatchZip: 'Zip Code and Address do not match',
  unmatched: 'Address not found',
  '527 04TH AVE': {
    address: '527 04TH AVE',
    zipcode: '94118',
    longitude: '-122.46229088',
    latitude: '37.77862614',
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
    address: '2101 BAKER ST',
    zipcode: '94115',
    longitude: '-122.44456085',
    latitude: '37.79053179',
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
    address: '5000 GEARY BLVD',
    zipcode: '94118',
    longitude: '-122.47316088',
    latitude: '37.78085651',
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
    address: '26 PORTOLA DR',
    zipcode: '94131',
    longitude: '-122.44398743',
    latitude: '37.75012393',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Twin Peaks',
    prec_2010: '3836',
    prec_2012: '7836',
    supdist: '8',
    tractce10: '020402'
  },
  '353 OAK ST': {
    address: '353 OAK ST',
    zipcode: '94102',
    longitude: '-122.42505581',
    latitude: '37.77449913',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3544',
    prec_2012: '7544',
    supdist: '5',
    tractce10: '016802'
  },
  '355 OAK ST': {
    address: '355 OAK ST',
    zipcode: '94102',
    longitude: '-122.42505581',
    latitude: '37.77449913',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3544',
    prec_2012: '7544',
    supdist: '5',
    tractce10: '016802'
  },
  '357 OAK ST': {
    address: '357 OAK ST',
    zipcode: '94102',
    longitude: '-122.42505581',
    latitude: '37.77449913',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3544',
    prec_2012: '7544',
    supdist: '5',
    tractce10: '016802'
  },
  '564 GROVE ST': {
    address: '564 GROVE ST',
    zipcode: '94102',
    longitude: '-122.42597394',
    latitude: '37.77772096',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3523',
    prec_2012: '7515',
    supdist: '5',
    tractce10: '016200'
  },
  '560 GROVE ST': {
    address: '560 GROVE ST',
    zipcode: '94102',
    longitude: '-122.42586555995835',
    latitude: '37.77769255504964',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3523',
    prec_2012: '7515',
    supdist: '5',
    tractce10: '016200'
  },
  '554 GROVE ST': {
    address: '554 GROVE ST',
    zipcode: '94102',
    longitude: '-122.42575718',
    latitude: '37.77766415',
    assemdist: '17',
    bartdist: '9',
    congdist: '12',
    nhood: 'Hayes Valley',
    prec_2010: '3523',
    prec_2012: '7515',
    supdist: '5',
    tractce10: '016200'
  }
}

describe('locate.findOne', function () {
  let res = inputs.map(function (el) {
    return SFLocator.findOne(el.input)
  })

  res.forEach(function (r, i) {
    it('with '.concat(inputs[i].description), function () {
      if (typeof r === 'string') {
        expect(r).toEqual(expecteds[inputs[i].expected])
      } else if (typeof r === 'object') {
        expect(r).toEqual(jasmine.objectContaining(expecteds[inputs[i].expected]))
      }
    })
  })

  it('with an address inside SF with zip outside SF and checkZipFirst turned off', function() {
    SFLocator.checkZipFirst = false
    let res = SFLocator.findOne({address: '959 JACKSON ST', zipcode: '12345'})
    expect(res).toEqual(expecteds.mismatchZip)
    SFLocator.checkZipFirst = true
  })
})

let notInEAS = [
  {address: '355 OAK Street', number: '355', street: 'OAK', type: 'ST', zipcode: '94102'},
  {address: '560 GROVE St', number: '560', street: 'GROVE', type: 'ST', zipcode: '94102'},
  {address: '123 Doesnotexist Street', number: '123', street: 'DOESNOTEXIST', type: 'ST', zipcode: '94118'}
]

describe('locate.findNextDoor', function () {
  it('should find the next highest address with an incomplete address object', function () {
    let res = SFLocator.findNextDoor({address: '355 OAK Street', zipcode: '94102'})
    expect(res).toEqual(jasmine.objectContaining(expecteds['357 OAK ST']))
  })
  it('should find the next highest address by default', function () {
    let res = SFLocator.findNextDoor(notInEAS[0])
    expect(res).toEqual(jasmine.objectContaining(expecteds['357 OAK ST']))
  })

  it('should find the next highest address when asked', function () {
    let res = SFLocator.findNextDoor(notInEAS[0], 'up')
    expect(res).toEqual(jasmine.objectContaining(expecteds['357 OAK ST']))
  })

  it('should find the next lowest address', function () {
    let res = SFLocator.findNextDoor(notInEAS[0], 'down')
    expect(res).toEqual(jasmine.objectContaining(expecteds['353 OAK ST']))
  })

  it('should find the next highest address when difference more than 2', function () {
    let res = SFLocator.findNextDoor(notInEAS[1], 'up')
    expect(res).toEqual(jasmine.objectContaining(expecteds['564 GROVE ST']))
  })

  it('should find the next lowest address when difference more than 2', function () {
    let res = SFLocator.findNextDoor(notInEAS[1], 'down')
    expect(res).toEqual(jasmine.objectContaining(expecteds['554 GROVE ST']))
  })
})

describe ('locate.searchByNeighbors', function () {
  it('should return an object with interpolated data using neighbors 2 numbers apart', function () {
    let res = SFLocator.searchByNeighbors(notInEAS[0])
    expect(res).toEqual(jasmine.objectContaining(expecteds['355 OAK ST']))
  })
  it('should return an object with interpolated data using neighbors 10 numbers apart', function () {
    let res = SFLocator.searchByNeighbors(notInEAS[1])
    expect(res).toEqual(jasmine.objectContaining(expecteds['560 GROVE ST']))
  })
  it('should return a helpful error when unable to return', function () {
    let res = SFLocator.searchByNeighbors(notInEAS[2])
    expect(res).toEqual('Not locatable by neighboring addresses')
  })
})

let several = [
  {address: '527 4th ave', zipcode: '94118'},
  {address: '2101 Baker Street', zipcode: '94115'},
  {address: '5000 Geary Boulevard', zipcode: '94118'}
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
    let severalMore = [{address: '123 Doesnotexist Street', zipcode: '94118'}].concat(several)
    let res = SFLocator.findMany(severalMore)
    expect(res.result).toEqual([
      expecteds.unmatched,
      jasmine.objectContaining(expecteds['527 04TH AVE']),
      jasmine.objectContaining(expecteds['2101 BAKER ST']),
      jasmine.objectContaining(expecteds['5000 GEARY BLVD'])
    ])
  })

  it('should return an array of addresses that did not match', function () {
    let unmatching = [{address: '123 Doesnotexist Street', zipcode: '94118'}]
    let severalMore = unmatching.concat(several)
    let res = SFLocator.findMany(severalMore)
    expect(res.unmatched).toEqual(unmatching)
  })

  it('should return an array of addresses that did not match and why', function () {
    let unmatching = [
      {address: '123 Doesnotexist Street', zipcode: '94118'},
      {address: '123 OutsideSF Street', zipcode: '12345'},
      {foo: 'asdf'}
    ]
    let expected = [
      {address: '123 Doesnotexist Street', zipcode: '94118', reason: expecteds.unmatched},
      {address: '123 OutsideSF Street', zipcode: '12345', reason: expecteds.outsideSF},
      {foo: 'asdf', reason: expecteds.noZip}
    ]
    let severalMore = unmatching.concat(several)

    let res = SFLocator.findMany(severalMore)
    expect(res.unmatched).toEqual(expected)
  })
})

describe('locate.reconsileUnmatched', function () {
  it('should return addresses "inside SF" that didnt match', function () {
    let unmatchingAddress = {address: '123 Doesnotexist Street', zipcode: '94118'}
    let list = [unmatchingAddress].concat(several)
    let matched = [expecteds.unmatched, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
    let expected = [unmatchingAddress]
    let res = SFLocator.reconsileUnmatched(list, matched)

    expect(res).toEqual(expected)
  })
  it('should return addresses "outside SF" that didnt match', function () {
    let unmatchingAddress = {address: '123 OutsideSF Street', zipcode: '12345'}
    let list = [unmatchingAddress].concat(several)
    let matched = [expecteds.outsideSF, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
    let expected = [unmatchingAddress]
    let res = SFLocator.reconsileUnmatched(list, matched)
    expect(res).toEqual(expected)
  })
})
