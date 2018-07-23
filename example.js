console.time('timer')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const Locator = require('./locator')
let SFLocator = new Locator()
SFLocator.checkZipFirst = false

// head -n 20 data/realaddresses.csv > data/somerealaddresses.csv

// csvList('./data/somerealaddresses-unmatched.csv')
csvList('./data/somerealaddresses.csv')

/** @function csvList
 * @param {string} inputFile - path to csv
 * csv file must have columns "address, zipcode"
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
    let located = SFLocator.findOne(record)

    // TODO: refactor this into recursive function
    if (typeof located === 'object') {
      located.method = 'EAS match'
      callback(null, located)
    } else {
      if (located === 'Address not found') {
        let located = SFLocator.searchByNeighbors(record)
        if (typeof located === 'object') {
          located.method = 'Neighbor interpolation match'
          callback(null, located)
        } else {
          unmatchedstream.write(Object.assign({err: located}, record))
          callback(null, null)
        }
      } else {
        unmatchedstream.write(Object.assign({err: located}, record))
        callback(null, null)
      }
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
