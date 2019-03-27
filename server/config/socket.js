const socket_io = require('socket.io')
const server = require('../bin/www')

module.exports = app => {
  if (!app.blog_extend) {
    return socket_io.listen(server)
  }
  return app.blog_extend.socket
}
