/**
 * 应用配置, 包括:
 * 1. redis配置
 * 2. 上传文件路径配置
 * 3. mongodb配置
 * 4. jwt配置
 * 5. alioss配置
 * 6. 当前环境
 */

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  redis: {
    port: 6379,
    host: isProd ? process.env.BLOG_REDIS_HOST : '127.0.0.1',
    password: isProd ? process.env.BLOG_REDIS_PWD : ''
  },
  upload: {
    audio: isProd ? '/data/blob' : process.cwd(),
    img: isProd ? '/data/img/' : process.cwd(),
  },
  mongodb: {
    url: isProd ? 'mongodb://myMongoDB:27017/blog' : 'mongodb://127.0.0.1:27017/blog'
  },
  jwt: {
    secret: isProd ? process.env.JWT_SECRET : 'Calabash_Blog'
  },
  alioss: {
    region: 'oss-cn-beijing',
    bucket: 'calabash-static',
    accessKeyId: isProd ? process.env.ALI_ID : '',
    accessKeySecret: isProd ? process.env.ALI_SECRET: ''
  },
  isProd
}

