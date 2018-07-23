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
    address: '960 4th Avenue',
    test: 'should zeropad numbered sts/aves less than 10',
    expected: '960 04TH AVE'
  },
  {
    address: '960 4th AVE',
    test: 'should zeropad numbered sts/aves less than 10, deal with "AVE"',
    expected: '960 04TH AVE'
  },
  {
    address: '960 fourth avenue',
    test: 'should find an ordinal spelled avenue',
    expected: '960 04TH AVE'
  },
  {
    address: '960 thirteenth avenue',
    test: 'should find an ordinal spelled teens avenue',
    expected: '960 13TH AVE'
  },
  {
    address: '960 twenty second avenue',
    test: 'should find an ordinal spelled compund avenue',
    expected: '960 22ND AVE'
  },
  {
    address: '960 twenty-second avenue',
    test: 'should find an ordinal spelled compund avenue with hyphen',
    expected: '960 22ND AVE'
  },
  {
    address: '123 BELLA VISTA WAY',
    test: 'should deal with a multi-word street name"',
    expected: '123 BELLA VISTA WAY'
  },
  {
    address: '123 TURQUOISE WY',
    test: 'should unabbreviate "WY" to "WAY"',
    expected: '123 TURQUOISE WAY'
  },
  {
    address: '123 arguello boulevard',
    test: 'should abbreviate "boulevard"',
    expected: '123 ARGUELLO BLVD'
  },
  {
    address: "123 O'Farrell st",
    test: 'should remove apostrophes',
    expected: '123 OFARRELL ST'
  },
  {
    address: 'lorem ipsum',
    test: 'should do something predictable with nonsense',
    expected: null
  },
  {
    address: '123 Main Street Apt 1',
    test: 'should handle apartment numbers 1',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street Apartment 1',
    test: 'should handle apartment numbers 2',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street, Apt #1',
    test: 'should handle apartment numbers 3',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street #1',
    test: 'should handle apartment numbers 4',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street, #1',
    test: 'should handle apartment numbers 5',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street, 1',
    test: 'should handle apartment numbers 6',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street Unit 1',
    test: 'should handle apartment numbers 7',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street # 101',
    test: 'should handle apartment numbers 8',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street W #101',
    test: 'should handle apartment numbers 9',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street E404',
    test: 'should handle apartment numbers 10',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street Apt.3',
    test: 'should handle apartment numbers 11',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street Apt. J',
    test: 'should handle apartment numbers 12',
    expected: '123 MAIN ST'
  },
  {
    address: '123 Main Street No 1',
    test: 'should handle apartment numbers 13',
    expected: '123 MAIN ST'
  }
]

describe('addressParse.normalString', function () {
  let res = inputs.map(function (el) {
    return addressParse.normalString(el.address)
  })

  res.forEach(function (r, i) {
    it(inputs[i].test, function () {
      expect(r).toEqual(inputs[i].expected)
    })
  })
})

let expecteds = {
  '353 OAK ST': {
    address: '353 OAK ST',
    number: '353',
    street: 'OAK',
    type: 'ST',
    zipcode: '94102'
  },
  '357 OAK ST': {
    address: '357 OAK ST',
    number: '357',
    street: 'OAK',
    type: 'ST',
    zipcode: '94102'
  },
  '564 GROVE ST': {
    address: '564 GROVE ST',
    number: '564',
    street: 'GROVE',
    type: 'ST',
    zipcode: '94102'
  },
  '554 GROVE ST': {
    address: '554 GROVE ST',
    number: '554',
    street: 'GROVE',
    type: 'ST',
    zipcode: '94102'
  }
}

describe('addressParse.nextDoor', function () {
  let address = {
    address: '355 OAK ST',
    number: '355',
    street: 'OAK',
    type: 'ST',
    zipcode: '94102'
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

describe('addressParse.standardize', function () {
  let simple = {address:'123 Main Street', zipcode:'94102'}
  let full = {address:'123 MAIN ST', zipcode:'94102', number: '123', street: 'MAIN', type: 'ST'}

  it('should take a simple object and return a parsed version', function () {
    let r = addressParse.standardize(simple)
    expect(r).toEqual(full)
  })

  // it('should error in a reasonable way', function () {
  //   let r = addressParse.standardize({address: 'foo'})
  //   expect(r).toEqual(null)
  // })
})
