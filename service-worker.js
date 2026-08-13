const CACHE="sfvc-program-v3-8-4";
const LOCAL=[
  "./","./index.html","./styles.css","./app.js","./manifest.webmanifest",
  "./data/guests.json","./data/schedule.json","./data/events.json","./data/vendors.json","./data/settings.json","./data/celebrity-info.json","./data/celebrity-pricing.json","./data/photo-ops.json","./data/autograph-schedule.json","./data/group-photo-ops.json","./data/panels.json",
  "./assets/icons/app-icon-192.png","./assets/icons/app-icon-512.png",
  "./assets/icons/app-icon-maskable-512.png","./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(LOCAL)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html")))
  );
});

self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text?.()||""}}
  const title=data.title||"Sci-Fi Valley Con";
  const options={
    body:data.body||"Convention update",
    icon:"./assets/icons/app-icon-192.png",
    badge:"./assets/icons/app-icon-192.png",
    tag:data.tag||"sfvc-update",
    renotify:true,
    data:{url:data.url||"./"}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=new URL(event.notification?.data?.url||"./",self.location.origin).href;
  event.waitUntil((async()=>{
    const windows=await clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of windows){
      if("focus" in client){
        await client.navigate(target).catch(()=>{});
        return client.focus();
      }
    }
    return clients.openWindow(target);
  })());
});
