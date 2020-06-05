const turf = require('@turf/turf')

describe('Boundary Test', function () {
  const boundaryTest = require('../lib/boundaryTest')

  var pt1 = turf.point([-77, 44])
  var pt2 = turf.point([0, 0])
  var poly1 = turf.polygon([[
    [-81, 41],
    [-81, 47],
    [-72, 47],
    [-72, 41],
    [-81, 41]
  ]], {name: 'poly1'})
  var poly2 = turf.polygon([[
    [-81, 35],
    [-81, 41],
    [-72, 41],
    [-72, 35],
    [-81, 35]
  ]], {name: 'poly2'})
  // var points = turf.featureCollection([pt1, pt2]);
  var polygons = turf.featureCollection([poly1, poly2])

  it('should find the shape that the point falls within', function () {
    let res = boundaryTest(pt1, polygons)
    expect(res).toEqual({name: 'poly1'})
  })

  it('should deal with a point not in any polygon', function () {
    let res = boundaryTest(pt2, polygons)
    expect(res).toBe('Containing boundary not found')
  })
})
