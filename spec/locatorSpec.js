'use strict'

const Locator = require('../locator.js')
let SFLocator = new Locator()

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
  noZip: 'Has no zip code',
  noAddress: 'Not enough address info',
  outsideSF: 'Not an SF zip code',
  mismatchZip: 'Zip Code and Address do not match',
  unmatched: 'Address not found',
  unlisted: 'Street not in listing',
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
  },
  '2664 BROADWAY': {
    zipcode: '94115',
    assemdist: '19',
    bartdist: '8',
    congdist: '12',
    nhood: 'Pacific Heights',
    prec_2010: '3224',
    prec_2012: '9222',
    supdist: '2',
    tractce10: '013200',
    number: '2664',
    street: 'BROADWAY',
  },
  '2103 BAKER ST': {
    zipcode:'94115',
    assemdist:'19',
    bartdist:'8',
    congdist:'12',
    nhood:'Pacific Heights',
    prec_2010:'2209',
    prec_2012:'9236',
    supdist:'2',
    tractce10:'013400',
    number:'2103',
    street:'BAKER',
    type:'ST'
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

inputs.forEach(function (el, i) {
  describe(`locate.findOne input[${i}]`, function () {
    it('with '.concat(el.description), async function () {
      let r = await SFLocator.findOne(el.input)
      if (typeof r === 'string') {
        expect(r).toEqual(expecteds[el.expected])
      } else if (typeof r === 'object') {
        expect(r).toEqual(jasmine.objectContaining(expecteds[el.expected]))
      }
    })
  })
})

describe('locate.findOne', function () {

  it('should throw an error with a standardized valid address without zipcode', async function() {
    let input = {
      number: '2101',
      street: 'BAKER',
      type: 'ST'
    }
    let res = SFLocator.findOne(input)
    await expectAsync(res).toBeRejectedWithError(expecteds['noZip']) 
  })

  it('should throw an error with an address inside SF with mismatched zip inside SF', async function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    let res = SFLocator.findOne(input)
    await expectAsync(res).toBeRejectedWithError(expecteds['mismatchZip'])      
  })
  it('should work with an address inside SF and mismatching zip inside SF if options.ignoreZip is true ', async function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '94102'}
    let res = SFLocator.findOne(addr, {ignoreZip: true})
    let exp = Object.assign({originalZip: addr.zipcode}, expecteds['5000 GEARY BLVD'])
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(exp))
  })
  it('should work with an address inside SF and mismatching zip inside SF if options.ignoreZipMismatch is true ', async function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '94102'}
    let res = SFLocator.findOne(addr, {ignoreZipMismatch: true})
    let exp = Object.assign({originalZip: addr.zipcode}, expecteds['5000 GEARY BLVD'])
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(exp))
  })

  it('should throw an error with an address inside SF with zip outside SF', async function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['outsideSF'])
  })

  it('should throw an error with an address inside SF with zip outside SF if options.ignoreSFZip is true', async function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    await expectAsync( SFLocator.findOne(input, {ignoreSFZip:true}) )
          .toBeRejectedWithError(expecteds['mismatchZip'])
  })

  it('should work with an address inside SF and zip outside SF if options.ignoreZip is true ', async function() {
    let addr = {number: '5000', street: 'GEARY', type: 'BLVD', zipcode: '12345'}
    let res = SFLocator.findOne(addr, {ignoreZip: true})
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['5000 GEARY BLVD']))
  })

  it('should throw an error with a zip inside SF but no number address', async function() {
    let input = {
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['noAddress'])
  })

  it('should throw an error with a zip inside SF but no street', async function() {
    let input = {
      number: '959',
      type: 'ST',
      zipcode: '94102'
    }
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['noAddress'])
  })

  it('should return an error with a street and zip inside SF but no matching number', async function() {
    let input = {
      number: '10000000000',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '94102'
    }
    let res = SFLocator.findOne(input)
    await expectAsync(res).toBeRejectedWithError(expecteds['unmatched'])
  })

  it('should throw an error with an address inside SF but no type', async function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      zipcode: '94102'
    }
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['noAddress'])
  })

  it('should work with an address inside SF and no street type if options.ignoreStreetType is true', async function() {
    let addr = {number: '730', street: 'BROADWAY', zipcode: '94133'}
    let res = SFLocator.findOne(addr, {ignoreStreetType: true})
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['730 BROADWAY']))
  })

  it('should throw an error with a non-existing street with zip inside SF', async function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '94102'
    }
    await expectAsync( SFLocator.findOne(input))
          .toBeRejectedWithError(expecteds['unlisted'])
  })

  it('should throw an error with a non-existing street with zip outside SF', async function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '12345'
    }
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['outsideSF'])
  })

  it('should throw an error with a non-existing street with zip outside SF and ignoreSFZip set to true', async function() {
    let input = {
      number: '123',
      street: 'DOESNOTEXIST',
      type: 'ST',
      zipcode: '12345'
    }
    await expectAsync( SFLocator.findOne(input, {ignoreSFZip: true}) )
          .toBeRejectedWithError(expecteds['unlisted'])
  })

  it('should throw an error with a a nonsense input', async function() {
    let input = {foo: 'asdf'}
    await expectAsync( SFLocator.findOne(input) )
          .toBeRejectedWithError(expecteds['noAddress'])
  })

  it('should error with an address inside SF, zip outside SF, and ignoring sf zip code requirement', async function() {
    let input = {
      number: '959',
      street: 'JACKSON',
      type: 'ST',
      zipcode: '12345'
    }
    await expectAsync( SFLocator.findOne(input, {ignoreSFZip: true}) )
          .toBeRejectedWithError(expecteds['mismatchZip'])
  })

  it('should keep the id property if it is passed in', async function () {
    let res = SFLocator.findOne(Object.assign({id:'asdf1234'}, inputs[1].input))
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['2101 BAKER ST']))
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining({id:'asdf1234'}))
  })

  it('should report how the match was made', async function () {
    let addr = {
      number: '527',
      street: '04TH',
      type: 'AVE',
      zipcode: '94118'
    }

    let directly = SFLocator.findOne(addr)
    await expectAsync(directly).toBeResolvedTo(jasmine.objectContaining({method: 'direct match with EAS listing'}))

    // ignoring street type
    let ignoreStreetType = SFLocator.findOne({number: '730', street: 'BROADWAY', zipcode: '94133'}, {ignoreStreetType: true})
    await expectAsync(ignoreStreetType).toBeResolvedTo(jasmine.objectContaining({method: 'match used ignoreStreetType'}))

    // ignoring zipcode match
    let ignoreZipcode = SFLocator.findOne(Object.assign(addr, {zipcode: '94102'}), {ignoreZip: true})
    await expectAsync(ignoreZipcode).toBeResolvedTo(jasmine.objectContaining({method: 'match used ignoreZip'}))

    // ignoring zipcode and street type
    let ignoreStreetTypeAndZip = SFLocator.findOne({number: '730', street: 'BROADWAY', zipcode: '94102'}, {ignoreZip: true, ignoreStreetType: true})
    await expectAsync(ignoreStreetTypeAndZip).toBeResolvedTo(jasmine.objectContaining({method: 'match used ignoreZip, ignoreStreetType'}))

    // neighbor interpolation
    let interpolation = SFLocator.searchByNeighbors({number: '355', street: 'OAK', type: 'ST', zipcode: '94102'})
    await expectAsync(interpolation).toBeResolvedTo(jasmine.objectContaining({method: 'match by neighboring interpolation'}))

    // find by nextDoor address
    let nextDoor = SFLocator.searchByNeighbors({number: '1032', street: 'BUCHANAN', type: 'ST', zipcode: '94115'}, {nextDoor: true})
    await expectAsync(nextDoor).toBeResolvedTo(jasmine.objectContaining({method: 'match by neighbor address'}))
  })
})

