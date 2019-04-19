module.exports = app => {
  const { chatModel } = app.model
  const { getUserProp, rsp } = app.helper
  /**
   * @description 早期对MongoDB操作不熟悉. 暂未重构
   */
  return {
    //增加聊天对象
    async addChatObj(req, res) {
      const user = req.body.user
      let data = await getUserProp(user, 'avatar')
      if(data) {
        return res.json(rsp(0, { to: user, avatar: data}, ''))
      }
      return res.json(rsp(1,'','没有该用户'))
    },
    //获取聊天列表
    async getChatList(req, res) {
      const user = req.query.user
      let doc = await chatModel.find({}, { _id: 0, chatid: 1 })
      if(doc){
        let list = doc.reduce((acc, item) => {
          if(item.chatid.includes(user)) acc.push(item.chatid)
          return acc
        }, [])
        let data = []
        let arr = [...new Set(list)]
        for(let n of arr){
          let [from, to] = n.split('_')
          let obj = from === user ? to : from
          let avatar = await getUserProp(obj, 'avatar')
          data.push({
            to: obj,
            avatar: avatar
          })
        }
        return res.json(rsp(0, data, ''))
      }
    },
    // 最近50条聊天记录
    getChatData(req, res){
      const chatid = req.query.chatid
      chatModel.find({ chatid }, { _id: 0, __v: 0 }, function(err, doc) {
        return res.json(rsp(0, doc.slice(-50), ''))
      })
    },
    // 文件上传
    uploadPic(req,res) {
      let path = `https://blog.calabash.top/${req.file.filename}`
      return res.json(rsp(0, path, ''))
    },
    // 语音上传
    uploadVoice(req,res){
      let path = `https://blog.calabash.top/${req.file.filename}`
      return res.json(rsp(0, path, ''))
    }
  }
}
