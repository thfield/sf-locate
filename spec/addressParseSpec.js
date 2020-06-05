'use strict'
const addressParse = require('../lib/addressParse')

let inputs = [
  {
    address: '4400 Mission Street',
    test: 'should work with a full "Street" name',
    expected: '4400 MISSION ST'
  },
  {
    address: '100 Larkin St',
    test: 'should work with an abbreviation',
    expected: '100 LARKIN ST'
  },
  {
    address: '100 Larkin St.',
    test: 'should work with an abbreviation and punctuation',
    expected: '100 LARKIN ST'
  },
  {
    address: '100 larkin st.',
    test: 'should work with a lowercase abbreviation and punctuation',
    expected: '100 LARKIN ST'
  },
  {
    address: '527 4th Avenue',
    test: 'should zeropad numbered sts/aves less than 10',
    expected: '527 04TH AVE'
  },
  {
    address: '527 4th AVE',
    test: 'should zeropad numbered sts/aves less than 10, deal with "AVE"',
    expected: '527 04TH AVE'
  },
  {
    address: '527 fourth avenue',
    test: 'should find an ordinal spelled avenue',
    expected: '527 04TH AVE'
  },
  {
    address: '189 thirteenth street',
    test: 'should find an ordinal spelled teens street',
    expected: '189 13TH ST'
  },
  {
    address: '189 13th street',
    test: 'should work with a numbered teens street',
    expected: '189 13TH ST'
  },
  {
    address: '1561 twenty second avenue',
    test: 'should find an ordinal spelled compund avenue',
    expected: '1561 22ND AVE'
  },
  {
    address: '1561 twenty-second avenue',
    test: 'should find an ordinal spelled compund avenue with hyphen',
    expected: '1561 22ND AVE'
  },
  {
    address: '287 BELLA VISTA WAY',
    test: 'should deal with a multi-word street name"',
    expected: '287 BELLA VISTA WAY'
  },
  // {
  //   address: '287 BELLA VISTA WY',
  //   test: 'should unabbreviate "WY" to "WAY"',
  //   expected: '287 BELLA VISTA WAY'
  // },
  {
    address: '5000 Geary boulevard',
    test: 'should abbreviate "boulevard"',
    expected: '5000 GEARY BLVD'
  },
  {
    address: "1739 O'Farrell st",
    test: 'should remove apostrophes',
    expected: '1739 OFARRELL ST'
  },
  {
    address: '4400 Mission Street Apt 1',
    test: 'should handle apartment numbers 1',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street Apartment 1',
    test: 'should handle apartment numbers 2',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street, Apt #1',
    test: 'should handle apartment numbers 3',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street #1',
    test: 'should handle apartment numbers 4',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street, #1',
    test: 'should handle apartment numbers 5',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street, 1',
    test: 'should handle apartment numbers 6',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street Unit 1',
    test: 'should handle apartment numbers 7',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street # 101',
    test: 'should handle apartment numbers 8',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street W #101',
    test: 'should handle apartment numbers 9',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street E404',
    test: 'should handle apartment numbers 10',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street Apt.3',
    test: 'should handle apartment numbers 11',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street Apt. J',
    test: 'should handle apartment numbers 12',
    expected: '4400 MISSION ST'
  },
  {
    address: '4400 Mission Street No 1',
    test: 'should handle apartment numbers 13',
    expected: '4400 MISSION ST'
  }
]

describe('addressParse.standardize', function () {
  let res = inputs.map(function (el) {
    return addressParse.standardize(el.address)
  })

  res.forEach(function (r, i) {
    it(inputs[i].test, function () {
      let exp = expecteds[inputs[i].expected]
      expect(r).toEqual(jasmine.objectContaining(exp))
    })
  })

  it('should throw an error if fed nonsense', function () {
    expect( function(){ addressParse.standardize('lorem ipsum st') })
      .toThrow(new Error('input to method addressParse.standardize must be an address'))
  })

  it('should throw an error if given not a string', function () {
    expect( function(){ addressParse.standardize(['lorem ipsum']) })
      .toThrow(new Error('input to method addressParse.standardize must be a string'))
    expect( function(){ addressParse.standardize(1) })
      .toThrow(new Error('input to method addressParse.standardize must be a string'))
  })

})

// describe('addressParse.standardize one off', function () {
//   let foo = {
//       address: '189 thirteenth street',
//       test: 'should find an ordinal spelled teens street',
//       expected: '189 13TH ST'
//     }
//     let res = addressParse.standardize( foo.address )
//
//     it(foo.test, function () {
//       let exp = expecteds[foo.expected]
//       expect(res).toEqual(jasmine.objectContaining(exp))
//     })
// })


let expecteds = {
  '4400 MISSION ST': {
    number: '4400',
    street: 'MISSION',
    type: 'ST'
  },
  '100 LARKIN ST': {
    number: '100',
    street: 'LARKIN',
    type: 'ST'
  },
  '1561 22ND AVE': {
    number: '1561',
    street: '22ND',
    type: 'AVE'
  },
  '287 BELLA VISTA WAY': {
    number: '287',
    street: 'BELLA VISTA',
    type: 'WAY'
  },
  '189 13TH ST': {
    number: '189',
    street: '13TH',
    type: 'ST'
  },
  '527 04TH AVE': {
    number: '527',
    street: '04TH',
    type: 'AVE'
  },
  '2101 BAKER ST': {
    number: '2101',
    street: 'BAKER',
    type: 'ST'
  },
  '5000 GEARY BLVD': {
    number: '5000',
    street: 'GEARY',
    type: 'BLVD'
  },
  '1739 OFARRELL ST': {
    number: '1739',
    street: 'OFARRELL',
    type: 'ST'
  },
  '26 PORTOLA DR': {
    number: '26',
    street: 'PORTOLA',
    type: 'DR'
  },
  '353 OAK ST': {
    number: '353',
    street: 'OAK',
    type: 'ST'
  },
  '357 OAK ST': {
    number: '357',
    street: 'OAK',
    type: 'ST'
  },
  '564 GROVE ST': {
    number: '564',
    street: 'GROVE',
    type: 'ST'
  },
  '554 GROVE ST': {
    number: '554',
    street: 'GROVE',
    type: 'ST'
  }
}

describe('addressParse.nextDoor', function () {
  let address = {
    number: '355',
    street: 'OAK',
    type: 'ST'
  }
  it('should find the next highest street address implicitly', function () {
    let res = addressParse.nextDoor(address)
    expect(res).toEqual(expecteds['357 OAK ST'])
  })
  it('should find the next highest street address explicitly', function () {
    let res = addressParse.nextDoor(address, 'up')
    expect(res).toEqual(expecteds['357 OAK ST'])
  })
  it('should find the next lowest street address', function () {
    let res = addressParse.nextDoor(address, 'down')
    expect(res).toEqual(expecteds['353 OAK ST'])
  })
})
