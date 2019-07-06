const log = require('./log')
const auth = require('./auth')

module.exports = {
  ...log,
  ...auth,
}