console.time('timer')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const Locator = require('./locator')
const addressParse = require('./lib/addressParse')

let SFLocator = new Locator()
// the first record has to be one that is locatable for stringify to write all column headings

// head -n 20 data/realaddresses.csv > data/somerealaddresses.csv

csvList('./data/somerealaddresses.csv')
// csvList('./data/arealaddress.csv')

/** @function csvList
 * @param {string} inputFile - path to csv
 * assumes csv file only has 'address' and 'zip' columns
 */
function csvList (inputFile) {
  const basePath = path.dirname(inputFile)
  const baseFileName = path.basename(inputFile, '.csv')

  const outputFile = `${basePath}/${baseFileName}-found.csv`
  const unmatchedFile = `${basePath}/${baseFileName}-unmatched.csv`
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
  let transformer = transform(function (record, callback) {
    try {
      let std = addressParse.standardize(record.address)
      Object.assign(record, std)
    } catch (err) {
      console.error(err)
      //reroute to an errors file: couldnt standardize the address
      callback(null, null)
    }
    const streetsWithoutTypes = ['AVENUE B','AVENUE D','AVENUE E','AVENUE G','AVENUE H','AVENUE I','AVENUE M','AVENUE N','AVENUE OF THE PALMS','BROADWAY','CHANNEL','EL CAMINO DEL MAR','LA AVANZADA','LA PLAYA','SOUTH PARK','THE EMBARCADERO','VIA BUFANO','VIA FERLINGHETTI']
    let located
    try {
      if (streetsWithoutTypes.includes(record.street)){
        located = SFLocator.findOne(record, {ignoreStreetType: true})
      } else {
        located = SFLocator.findOne(record)
      }

      if (located.message === 'Address not found method findOne') {
        located = SFLocator.searchByNeighbors(record)
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
      console.timeEnd('timer')
    })
}
