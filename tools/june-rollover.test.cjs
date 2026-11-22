const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const json=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
function scope(seed={}){
  const store=new Map(Object.entries(seed));
  const context=vm.createContext({localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},window:{},document:{getElementById:()=>null},setTimeout,clearTimeout,console,URL,Date});
  vm.runInContext(source.slice(0,source.indexOf('function myConChangedFields')),context);
  return {context,store,run:code=>vm.runInContext(code,context)};
}

test('June data contains no old roster, celebrity schedules, paid links or floor assignments',()=>{
 for(const name of ['guests.json','schedule.json','panels.json','photo-ops.json','autograph-schedule.json','group-photo-ops.json','celebrity-pricing.json','vendors.json']) assert.deepEqual(json(name),[],name);
 const settings=json('settings.json')[0];assert.equal(settings.startDate,'2027-06-11');assert.equal(settings.endDate,'2027-06-13');assert.equal(settings.conventionId,'sfvc-2027-06');assert.equal(settings.photoShop,'');assert.equal(settings.photoOpsEnabled,false);
 const layout=json('map-layout.json')[0];assert.equal(layout.intentionalEmpty,true);assert.deepEqual(layout.locations,[]);assert.deepEqual(layout.elements,[]);
 assert.equal(json('map-settings.json')[0].published,false);assert.equal(json('map-settings.json')[0].directoryPublished,false);
 assert.equal(json('featured-sponsor.json')[0].enabled,false);assert.equal(json('next-event-ad.json')[0].mode,'off');
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(!/2026_October|OCTOBER 16|Tables D1-D7|TABLE D9/.test(html));
});

test('Current Event Guide uses verified June dates and excludes unannounced October activities',()=>{
 const events=json('events.json');assert.ok(events.every(e=>e.eventId==='sfvc-2027-06'));
 for(const id of ['shuttle','after-party','guest-panels']) assert.ok(!events.some(e=>e.id===id));
 const costume=JSON.stringify(events.find(e=>e.id==='costume-contest'));assert.match(costume,/Saturday, June 12/);assert.match(costume,/2:30-5:00 PM/);
 const trivia=JSON.stringify(events.find(e=>e.id==='trivia'));assert.match(trivia,/3:30-4:30 PM/);assert.match(trivia,/2:30-3:30 PM/);assert.ok(!trivia.includes('Panel Room 2'));
 assert.ok(!/Oct\.|October|D1-D7|Table D9/.test(JSON.stringify(events)));
});

test('Installed-app upgrade preserves legacy choices and registration but starts June My Con empty',()=>{
 const seed={'sfvc-favorites':'["old-guest"]','sfvc-my-schedule':'["old-event"]','sfvc-my-schedule-snapshots-v2':'{"old-event":{"title":"October event"}}','sfvc-my-con-guests-v1':'{"old-guest":{"name":"October guest"}}','sfvc-my-con-changes-v1':'{"event:old-event":{"message":"October change"}}','sfvc-app-registration-v1':'{"name":"Existing attendee"}','sfvc-reminder-minutes':'30','sfvc-push-enabled':'yes'};
 const {run,store}=scope(seed);
 assert.equal(run('state.favorites.size'),0);assert.equal(run('state.mySchedule.size'),0);assert.equal(run('Object.keys(savedScheduleSnapshots).length'),0);assert.equal(run('Object.keys(savedGuestSnapshots).length'),0);assert.equal(run('state.reminderMinutes'),30);
 run('state.mySchedule.add("june-event"); persistMyCon()');
 assert.equal(store.get('sfvc-2027-06:sfvc-my-schedule'),'["june-event"]');
 for(const [key,value] of Object.entries(seed))assert.equal(store.get(key),value,key);
});

test('Switching convention reloads only that convention and preserves both histories',()=>{
 const {run,store}=scope({'sfvc-my-schedule':'["october-item"]','sfvc-2027-06:sfvc-my-schedule':'["june-item"]'});
 assert.equal(run('JSON.stringify([...state.mySchedule])'),'["june-item"]');
 run('switchActiveConvention({conventionId:"sfvc-2026-10"})');
 assert.equal(run('JSON.stringify([...state.mySchedule])'),'["october-item"]');
 run('switchActiveConvention({conventionId:"sfvc-2027-06"})');
 assert.equal(run('JSON.stringify([...state.mySchedule])'),'["june-item"]');
 assert.equal(store.get('sfvc-my-schedule'),'["october-item"]');
});

