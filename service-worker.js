const CACHE="sfvc-program-v4-74";
const LOCAL=[
  "./","./index.html","./styles.css","./app.js","./event-guide-ui.js","./tshirt-live-store.js","./manifest.webmanifest",
  "./data/guests.json","./data/schedule.json","./data/events.json","./data/vendors.json","./data/sponsors.json","./data/social-links.json","./data/tshirts.json","./data/faq.json","./data/hotels.json","./data/home-banner.json","./data/map-layout.json","./data/map-settings.json","./data/directions.json","./data/version.json","./data/settings.json","./data/celebrity-info.json","./data/celebrity-pricing.json","./data/photo-ops.json","./data/autograph-schedule.json","./data/group-photo-ops.json","./data/panels.json",
  "./assets/floor-plan.svg","./assets/icons/app-icon-192.png","./assets/icons/app-icon-512.png",
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

  const url=new URL(event.request.url);
  const isProgramData=url.origin===self.location.origin && url.pathname.includes("/data/") && url.pathname.endsWith(".json");

  if(isProgramData){
    event.respondWith((async()=>{
      try{
        const network=await fetch(event.request,{cache:"no-store"});
        if(network.ok){
          const copy=network.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        }
        return network;
      }catch{
        return (await caches.match(event.request,{ignoreSearch:true})) || new Response("[]",{
          status:200,
          headers:{"Content-Type":"application/json"}
        });
      }
    })());
    return;
  }

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

  const proposed=(data&&typeof data.notification==="object")?data.notification:data;
  const title=proposed.title||data.title||"Sci-Fi Valley Con";
  const body=proposed.body||data.body||"Convention update";
  let navigate=proposed.navigate||data.url||"./?screen=notifications";
  if(navigate==="./"||navigate==="/")navigate="./?screen=notifications";
  const tag=data.tag||"sfvc-update";

  const options={
    body,
    icon:"./assets/icons/app-icon-192.png",
    badge:"./assets/icons/app-icon-192.png",
    tag,
    renotify:true,
    data:{url:navigate}
  };

  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("pushsubscriptionchange",event=>{
  event.waitUntil((async()=>{
    try{
      let newSubscription=event.newSubscription;

      if(!newSubscription){
        const response=await fetch("https://notify.scifivalleycon.com/v1/public-key",{cache:"no-store"});
        if(!response.ok)return;
        const {publicKey}=await response.json();
        if(!publicKey)return;

        const padding="=".repeat((4-publicKey.length%4)%4);
        const base64=(publicKey+padding).replace(/-/g,"+").replace(/_/g,"/");
        const raw=atob(base64);
        const applicationServerKey=Uint8Array.from([...raw].map(ch=>ch.charCodeAt(0)));

        newSubscription=await self.registration.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey
        });
      }

      const oldEndpoint=event.oldSubscription?.endpoint;
      if(!oldEndpoint||!newSubscription)return;

      await fetch("https://notify.scifivalleycon.com/v1/subscription-change",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          oldEndpoint,
          subscription:newSubscription.toJSON()
        })
      });
    }catch(err){
      console.warn("Push subscription change sync failed",err);
    }
  })());
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
