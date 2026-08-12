const CACHE="sfvc-program-v3";
const LOCAL=[
  "./","./index.html","./styles.css","./app.js","./manifest.webmanifest",
  "./data/guests.json","./data/schedule.json","./data/events.json","./data/vendors.json",
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
