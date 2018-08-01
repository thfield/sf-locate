'use strict'

const Locator = require('../locator.js')
let SFLocator = new Locator(true) // pass true in constructor for "testing mode"

let inputs = [
  {
    input: {
      number: '527',
      street: '04TH',
      type: 'AVE',
      zipcode: '94118'
    },
    description: 'a standardized, complete address',
    expected: '527 04TH AVE'
  },
  {
    input: {
      number: '2101',
      street: 'BAKER',
      type: 'ST',
      zipcode: '94115'
    },
    description: 'another standardized, complete address',
    expected: '2101 BAKER ST'
  },
  {
    input: {
      number: '2101',
      street: 'BAKER',
      type: 'ST',
      zip: '94115'
    },
    description: 'another standardized address only with property "zip" instead of "zipcode"',
    expected: '2101 BAKER ST'
  }
]

let expecteds = {
  noZip: Error('Has no zip code'),
  noAddress: Error('Not enough address info'),
  outsideSF: Error('Not an SF zip code'),
  mismatchZip: Error('Zip Code and Address do not match'),
  unmatched: Error('Address not found'),
  unlisted: Error('Street not in listing'),
  '527 04TH AVE': {
    number: '527',
    street: '04TH',
    type: 'AVE',
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
    number: '2101',
    street: 'BAKER',
    type: 'ST',
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
    number: '5000',
    street: 'GEARY',
    type: 'BLVD',
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
    number: '26',
    street: 'PORTOLA',
    type: 'DR',
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
    number: '353',
    street: 'OAK',
    type: 'ST',
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
    number: '355',
    street: 'OAK',
    type: 'ST',
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
    number: '357',
    street: 'OAK',
    type: 'ST',
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
    number: '564',
    type: 'ST',
    street: 'GROVE',
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
    number: '560',
    type: 'ST',
    street: 'GROVE',
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
    number: '554',
    type: 'ST',
    street: 'GROVE',
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
  },
  '730 BROADWAY':{
    number: '730',
    street: 'BROADWAY',
    zipcode: '94133',
    longitude: '-122.4091949',
    latitude: '37.79779624',
    assemdist: '17',
    bartdist: '8',
    congdist: '12',
    nhood: 'Chinatown',
    prec_2010: '3317',
    prec_2012: '7314',
    supdist: '3',
    tractce10: '010700',
  }
}

let notInEAS = [
  {number: '355', street: 'OAK', type: 'ST', zipcode: '94102'},
  {number: '560', street: 'GROVE', type: 'ST', zipcode: '94102'},
  {number: '123', street: 'OAK', type: 'ST', zipcode: '94118'},
  {number: '56', street: 'GROVE', type: 'ST', zipcode: '94102'},
]

let several = [
  {address: '527 4th ave', zipcode: '94118'},
  {address: '2101 Baker Street', zipcode: '94115'},
  {address: '5000 Geary Boulevard', zipcode: '94118'}
]

