const CACHE='amzn-v4';
self.addEventListener('install',function(e){
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return clients.claim(); })
  );
});
self.addEventListener('fetch',function(e){
  // キャッシュなし・常にネットワークから取得
  e.respondWith(fetch(e.request).catch(function(){ return caches.match(e.request); }));
});
self.addEventListener('push',function(e){
  var data=e.data?e.data.json():{title:'底値アラート',body:'底値近くの商品があります！'};
  e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'./icon-192.png',tag:'price-alert',renotify:true}));
});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
