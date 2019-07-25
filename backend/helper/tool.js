module.exports = app => {
  const { userModel } = app.model

  return {
    // 获取用户的某个属性
    getUserProp: async (userName, key) => {
      const doc = await userModel.findOne({ userName }, { [key]: 1, _id: 0 })
      return doc && doc[key] ? doc[key] : ''
    },
    // 函数形式返回JSON, 兼容旧版API, res / data都代表结果
    response: (errno = 0, data = '', msg = '') => ({ errno, data, msg }),
    // 获取YYYY-MM-DD
    getDate: date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    // 获取HH:MM:SS
    getTime: date => `${date.getHours()}-${date.getMinutes() + 1}-${date.getSeconds()}`
  }
}