// describe('one off', function () {
//   it('should throw an error with a street and zip inside SF but no matching number', function() {
//     let input = {
//       number: '10000000000',
//       street: 'JACKSON',
//       type: 'ST',
//       zipcode: '94102'
//     }
//     expect( function(){ SFLocator.findOne(input) } )
//           .toThrow(expecteds['unmatched'])
//   })
// })

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

  it('should throw an error with a standardized valid address without zipcode', function() {
    let input = {
      number: '2101',
      street: 'BAKER',
      type: 'ST'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['noZip'])
  })

  it('should throw an error with an address inside SF with mismatched zip inside SF', function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['mismatchZip'])
  })
  it('should work with an address inside SF and mismatching zip inside SF if options.ignoreZip is true ', function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '94118'}
    let res = SFLocator.findOne(addr, {ignoreZip: true})
    expect(res).toEqual(jasmine.objectContaining(expecteds['5000 GEARY BLVD']))
  })
  it('should work with an address inside SF and mismatching zip inside SF if options.ignoreZipMismatch is true ', function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '94118'}
    let res = SFLocator.findOne(addr, {ignoreZipMismatch: true})
    expect(res).toEqual(jasmine.objectContaining(expecteds['5000 GEARY BLVD']))
  })

  it('should throw an error with an address inside SF with zip outside SF', function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['outsideSF'])
  })

  it('should throw an error with an address inside SF with zip outside SF if options.ignoreSFZip is true', function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    expect( function(){ SFLocator.findOne(input, {ignoreSFZip:true}) } )
          .toThrow(expecteds['mismatchZip'])
  })

  it('should work with an address inside SF and zip outside SF if options.ignoreZip is true ', function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '12345'}
    let res = SFLocator.findOne(addr, {ignoreZip: true})
    expect(res).toEqual(jasmine.objectContaining(expecteds['5000 GEARY BLVD']))
  })

  it('should throw an error with a zip inside SF but no number address', function() {
    let input = {
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['noAddress'])
  })

  it('should throw an error with a zip inside SF but no street', function() {
    let input = {
      number: '959',
      type: 'ST',
      zipcode: '94102'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['noAddress'])
  })

  it('should return an error with a street and zip inside SF but no matching number', function() {
    let input = {
      number: '10000000000',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    let res = SFLocator.findOne(input)
    expect(res).toEqual(expecteds['unmatched'])
    
  })

  it('should throw an error with an address inside SF but no type', function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      zipcode: '94102'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['noAddress'])
  })
  it('should work with an address inside SF and no street type if options.ignoreStreetType is true', function() {
    let addr = {number: '730', street: 'BROADWAY', zipcode: '94133'}
    let res = SFLocator.findOne(addr, {ignoreStreetType: true})
    expect(res).toEqual(jasmine.objectContaining(expecteds['730 BROADWAY']))
  })


  it('should throw an error with a non-existing street with zip inside SF', function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '94102'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['unlisted'])
  })

  it('should throw an error with a non-existing street with zip outside SF', function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '12345'
    }
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['outsideSF'])
  })

  it('should throw an error with a non-existing street with zip outside SF and ignoreSFZip set to true', function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '12345'
    }
    expect( function(){ SFLocator.findOne(input, {ignoreSFZip: true}) } )
          .toThrow(expecteds['unlisted'])
  })

  it('should throw an error with a a nonsense input', function() {
    let input = {foo: 'asdf'}
    expect( function(){ SFLocator.findOne(input) } )
          .toThrow(expecteds['noAddress'])
  })

  it('should error with an address inside SF, zip outside SF, and ignoring sf zip code requirement', function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    expect( function(){ SFLocator.findOne(input, {ignoreSFZip: true}) } )
          .toThrow(expecteds['mismatchZip'])
  })

  it('should keep the id property if it is passed in', function () {
    let res = SFLocator.findOne(Object.assign({id:'asdf1234'}, inputs[1].input))
    expect(res).toEqual(jasmine.objectContaining(expecteds['2101 BAKER ST']))
    expect(res).toEqual(jasmine.objectContaining({id:'asdf1234'}))
  })

  it('should report how the match was made', function () {
    let addr = {
      number: '527',
      street: '04TH',
      type: 'AVE',
      zipcode: '94118'
    }

    let directly = SFLocator.findOne(addr)
    expect(directly).toEqual(jasmine.objectContaining({method: 'direct match with EAS listing'}))

    // ignoring street type
    let ignoreStreetType = SFLocator.findOne({number: '730', street: 'BROADWAY', zipcode: '94133'}, {ignoreStreetType: true})
    expect(ignoreStreetType).toEqual(jasmine.objectContaining({method: 'match ignored StreetType'}))

    // ignoring zipcode match
    let ignoreZipcode = SFLocator.findOne(Object.assign(addr, {zipcode: '94102'}), {ignoreZip: true})
    expect(ignoreZipcode).toEqual(jasmine.objectContaining({method: 'match ignored Zip'}))

    // ignoring zipcode and street type
    let ignoreStreetTypeAndZip = SFLocator.findOne({number: '730', street: 'BROADWAY', zipcode: '94102'}, {ignoreZip: true, ignoreStreetType: true})
    expect(ignoreStreetTypeAndZip).toEqual(jasmine.objectContaining({method: 'match ignored Zip, StreetType'}))

    // neighbor interpolation
    let interpolation = SFLocator.searchByNeighbors({number: '355', street: 'OAK', type: 'ST', zipcode: '94102'})
    expect(interpolation).toEqual(jasmine.objectContaining({method: 'match by neighboring interpolation'}))
  })
})

