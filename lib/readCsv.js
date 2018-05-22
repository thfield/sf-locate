'use strict'
const fs = require('fs')
const parse = require('csv-parse/lib/sync')

module.exports = function (file) {
  let input = fs.readFileSync(file)
  let records = parse(input, {columns: true})
  return records
}
