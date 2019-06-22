module.exports = app => {
  const { articleModel, logModel } = app.model
  const { rsp, redisTool } = app.helper
  const ONE_DAY = 1000 * 60 * 60 * 24
  const TEN_MINUTES = 1000 * 60 * 10
  const TOTAL_VIEW_COUNT = 'total_view_count'

  return {
    // 新访问者
    async newVisitor(req, res) {
      const visitRecent = req.cookies['visit']
      const viewCount = visitRecent ? await redisTool.getValue(TOTAL_VIEW_COUNT) : await redisTool.increment(TOTAL_VIEW_COUNT)

      res.cookie('visit', 1, { maxAge: TEN_MINUTES })
      return res.json(rsp(0, viewCount, ''))
    },
    // 分析文章发布时间
    async analyzeBlogDate(req, res) {
      const doc = await articleModel.find({ 'author': 'Calabash' }, { blogDate: 1, _id: 0 })
      if (!doc) return res.json(rsp(1, '', '暂无文章'))

      const blogDateArr = doc.map(({ blogDate }) => blogDate.slice(8, 10))
      const timeMap = {}
      for(let date of blogDateArr){
        timeMap[date] ? timeMap[date]++ : timeMap[date] = 1
      }
      const data = Object.keys(timeMap).reduce((acc, key) => {
        acc.push({ value: timeMap[key], name: `${key}点` })
        return acc
      }, [])

      return res.json(rsp(0, data, ''))
    },
    // 最近十天访问量
    async getPvLog(req, res) {
      // 组装一个连续10天的日期数组 ['2019-1-1', '2019-1-2', ...]
      const date = new Date().getTime()
      const list = []
      const data = []
      // 索引靠前, 日期越大
      for (let i = 0; i < 10; i++) {
        const time = new Date(date - i * ONE_DAY).toLocaleString('zh').split(' ')[0].replace(/\//g, '-')
        list.push(time)
      }
      // PVLog中每一条数据格式为: 访问Ip-访问时间-请求路径
      const allPvLogs = await Promise.all(list.map(date => redisTool.getIpLog(date)))
      for (let eachDayLogs of allPvLogs) {
        const ipList = eachDayLogs.map(item => item.split('-')[0])
        data.push([...new Set(ipList)].length)
      }

      return res.json(rsp(0, data.reverse(), ''))
    },
    // 记录接口数据到数据库
    async insertLog(obj) {
      const shouldRecord = shouldRecordApi(obj.url, obj.method)
      if (shouldRecord) {
        obj.url = obj.url.split('?')[0]
        await logModel.create(obj)
      }
    },
    // 获取指定接口的访问时长记录
    async getLogByUrl(req, res) {
      let { url } = req.body
      if (url === '/api/v1/idea') url = /\/api\/v1\/ideas\/\d{14}/
      const list = await logModel.find({ url }, { _id: 0, __v: 0 })

      return res.json(rsp(0, list.slice(-50), ''))
    },
    // 处理女朋友的正则需求
    async sendMyLove(req,res) {
      const { type, content } = req.body
      const list = content.split(/\n/)
      const REMOVE_N = '1'
      const UPPERCASE = '2'
      const CONCAT = '3'
      const splitEnglish = '4'
      let data = ''
      let deleteList = []
      // 去除/N
      if (type === REMOVE_N) {
        data = list.map(item => {
          const shouldProcess = /\\N\\N.*\\N/.test(item)
          if (shouldProcess) {
            item = item.replace(/\\N\\N.{3,}?\\N/g, match => {
              deleteList.push(match)
              return ' '
            })
          }
          return item
        }).join('\n')
      }
      // 首字母大写,加句号
      if (type === UPPERCASE) {
        data = list.map(item => {
          item = item.trim()
          // 该行是否含有英文字母
          const shouldProcess = /[a-zA-Z]/.test(item)
          if (!shouldProcess) return item
          //是否是小写字母开头:)
          deleteList.push(item)
          const isStartWithWord = /^[a-z]/.test(item)

          return isStartWithWord
            ? `${item[0].toUpperCase()}${item.slice(1)}.`
            : `${item}.`
        }).join('\n')
      }
      // 去除空行加语句拼接
      if (type === CONCAT) {
        let noEmptyRow = list.filter(item => item.trim() !== '')
        for (let n of noEmptyRow) {
          if(/^[a-z]/.test(n)){
            data += ` ${n}`
          } else {
            data += `\n${n}`
          }
        }
      }
      // 中英文换行
      if (type === splitEnglish) {
        data = list.map(row => {
          // 不转换不包含中文的数据
          if (!/[\u4e00-\u9fa5]/.test(row)) return row
          return row.replace(/(.*[\u4e00-\u9fa5])/g, '$1\n')
        }).map(row => row.trim()).join('\n')
      }
      return res.json(rsp(0, { content: data, deleteList: deleteList.join('\n') }, ''))
    }
  }
}

/**
 * 是否需要记录该IP地址
 * @param {string} url 请求地址
 * @param {string} method 请求方法
 * @return {boolean} 是否应当记录
 */
function shouldRecordApi(url, method) {
  if (!/^\/api/.test(url)) return false

  const row = [url.split('?')[0], method].join('-')
  const extraRule = /\/api\/v1\/ideas\/\d{14}-GET/
  const rules = [
    '/api/v1/login-POST',
    '/api/v1/checkStatus-POST',
    '/api/v1/userinfo-GET',
    '/api/v1/ideas-GET',
    '/api/v1/comment-POST',
    '/api/v1/like-POST',
  ]

  return rules.includes(row) || extraRule.test(row)
}
