export default function register() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(res => {
      console.log('注册成功')
    }).catch(res => {
      console.log('注册失败')
    })
  }
}