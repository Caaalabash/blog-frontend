const webpush = require('web-push')
const initProxy = require('../lib/getProxy')

const vapidKeys = {
  publicKey:'BGO_lp81VuXZtSNm4WMK6_lsyspLAtP7bEvjS-wVFw093ctm5QFIV0Jze2bKsFofQl1PrGd6jaCMW6AeXzLFlto',
  privateKey:'dIt1TtlVJ4HrSkhXBl4A6t1BY1b8aA7vRpRv_3iwjLA'
}

webpush.setVapidDetails(
  'mailto:1121062986@qq.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)


module.exports = async function pushMessage(subscription,payload='Nothing',options={}){
  let subscriptionObj = JSON.parse(subscription)
  if(/^https:\/\/fcm/.test(subscriptionObj.endpoint)){
    await initProxy()
    options.proxy = 'http://127.0.0.1:1080'
  }
  return webpush.sendNotification(subscriptionObj,payload,options)
    .then((data)=>{
      console.log(data)
      return true
    })
    .catch((err)=>{
      console.log('err'+err)
      return subscription
    })

}
