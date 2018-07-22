const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const transform = require('stream-transform')
const stringify = require('csv-stringify')

const Locator = require('./locator')
let SFLocator = new Locator(true)
SFLocator.checkZipFirst = false

// SFLocator.csvList('./data/realaddresses.csv')
// head -n 20 data/realaddresses.csv > data/somerealaddresses.csv
csvList('./data/somerealaddresses.csv')

/** @function csvList
 * @param {string} inputFile - path to csv
 * csv file must have columns "address, zipcode"
 */
function csvList (inputFile) {
  const basePath = path.dirname(inputFile)
  const baseFileName = path.basename(inputFile, '.csv')

  const outputFile = `${basePath}/${baseFileName}-output.csv`
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
    if (typeof located === 'object') {
      callback(null, located)
    } else {
      unmatchedstream.write(Object.assign(record, {err: located}))
      callback(null, null)
    }
  }, {parallel: 10})
  let stringifier = stringify({header: true})

  input
    .pipe(parser)
    .pipe(transformer)
    .pipe(stringifier)
    .pipe(output)
    .on('finish', () => {
      console.log(`saved to ${outputFile}`)
    })
}
