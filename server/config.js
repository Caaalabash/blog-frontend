module.exports = {
  webpush: {
    publicKey: 'BGO_lp81VuXZtSNm4WMK6_lsyspLAtP7bEvjS-wVFw093ctm5QFIV0Jze2bKsFofQl1PrGd6jaCMW6AeXzLFlto',
    privateKey: 'dIt1TtlVJ4HrSkhXBl4A6t1BY1b8aA7vRpRv_3iwjLA',
    mailto: 'mailto:1121062986@qq.com'
  },
  redis: {
    port: 6379,
    host: process.env.NODE_ENV === 'production' ? '172.17.0.1' : '127.0.0.1',
    password: process.env.NODE_ENV === 'production' ? 'wangtian' : ''
  },
  upload: {
    audio: process.env.NODE_ENV === 'production' ? '/data/blob' : '',
    img: process.env.NODE_ENV === 'production' ? '/data/img/' : '',
  },
  mongodb: {
    url: process.env.NODE_ENV === 'production' ? 'mongodb://myMongoDB:27017/blog' : 'mongodb://127.0.0.1:27017/blog'
  }
}