describe('locate.findNextDoor', function () {
  it('should error with an incomplete address object', function () {
    let res = SFLocator.findNextDoor({address: '355 OAK Street', zipcode: '94102'})
    expect(res).toEqual(Error('cannot find next door without an address object'))
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

  it('should return an error when nextdoor search fails', function () {
    let res = SFLocator.findNextDoor(notInEAS[3])
    expect(res).toEqual(Error('Nextdoor address not found'))
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
  it('should throw a helpful error when unable to return', function () {
    expect( function(){ SFLocator.searchByNeighbors(notInEAS[2]) } )
          .toThrow(new Error('Not locatable by neighboring addresses'))
  })
})

describe('locate.addresses creation', function () {
  it('should be a d3-collection nest().entries() object', function () {
    let baker = SFLocator.addresses.find(k => { return k.key === 'BAKER' })
    let sutter = SFLocator.addresses.find(k => { return k.key === 'SUTTER' })
    let lombard = SFLocator.addresses.find(k => { return k.key === 'LOMBARD' })
    let ulloa = SFLocator.addresses.find(k => { return k.key === 'ULLOA' })
    let filbert = SFLocator.addresses.find(k => { return k.key === 'FILBERT' })
    expect(baker.values.length).toEqual(2)
    expect(sutter.values.length).toEqual(2)
    expect(lombard.values.length).toEqual(6)
    expect(ulloa.values.length).toEqual(5)
    expect(filbert.values.length).toEqual(5)

    expect(baker.values).toContain(jasmine.objectContaining({'number':'2101'}))
    expect(baker.values).toContain(jasmine.objectContaining({'number':'1030'}))
  })
})

describe('locate.searchAddress', function () {
  it('should find the right address', function () {
    let baker = SFLocator.searchAddress({
      number: '2101',
      street: 'BAKER',
      type: 'ST',
      zipcode: '94115'
    })
    expect(baker).toEqual(jasmine.objectContaining({'eas baseid': '274772', 'cnn': '2624000', 'tractce10': '013400'}))

  })
})

// describe('locate.findMany', function () {
//   it('should return an array of found addresses when passed an array of valid addresses', function () {
//     let res = SFLocator.findMany(several)
//     expect(res.result).toEqual([
//       jasmine.objectContaining(expecteds['527 04TH AVE']),
//       jasmine.objectContaining(expecteds['2101 BAKER ST']),
//       jasmine.objectContaining(expecteds['5000 GEARY BLVD'])
//     ])
//   })
//
//   it('should return an array of found and not found addresses', function () {
//     let severalMore = [{address: '123 Doesnotexist Street', zipcode: '94118'}].concat(several)
//     let res = SFLocator.findMany(severalMore)
//     expect(res.result).toEqual([
//       expecteds.unmatched,
//       jasmine.objectContaining(expecteds['527 04TH AVE']),
//       jasmine.objectContaining(expecteds['2101 BAKER ST']),
//       jasmine.objectContaining(expecteds['5000 GEARY BLVD'])
//     ])
//   })
//
//   it('should return an array of addresses that did not match', function () {
//     let unmatching = [{address: '123 Doesnotexist Street', zipcode: '94118'}]
//     let severalMore = unmatching.concat(several)
//     let res = SFLocator.findMany(severalMore)
//     expect(res.unmatched).toEqual(unmatching)
//   })
//
//   it('should return an array of addresses that did not match and why', function () {
//     let unmatching = [
//       {address: '123 Doesnotexist Street', zipcode: '94118'},
//       {address: '123 OutsideSF Street', zipcode: '12345'},
//       {foo: 'asdf'}
//     ]
//     let expected = [
//       {address: '123 Doesnotexist Street', zipcode: '94118', reason: expecteds.unmatched},
//       {address: '123 OutsideSF Street', zipcode: '12345', reason: expecteds.outsideSF},
//       {foo: 'asdf', reason: expecteds.noAddress}
//     ]
//     let severalMore = unmatching.concat(several)
//
//     let res = SFLocator.findMany(severalMore)
//     expect(res.unmatched).toEqual(expected)
//   })
// })
// describe('locate.reconsileUnmatched', function () {
//   it('should return addresses "inside SF" that didnt match', function () {
//     let unmatchingAddress = {address: '123 Doesnotexist Street', zipcode: '94118'}
//     let list = [unmatchingAddress].concat(several)
//     let matched = [expecteds.unmatched, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
//     let expected = [unmatchingAddress]
//     let res = SFLocator.reconsileUnmatched(list, matched)
//
//     expect(res).toEqual(expected)
//   })
//   it('should return addresses "outside SF" that didnt match', function () {
//     let unmatchingAddress = {address: '123 OutsideSF Street', zipcode: '12345'}
//     let list = [unmatchingAddress].concat(several)
//     let matched = [expecteds.outsideSF, {found: 'a match'}, {found: 'a match'}, {found: 'a match'}]
//     let expected = [unmatchingAddress]
//     let res = SFLocator.reconsileUnmatched(list, matched)
//     expect(res).toEqual(expected)
//   })
// })
