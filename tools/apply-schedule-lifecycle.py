from pathlib import Path
import json,subprocess,shutil
from datetime import datetime,timezone
ROOT=Path.cwd()
BASE='97471a2f41fdf544f8fd021ca7c071ad08c54e89'
for name in ['app.js','styles.css','index.html','service-worker.js','data/version.json']:
    assert (ROOT/name).read_bytes()==subprocess.check_output(['git','show',BASE+':'+name]), name+' changed since review'
def once(s,a,b):
 assert s.count(a)==1,(a[:100],s.count(a))
 return s.replace(a,b,1)
p=ROOT/'app.js';s=p.read_text()
s=once(s,'const APP_BUILD_VERSION="4.117";','''const APP_BUILD_VERSION="4.118";
let scheduleDefaultDateKey="";
let savedScheduleLifecycleTimer=null;
let savedScheduleLifecycleSignature="";''')
s=once(s,'  const changingScreens=currentId!==screenId;','''  const changingScreens=currentId!==screenId;
  if(screenId==="schedule" && updateScheduleDefaultDay({force:changingScreens&&!Number.isFinite(restoreScrollY)})){
    renderDayFilters();renderScheduleCategoryFilters();renderSchedule();
  }
  if(screenId==="home"||screenId==="settings")renderMySchedule();''')
