const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  redis: {
    port: 6379,
    host: isProd ? process.env.BLOG_REDIS_HOST : '127.0.0.1',
    password: isProd ? process.env.BLOG_REDIS_PWD : ''
  },
  upload: {
    audio: isProd ? '/data/blob' : '',
    img: isProd ? '/data/img/' : '',
  },
  mongodb: {
    url: isProd ? 'mongodb://myMongoDB:27017/blog' : 'mongodb://127.0.0.1:27017/blog'
  },
  jwt: {
    secret: isProd ? process.env.JWT_SECRET : 'Calabash_Blog'
  }
}