test('Photo sales require a valid current URL and remain disabled despite stale settings links',()=>{
 const {run,context}=scope();
 vm.runInContext(source.slice(source.indexOf('function photoShopUrl(){'),source.indexOf('const screens =')),context);
 assert.equal(run('photoShopUrl()'),'');
 run('state.settings.photoShop="https://old.example/october";state.settings.photoOpsEnabled=false');assert.equal(run('photoShopUrl()'),'');
 run('state.settings.photoOpsEnabled=true;state.settings.photoShop="javascript:alert(1)"');assert.equal(run('photoShopUrl()'),'');
 run('state.settings.photoShop="https://tickets.example/june-2027"');assert.equal(run('photoShopUrl()'),'https://tickets.example/june-2027');
});

test('Remote account recovery cannot repopulate an unrelated convention or legacy October data',()=>{
 const {run,context}=scope();
 vm.runInContext(source.slice(source.indexOf('function applyRecoveredRegistrationState('),source.indexOf('const APP_REGISTRATION_LAST_SYNC_KEY')),context);
 vm.runInContext('function reminderScheduleItems(){return state.schedule};function eventDateTime(){return new Date("2027-06-12T16:00:00Z")};const SFVCScheduleTime={status:()=>({expired:false}),timing:()=>({})};function renderFavorites(){};function renderMySchedule(){};function renderNotificationCenter(){};function reconcileMyCon(){};',context);
 run('state.schedule=[{id:"same-id",title:"June event"}];');
 run('applyRecoveredRegistrationState({conventionId:"sfvc-2026-10",restoredSchedule:[{eventId:"same-id",title:"October event"}]})');assert.equal(run('state.mySchedule.size'),0);
 run('applyRecoveredRegistrationState({restoredSchedule:[{eventId:"same-id",title:"Unscoped October event"}]})');assert.equal(run('state.mySchedule.size'),0);
 run('applyRecoveredRegistrationState({conventionId:"sfvc-2027-06",restoredSchedule:[{eventId:"same-id",title:"June event",conventionId:"sfvc-2027-06"}]})');assert.equal(run('state.mySchedule.size'),1);
});

test('Program proxy forwards event filter and preserves authoritative event header',async()=>{
 const workerSource=fs.readFileSync(path.join(root,'worker.js'),'utf8');
 const worker=(await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'))).default;
 let incoming;
 const env={VENDOR_API:{fetch:async req=>{incoming=new URL(req.url);return new Response(JSON.stringify([{id:'v1',eventId:'sfvc-2027-06',photos:[]}]),{headers:{'Content-Type':'application/json','X-SFVC-Event-Id':'sfvc-2027-06'}})}}};
 const response=await worker.fetch(new Request('https://app.scifivalleycon.com/api/vendor-directory?eventId=sfvc-2027-06'),env);
 assert.equal(response.status,200);assert.equal(incoming.searchParams.get('eventId'),'sfvc-2027-06');assert.equal(response.headers.get('X-SFVC-Event-Id'),'sfvc-2027-06');
 assert.equal((await response.json())[0].eventId,'sfvc-2027-06');
 const invalid=await worker.fetch(new Request('https://app.scifivalleycon.com/api/vendor-directory?eventId=../x'),env);assert.equal(invalid.status,400);
});

test('Offline data recovery uses only this release cache, never an older event cache',async()=>{
 const listeners={},calls=[];let result;
 const context=vm.createContext({URL,Request,Response,Headers,console,fetch:async()=>{throw new Error('offline')},self:{location:{origin:'https://app.scifivalleycon.com'},addEventListener:(name,fn)=>listeners[name]=fn},caches:{open:async name=>({match:async request=>{calls.push({name,url:request.url});return new Response('[]',{headers:{'Content-Type':'application/json'}})}})},clients:{}});
 vm.runInContext(fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),context);
 listeners.fetch({request:new Request('https://app.scifivalleycon.com/data/guests.json?v=x'),respondWith:p=>result=p});
 const response=await result;assert.equal(response.headers.get('X-SFVC-Offline'),'1');assert.equal(await response.text(),'[]');assert.equal(calls.length,1);assert.equal(calls[0].name,'sfvc-program-june-2027-v4.119');
});
