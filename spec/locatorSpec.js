'use strict'

const SFLocator = require('./index.js')
let Locator = new SFLocator()

let inputs = [
  {
    input: '4400 Mission Street',
    test: 'find the address',
    method: 'locate'
    expected: '4400 MISSION ST'
  },
  // {
  //   address: '100 Larkin St',
  //   test: 'should work with an abbreviation',
  //   expected: '100 LARKIN ST'
  // },
  // {
  //   address: '100 Larkin St.',
  //   test: 'should work with an abbreviation and punctuation',
  //   expected: '100 LARKIN ST'
  // },
  // {
  //   address: '960 4th Avenue',
  //   test: 'should zeropad numbered sts/aves less than 10',
  //   expected: '960 04TH AVE'
  // },
  // {
  //   address: '960 4th AVE',
  //   test: 'should zeropad numbered sts/aves less than 10, deal with "AVE"',
  //   expected: '960 04TH AVE'
  // },
  // {
  //   address: '123 BELLA VISTA WAY',
  //   test: 'should deal with a multi-word street name"',
  //   expected: '123 BELLA VISTA WAY'
  // },
  // {
  //   address: '123 TURQUOISE WY',
  //   test: 'should unabbreviate "WY" to "WAY"',
  //   expected: '123 TURQUOISE WAY'
  // },
  // {
  //   address: '123 arguello boulevard',
  //   test: 'should abbreviate "boulevard"',
  //   expected: '123 ARGUELLO BLVD'
  // },
  // {
  //   address: "123 O'Farrell st",
  //   test: 'should remove apostrophes',
  //   expected: '123 OFARRELL ST'
  // },
  // {
  //   address: 'lorem ipsum',
  //   test: 'should do something predictable with nonsense',
  //   expected: null
  // }
]

describe('locator', function () {
  let res = inputs.map(function (el) {
    return Locator[el.method](el.input)
  })

  res.forEach(function (r, i) {
    it(inputs[i].test, function () {
      expect(r).toEqual(inputs[i].expected)
    })
  })
})
