// const turf = require('@turf/turf')
const lineshapes = require('../lib/loadLineshapes')
const sfProps = require('../lib/sfProps')

let mainLibrary = {
  address: '100 Larkin St.',
  zipcode: '94102',
  name: 'Main Library',
  lon: '-122.4158589',
  lat: '37.77934463'
}

let expected = {
  assemdist: '17',
  bartdist: '9',
  congdist: '12',
  nhood: 'Tenderloin',
  prec_2010: '3621',
  prec_2012: '7617',
  supdist: '6',
  tractce10: '012402'
}

describe('locate in SF function (with lon/lat)', function () {
  it('should return the expected values', function () {
    let res = sfProps([mainLibrary.lon, mainLibrary.lat], lineshapes)
    expect(res).toEqual(expected)
  })

  it('handle a lat/lon not in the area', function () {
    let res = sfProps([0, 0], lineshapes)
    expect(res).toBe(null)
  })
})