describe('locate.findNextDoor', function () {
  it('should error with an incomplete address object', async function () {
    let res = SFLocator.findNextDoor({address: '355 OAK Street', zipcode: '94102'})
    await expectAsync(res).toBeRejectedWith(Error('cannot find next door without an address object'))
  })

  it('should find the next highest address by default', async function () {
    let res = SFLocator.findNextDoor(notInEAS[0])
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['357 OAK ST']))
  })

  it('should find the next highest address when asked', async function () {
    let res = SFLocator.findNextDoor(notInEAS[0], 'up')
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['357 OAK ST']))
  })

  it('should find the next lowest address', async function () {
    let res = SFLocator.findNextDoor(notInEAS[0], 'down')
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['353 OAK ST']))
  })

  it('should find the next highest address when difference more than 2', async function () {
    let res = SFLocator.findNextDoor(notInEAS[1], 'up')
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['564 GROVE ST']))
  })

  it('should find the next lowest address when difference more than 2', async function () {
    let res = SFLocator.findNextDoor(notInEAS[1], 'down')
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['554 GROVE ST']))
  })

  it('should return an error when nextdoor search fails', async function () {
    let res = SFLocator.findNextDoor(notInEAS[3])
    await expectAsync(res).toBeRejectedWith(Error('Nextdoor address not found'))
  })
})

