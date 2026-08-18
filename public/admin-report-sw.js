self.addEventListener("push",event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text?.()||""}}
  const proposed=(data&&typeof data.notification==="object")?data.notification:data;
  const title=proposed.title||data.title||"New Sci-Fi Valley Con attendee report";
  const body=proposed.body||data.body||"Open Program Admin for details.";
  const navigate=proposed.navigate||data.url||"/?section=reports";
  event.waitUntil(self.registration.showNotification(title,{body,tag:data.tag||"sfvc-attendee-report",renotify:true,data:{url:navigate}}));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();const target=new URL(event.notification?.data?.url||"/?section=reports",self.location.origin).href;
  event.waitUntil((async()=>{const windows=await clients.matchAll({type:"window",includeUncontrolled:true});for(const client of windows){if("focus" in client){await client.navigate(target).catch(()=>{});return client.focus()}}return clients.openWindow(target)})());
});
