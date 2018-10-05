self.addEventListener('push', function (e) {
  let data = e.data
  if (e.data) {
    data = data.json();
    let {title,...option} = data
    console.log('push的数据为：', data);
    e.waitUntil(
      self.registration.showNotification(title,option)
    );
  } else {
    console.log('push没有任何数据');
  }
});

self.addEventListener('notificationclick',function(e){
  e.waitUntil(
    // examplePage 就是当前页面的 url
    clients.openWindow('/Calabash')
  );
})


