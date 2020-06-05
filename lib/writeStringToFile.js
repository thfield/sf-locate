'use strict'
const fs = require('fs')

module.exports = function (file, data) {
  return fs.writeFileSync(file, data)
}