s=once(s,'function renderDayFilters(){\n','''function updateScheduleDefaultDay({force=false,now=Date.now()}={}){
  const key=[state.settings.startDate,state.settings.endDate,SFVCScheduleTime.dateKey(now)].join("|");
  if(!force&&key===scheduleDefaultDateKey)return false;
  scheduleDefaultDateKey=key;
  const day=SFVCScheduleTime.defaultDay(state.settings,now);
  const changed=state.dayFilter!==day;
  state.dayFilter=day;
  return changed;
}

function renderDayFilters(){
  updateScheduleDefaultDay();
''')
s=once(s,'eventAt:eventDateTime(e)?.getTime()||null,remindable:e.remindable!==false};','eventAt:eventDateTime(e)?.getTime()||null,endAt:SFVCScheduleTime.timing(e,state.settings,state.events).endAt,endBasis:SFVCScheduleTime.timing(e,state.settings,state.events).basis,remindable:e.remindable!==false};')
s=once(s,'["day","time","endTime","eventAt"].includes(key)','["day","time","endTime","eventAt","endAt"].includes(key)')
s=once(s,'    id:`photoop-${p.id||i}`,\n    day:p.day,\n    time:p.time,','    id:`photoop-${p.id||i}`,\n    day:p.day,\n    time:p.time,\n    endTime:p.endTime||"",\n    durationMinutes:p.durationMinutes,')
start=s.index('function renderMySchedule(){');end=s.index('\nfunction updateCombinedSavedCount()',start)
s=s[:start]+'''function savedScheduleView(){
  const liveById=new Map(reminderScheduleItems().map(e=>[e.id,e]));
  return [...state.mySchedule].map(id=>{
    const live=liveById.get(id),snapshot=savedScheduleSnapshots[id];
    const event=live||snapshot;
    if(!event)return null;
    // Incomplete startup reads must never expire items using fallback event dates.
    const timing=live&&(myConCatalogReady||myConDataLoaded)
      ? SFVCScheduleTime.timing(live,state.settings,state.events)
      : {endAt:snapshot?.endAt??null,basis:snapshot?.endBasis||"unknown"};
    return {...event,_snapshot:!live,_endAt:timing.endAt,_endBasis:timing.basis};
  }).filter(Boolean);
}
function savedScheduleViewSignature(items,now){
  return JSON.stringify(items.map(e=>[e.id,e._endAt,SFVCScheduleTime.status(e._endAt,now)]));
}
function expireSavedScheduleItems(now=Date.now()){
  const expired=savedScheduleView().filter(e=>SFVCScheduleTime.status(e._endAt,now).expired);
  if(!expired.length)return 0;
  for(const event of expired){
    state.mySchedule.delete(event.id);
    delete savedScheduleSnapshots[event.id];
    delete myConChanges[`event:${event.id}`];
  }
  // Only personal saved-event state is removed. Guest favorites and the public
  // schedule, vendor profiles, photos, and reminder preference are untouched.
  localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));
  localStorage.setItem(MY_CON_CHANGES_KEY,JSON.stringify(myConChanges));
  saveScheduleSnapshots();
  return expired.length;
}
function queueSavedScheduleLifecycle(items=savedScheduleView(),now=Date.now()){
  clearTimeout(savedScheduleLifecycleTimer);
  if(document.visibilityState==="hidden")return;
  let delay=60000;
  for(const event of items){
    if(typeof event._endAt!=="number"||!Number.isFinite(event._endAt))continue;
    for(const boundary of [event._endAt,event._endAt+SFVCScheduleTime.RETENTION_MS]){
      if(boundary>now)delay=Math.min(delay,boundary-now);
    }
  }
  savedScheduleLifecycleTimer=setTimeout(refreshSavedScheduleLifecycle,Math.max(25,delay));
}
function refreshSavedScheduleLifecycle(){
  const now=Date.now();
  if(updateScheduleDefaultDay({now})){
    renderDayFilters();renderScheduleCategoryFilters();renderSchedule();
  }
  const items=savedScheduleView();
  if(savedScheduleViewSignature(items,now)!==savedScheduleLifecycleSignature)renderMySchedule();
  else queueSavedScheduleLifecycle(items,now);
}
function renderMySchedule(){
  const now=Date.now(),removed=expireSavedScheduleItems(now);
  const saved=savedScheduleView();
  savedScheduleLifecycleSignature=savedScheduleViewSignature(saved,now);
  queueSavedScheduleLifecycle(saved,now);
  if(removed){
    renderSchedule();renderCelebrityGuide();
    scheduleAllReminders();scheduleAnonymousDeviceSync();
  }
  saved.sort((a,b)=>{
    const da=eventDateTime(a)?.getTime()||Number.MAX_SAFE_INTEGER;
    const db=eventDateTime(b)?.getTime()||Number.MAX_SAFE_INTEGER;
    return da-db;
  });
  const preview=document.getElementById("schedulePreview"),list=document.getElementById("settingsScheduleList");
  updateCombinedSavedCount();
  if(!saved.length){
    if(preview)preview.innerHTML='<div class="muted-empty">Tap the bell on a schedule item to add it to My Schedule.</div>';
    if(list)list.innerHTML='<div class="muted-empty">Your saved schedule is empty.</div>';
    return;
  }
  const markup=saved.map(e=>{
    const ended=SFVCScheduleTime.status(e._endAt,now).ended;
    return `<div class="saved-schedule-item${e._snapshot?" saved-schedule-snapshot":""}${ended?" saved-event-completed":""}" data-saved-event="${escapeAppHtml(e.id)}" data-end-basis="${escapeAppHtml(e._endBasis)}">
      <div class="saved-event-details">
        <strong class="saved-event-title">${escapeAppHtml(e.title)}</strong>
        <div class="meta"><span class="saved-event-when">${escapeAppHtml(e.day)} [BULLET] ${escapeAppHtml(formatDisplayTimeRange(e.time,e.endTime))}</span> [BULLET] ${escapeAppHtml(e.location)}</div>
        ${ended?'<span class="saved-event-ended" role="status">This event is over</span>':""}
        ${myConChangeHtml("event",e.id)}
        ${e._snapshot?'<div class="saved-sync-note">REFRESHING CURRENT SCHEDULE[ELLIPSIS]</div>':""}
      </div>
      <button type="button" class="schedule-remove" data-remove-schedule="${escapeAppHtml(e.id)}" aria-label="Remove ${escapeAppHtml(e.title)}">[TIMES]</button>
    </div>`;
  }).join("");
  if(preview)preview.innerHTML=markup;
  if(list)list.innerHTML=markup;
  document.querySelectorAll("[data-remove-schedule]").forEach(button=>{
    button.addEventListener("click",()=>removeScheduleItem(button.dataset.removeSchedule));
  });
}
'''.replace('[BULLET]',chr(0x2022)).replace('[ELLIPSIS]',chr(0x2026)).replace('[TIMES]',chr(0xd7))+s[end:]
start=s.index('function eventDateTime(e){');end=s.index('\n',start)
s=s[:start]+'''function eventDateTime(e){
  const at=SFVCScheduleTime.startAt(e,state.settings);
  return Number.isFinite(at)?new Date(at):null;
}'''+s[end:]
s=once(s,'    if(!state.mySchedule.has(id)){state.mySchedule.add(id);changed++;}','''    const live=reminderScheduleItems().find(e=>e.id===id);
    if(live&&(myConCatalogReady||myConDataLoaded)&&SFVCScheduleTime.status(SFVCScheduleTime.timing(live,state.settings,state.events).endAt).expired)return;
    if(!state.mySchedule.has(id)){state.mySchedule.add(id);changed++;}''')
