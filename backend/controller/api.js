const axios = require('axios')

module.exports = app => {
  const { articleModel, logModel } = app.model
  const { response, redisTool, getDate } = app.helper
  const { ipService } = app.app_config
  const ONE_DAY = 1000 * 60 * 60 * 24
  const TEN_MINUTES = 1000 * 60 * 10
  const TOTAL_VIEW_COUNT = 'total_view_count'

  return {
    async newVisitor(req, res) {
      const visitRecent = req.cookies['visit']
      const viewCount = visitRecent ? await redisTool.get(TOTAL_VIEW_COUNT) : await redisTool.incr(TOTAL_VIEW_COUNT)

      res.cookie('visit', 1, { maxAge: TEN_MINUTES })
      return res.json(response(0, viewCount, ''))
    },
    async analyzeBlogDate(req, res) {
      const doc = await articleModel.find({ 'author': 'Calabash' }, { blogDate: 1, _id: 0 })
      if (!doc) return res.json(response(1, '', '暂无文章'))

      const blogDateArr = doc.map(({ blogDate }) => blogDate.slice(8, 10))
      const timeMap = {}
      for(let date of blogDateArr){
        timeMap[date] ? timeMap[date]++ : timeMap[date] = 1
      }
      const data = Object.keys(timeMap).reduce((acc, key) => {
        acc.push({ value: timeMap[key], name: `${key}点` })
        return acc
      }, [])

      return res.json(response(0, data, ''))
    },
    async getPvLog(req, res) {
      const date = new Date().getTime()
      const list = []
      const data = []
      for (let i = 0; i < 10; i++) {
        const time = new Date(date - i * ONE_DAY)
        list.push(getDate(time))
      }
      const allPvLogs = await Promise.all(list.map(date => redisTool.getIpLog(date)))
      for (let eachDayLogs of allPvLogs) {
        const ipList = eachDayLogs.map(item => item.split('-')[0])
        data.push([...new Set(ipList)].length)
      }

      return res.json(response(0, data.reverse(), ''))
    },
    async insertLog(obj) {
      const shouldRecord = shouldRecordApi(obj.url, obj.method)
      if (shouldRecord) {
        obj.url = obj.url.split('?')[0]
        await logModel.create(obj)
      }
    },
    async getIP(req, res) {
      const date = req.query.date
      const IPLogs = await redisTool.getIpLog(date)

      const result = []
      // result数据结构为"ip-time-path"
      // 1. 取出所有ip并去重
      const ipList = [...new Set(IPLogs.reduce((acc, record) => {
        acc.push(record.split('-')[0])
        return acc
      }, []))]
      // 2. 通过第三方接口获取这些ip的地址
      const locationList = await Promise.all(
        ipList.map(ip => {
          return axios.get(`${ipService.path}?ip=${ip}`, {
            headers: {
              Authorization: ipService.token
            }
          })
        })
      )
      locationList.map(({ data }, index) => {
        const address = data.status === '1'
            ? `${data.province}-${data.city}`
            : `海外-海外`
        result.push({ ip: ipList[index], address, list: [] })
      })
      // 3. 分离出所有请求
      IPLogs.forEach(item => {
        const [ip, date, path] = item.split('-')
        const source = result.find(item => item.ip === ip)
        if (source) {
          source.list.push({ date, path })
        }
      })

      return res.json(response(0, result, ''))
    },
    async getLogByUrl(req, res) {
      let { url } = req.body
      if (url === '/api/v1/idea') url = /\/api\/v1\/ideas\/\d{14}/
      const list = await logModel.find({ url }, { _id: 0, __v: 0 })

      return res.json(response(0, list.slice(-50), ''))
    },
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
        const containChs = str => /[\u4e00-\u9fa5]/.test(str)
        const containEn = str => /[a-zA-Z]/.test(str)

        let result = []
        for (let i = 0, len = list.length; i < len; i++) {
          if (!containChs(list[i]) && !containEn(list[i])) {
            result.push(list[i])
          } else {
            const j = i + 1
            // 如果下一行全是英文, 当前行就不需要换行
            if (j < len && list[j] !== '' && !containChs[list[j]]) {
              result.push(list[i])
            } else {
              result.push(...list[i].split(/(.*[\u4e00-\u9fa5])/g).filter(Boolean))
            }
          }
        }
        data = result.map(row => row.trim()).join('\n')
      }
      return res.json(response(0, { content: data, deleteList: deleteList.join('\n') }, ''))
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
