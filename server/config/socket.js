const socket_io = require('socket.io')
const server = require('../bin/www')

module.exports = app => socket_io.listen(server)