s=once(s,'initializeMyConSetup();','''// Browser timers pause while an app is closed. Re-check immediately on return,
// as well as at each end/expiry boundary while the app remains visible.
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible")refreshSavedScheduleLifecycle();
  else clearTimeout(savedScheduleLifecycleTimer);
});
window.addEventListener("pageshow",refreshSavedScheduleLifecycle);
window.addEventListener("focus",refreshSavedScheduleLifecycle);

initializeMyConSetup();''')
p.write_text(s)
p=ROOT/'index.html';s=p.read_text()
s=once(s,'styles.css?v=guest-weekend-20261007','styles.css?v=schedule-lifecycle-v4.118')
s=once(s,'  <script src="app.js?v=shuttle-static-v4.117"></script>','  <script src="schedule-time.js?v=4.118"></script>\n  <script src="app.js?v=schedule-lifecycle-v4.118"></script>')
p.write_text(s)
p=ROOT/'service-worker.js';s=p.read_text()
s=once(s,'const CACHE="sfvc-program-shuttle-static-v4.117";','const CACHE="sfvc-program-schedule-lifecycle-v4.118";')
s=once(s,'const LOCAL=[','const LOCAL=[\n  "./schedule-time.js",')
p.write_text(s)
p=ROOT/'data/version.json';d=json.loads(p.read_text());d.update(version='program-v4.118-schedule-lifecycle',generatedAt=datetime.now(timezone.utc).isoformat(),source='saved-event-expiry-and-current-day-default');p.write_text(json.dumps(d,indent=2)+'\n')
p=ROOT/'styles.css';p.write_text(p.read_text()+'''
/* V4.118: completed personal events remain readable and removable for two hours. */
:is(#schedulePreview,#settingsScheduleList) .saved-schedule-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid rgba(58,39,32,.22)}
:is(#schedulePreview,#settingsScheduleList) .saved-event-details{min-width:0;overflow-wrap:anywhere}
:is(#schedulePreview,#settingsScheduleList) .saved-event-completed :is(.saved-event-title,.saved-event-when){text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:currentColor}
:is(#schedulePreview,#settingsScheduleList) .saved-event-ended{display:inline-block;margin-top:6px;padding:4px 8px;border:1px solid var(--ink,#3a2720);border-radius:6px;background:var(--cream,#fff7df);color:var(--ink,#3a2720);font:700 12px/1.4 "Trebuchet MS",Arial,sans-serif;text-decoration:none}
:is(#schedulePreview,#settingsScheduleList) .schedule-remove{display:grid;place-items:center;flex-shrink:0;min-width:36px;min-height:36px;border:1.5px solid var(--ink,#3a2720);border-radius:50%;background:var(--paper2,#fff7df);color:var(--ink,#3a2720);font:700 22px/1 Arial,sans-serif;cursor:pointer}
:is(#schedulePreview,#settingsScheduleList) .schedule-remove:focus-visible{outline:3px solid var(--ink,#3a2720);outline-offset:3px}
''')
shutil.copyfile('tools/schedule-time-v4118.js','schedule-time.js')
print('Patched runtime and cache refresh markers only.')