describe ('locate.searchByNeighbors', function () {
  it('should return an object with interpolated data using neighbors 2 numbers apart', async function () {
    let res = SFLocator.searchByNeighbors(notInEAS[0])
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['355 OAK ST']))
  })
  it('should return an object with interpolated data using neighbors 10 numbers apart', async function () {
    let res = SFLocator.searchByNeighbors(notInEAS[1])
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['560 GROVE ST']))
  })
  it('should throw a helpful error when unable to return', async function () {
    await expectAsync( SFLocator.searchByNeighbors(notInEAS[2]) )
          .toBeRejectedWith(new Error('Not locatable by neighboring addresses'))
  })
  it('should throw a helpful error when unable to return with nextDoor=true', async function () {
    await expectAsync( SFLocator.searchByNeighbors({number: '1036', street: 'BUCHANAN', type: 'ST', zipcode: '94115'}, {nextDoor:true}) )
          .toBeRejectedWith(new Error('Not locatable by neighboring addresses'))
  })
  it('should find an address "next door" if asked', async function () {
    let t = {number:'2103', street: 'BAKER', type: 'ST', zipcode:'94115'}
    let res = SFLocator.searchByNeighbors(t, {nextDoor: true})
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['2103 BAKER ST']))
  })
  it('should work with a zip outside SF if options.ignoreZip is true', async function () {
    let t = {number: '355', street: 'OAK', type: 'ST', zipcode: '12345'}
    let res = SFLocator.searchByNeighbors(t, {ignoreZip: true})
    let nozip = Object.assign({}, expecteds['355 OAK ST'])
    delete nozip.zipcode
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(nozip))
  })
  it('should `work with an address without type` if options.ignoreStreetType is true', async function () {
    let t = {number: '2664', street: 'BROADWAY', zipcode: '94115'}
    let res = SFLocator.searchByNeighbors(t, {ignoreStreetType: true})
    await expectAsync(res).toBeResolvedTo(jasmine.objectContaining(expecteds['2664 BROADWAY']))
  })
})

describe('locate.searchAddress', function () {
  it('should find the right address', async function () {
    let baker = SFLocator.searchAddress({
      number: '2101',
      street: 'BAKER',
      type: 'ST',
      zipcode: '94115'
    })
    let expected = jasmine.objectContaining({'eas_baseid': '274772', 'cnn': '2624000', 'tractce10': '013400'})
    await expectAsync(baker).toBeResolvedTo(expected)

  })

  it('should error when a street does not exist in SF', async function () {
    let res =  SFLocator.searchAddress({
      number: '2101',
      street: 'NONEXISTANTSTREET',
      type: 'ST',
      zipcode: '94115'
    })
    await expectAsync(res).toBeRejectedWithError('Street not in listing')
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
