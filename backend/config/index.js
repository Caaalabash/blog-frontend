/**
 * 应用配置, 包括:
 * 1. redis配置
 * 2. 上传文件路径配置
 * 3. mongodb配置
 * 4. session secret
 * 5. alioss配置
 * 6. OSS上传路径配置
 * 7. 当前环境
 */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  redis: {
    port: 6379,
    host: isProd ? 'dockerhost' : '127.0.0.1',
    password: isProd ? process.env.BLOG_REDIS_PWD : ''
  },
  upload: {
    audio: isProd ? '/data/blob' : process.cwd(),
    img: isProd ? '/data/img/' : process.cwd(),
  },
  mongodb: {
    url: isProd ? 'mongodb://dockerhost:27017/blog' : 'mongodb://127.0.0.1:27017/blog'
  },
  sessionSecret: isProd ? process.env.JWT_SECRET : 'Calabash_Blog',
  alioss: {
    region: 'oss-cn-beijing',
    bucket: 'calabash-static',
    accessKeyId: isProd ? process.env.ALI_ID : '',
    accessKeySecret: isProd ? process.env.ALI_SECRET: ''
  },
  ossPath: {
    host: 'https://static.calabash.top',
    filePath: '/blog-media/file',
    avatarPath: '/blog-media/avatar',
    audioPath: '/blog-media/audio'
  },
  ipService: {
    path: 'http://iploc.market.alicloudapi.com/v3/ip',
    token: `APPCODE ${process.env.IP_SERVICE_TOKEN}`
  },
  isProd
}

