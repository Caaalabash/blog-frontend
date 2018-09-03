const node_ssh = require('node-ssh')
const ssh = new node_ssh()

ssh.connect({
  host: '你的ip',
  username: '你的用户名',
  port:22,
  password:'你的密码'
}).then(async ()=>{
  await ssh.exec('rm -rf 你的路径')
  ssh.putDirectory('./dist', '你的路径').then(function() {
    console.log("The File thing is done")
  }, function(error) {
    console.log("Something's wrong")
    console.log(error)
  })
})
