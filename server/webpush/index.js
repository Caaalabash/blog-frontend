const webpush = require('web-push')
const config = require('../config.js')

const vapidKeys = {
  publicKey: config.webpush.publicKey,
  privateKey: config.webpush.privateKey
}

webpush.setVapidDetails(
  config.webpush.mailto,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

module.exports = async function pushMessage(subscription,payload='Nothing',options={}){
  let subscriptionObj = JSON.parse(subscription)
  if(/^https:\/\/fcm/.test(subscriptionObj.endpoint)){
    return 'DO NOT SUPPORT GOOGLE'
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
