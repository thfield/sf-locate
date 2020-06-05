'use strict'
const fs = require('fs')
const path = require('path')
const readFile = require('./readFile')

let geography = {
  precinct:'fhns-n8qp',
  neighborhood:'p5b7-5n3h',
  tract:'rarb-5ahf'
}

let precinctGeo = readFile(path.join('.', 'geo', `${geography.precinct}.json`))
let neighborhoodGeo = readFile(path.join('.', 'geo', `${geography.neighborhood}.json`))
let tractGeo = readFile(path.join('.', 'geo', `${geography.tract}.json`))

module.exports = {
  precinct: precinctGeo,
  neighborhood: neighborhoodGeo,
  tract: tractGeo
}
