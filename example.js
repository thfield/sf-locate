console.time('timer')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const Locator = require('./locator')
const addressParse = require('./lib/addressParse')
const columns = ['eas baseid','cnn','address','zipcode','longitude','latitude','assemdist','bartdist','congdist','nhood','prec_2010','prec_2012','supdist','tractce10','number','number suffix','street','type','id','method']

let SFLocator = new Locator()
// the first record has to be one that is locatable for stringify to write all column headings

// head -n 20 data/realaddresses.csv > data/somerealaddresses.csv

stepOne('./data/somerealaddresses.csv')

/** @function stepOne
 * @param {string} inputFile - path to csv
 * assumes csv file only has 'address' and 'zip' columns
 */
function stepOne (inputFile) {
  const basePath = './output' //path.dirname(inputFile)
  const baseFileName = path.basename(inputFile, '.csv')

  const outputFile = `${basePath}/${baseFileName}-found.csv`
  const unmatchedFile = `${basePath}/${baseFileName}-unmatched.csv`
  const errorsFile = `${basePath}/${baseFileName}-errors.log`
  let input

  try {
    input = fs.createReadStream(inputFile, { encoding: 'utf8' })
  } catch (err) {
    return new Error(`specified file ${inputFile} does not exist`)
  }
  const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })
  const unmatched = fs.createWriteStream(unmatchedFile, { encoding: 'utf8' })
  const errorsStream = fs.createWriteStream(errorsFile, { encoding: 'utf8' })
  let unmatchedstream = stringify({header: true})
  unmatchedstream.pipe(unmatched)

  let parser = parse({columns: true, delimiter: ','})
  let transformer = transform(async function (record, callback) {
    try {
      let std = addressParse.standardize(record.address)
      Object.assign(record, std)
    } catch (err) {
      errorsStream.write(`${err.message}: ${record.address} \n`)
      return callback(null, null)
    }
    const streetsWithoutTypes = ['AVENUE B','AVENUE D','AVENUE E','AVENUE G','AVENUE H','AVENUE I','AVENUE M','AVENUE N','AVENUE OF THE PALMS','BROADWAY','CHANNEL','EL CAMINO DEL MAR','LA AVANZADA','LA PLAYA','SOUTH PARK','THE EMBARCADERO','VIA BUFANO','VIA FERLINGHETTI']
    let located

    try {
      if (streetsWithoutTypes.includes(record.street)){
        located = await SFLocator.findOne(record, {ignoreStreetType: true})
      } else {
        located = await SFLocator.findOne(record)
      }

      if (located.message === 'Address not found method findOne') {
        located = await SFLocator.searchByNeighbors(record)
      }

      callback(null, located)
    } catch (err) {
      unmatchedstream.write(Object.assign({err: err.message}, record))
      callback(null, null)
    }
  }, {parallel: 100})
  let stringifier = stringify({header: true})

  input
    .pipe(parser)
    .pipe(transformer)
    .pipe(stringifier)
    .pipe(output)
    .on('finish', () => {
      console.log(`saved to ${outputFile}`)
      // cleanup()
      stepTwo(inputFile)
    })
}

function stepTwo (inputFile) {
  const basePath = './output'
  const baseFileName = path.basename(inputFile, '.csv')

  inputFile = `${basePath}/${baseFileName}-unmatched.csv`
  const outputFile = `${basePath}/${baseFileName}-found-step2.csv`
  const unmatchedFile = `${basePath}/${baseFileName}-stillunmatched.csv`
  let input

  try {
    input = fs.createReadStream(inputFile, { encoding: 'utf8' })
  } catch (err) {
    return new Error(`specified file ${inputFile} does not exist`)
  }
  const output = fs.createWriteStream(outputFile, { encoding: 'utf8' })
  const unmatched = fs.createWriteStream(unmatchedFile, { encoding: 'utf8' })
  let unmatchedstream = stringify({header: true})
  unmatchedstream.pipe(unmatched)

  let parser = parse({columns: true, delimiter: ','})
  let transformer = transform(async function (record, callback) {
    try {
      if (record.err === 'Not an SF zip code' && record.city.toUpperCase() === "SAN FRANCISCO"){
        located = await SFLocator.findOne(record, {ignoreZip: true})
      } else if (record.err === 'Zip Code and Address do not match') {
        located = await SFLocator.findOne(record, {ignoreZipMismatch:true})
      }

      callback(null, located)
    } catch (err) {
      unmatchedstream.write(Object.assign({err: `step2: ${err.message}`}, record))
      callback(null, null)
    }
  }, {parallel: 100})
  let stringifier = stringify({columns: columns})

  input
    .pipe(parser)
    .pipe(transformer)
    .pipe(stringifier)
    .pipe(output)
    .on('finish', () => {
      cleanup()
      console.log(`saved to ${outputFile}`)
      console.timeEnd('timer')
    })

}

function cleanup () {
  SFLocator.close()
}