const CACHE='amzn-tracker-v1';
const ASSETS=['./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
self.addEventListener('push',e=>{const data=e.data?e.data.json():{title:'底値アラート',body:'底値近くの商品があります！'};e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'./icon-192.png',badge:'./icon-192.png',tag:'price-alert',renotify:true,data:{url:'./'}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data.url||'./'));});
self.addEventListener('periodicsync',e=>{if(e.tag==='price-check')e.waitUntil(checkPrices());});
async function checkPrices(){const allClients=await clients.matchAll();if(allClients.length===0)await self.registration.showNotification('Amazon 底値トラッカー',{body:'今日の価格をチェックしましょう',icon:'./icon-192.png',tag:'daily-reminder'});}
