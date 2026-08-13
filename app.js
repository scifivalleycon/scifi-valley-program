const DEFAULT_SETTINGS = {
  eventName: "Sci-Fi Valley Con",
  editionLabel: "FALL 2026",
  startDate: "2026-10-16",
  endDate: "2026-10-18",
  venue: "Blair County Convention Center",
  city: "Altoona",
  state: "PA",
  photoShop: "https://checkout.conventions.leapevent.tech/eh/2026_October_Sci_Fi_Valley_Con_Photo_Ops"
};

const state = {
  guests: [], schedule: [], events: [], settings: {...DEFAULT_SETTINGS}, celebrityInfo: {}, celebrityPricing: [], photoOps: [], autographs: [], groupPhotoOps: [], panels: [], celebrityTab:"prices", celebrityPhotoDay:"Friday", celebrityPanelDay:"Friday",
  guestFilter: "All", dayFilter: "Friday", eventFilter: "All",
  favorites: new Set(JSON.parse(localStorage.getItem("sfvc-favorites") || "[]")), mySchedule: new Set(JSON.parse(localStorage.getItem("sfvc-my-schedule") || "[]")), reminderMinutes: Number(localStorage.getItem("sfvc-reminder-minutes") ?? 15), reminderTimers: new Map()
};

const PHOTO_SHOP = "https://checkout.conventions.leapevent.tech/eh/2026_October_Sci_Fi_Valley_Con_Photo_Ops";
const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll(".nav-button")];

function goTo(screenId){
  screens.forEach(s=>s.classList.toggle("active",s.id===screenId));
  navButtons.forEach(b=>b.classList.toggle("active",b.dataset.screen===screenId));
  window.scrollTo({top:0,behavior:"smooth"});
}
navButtons.forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.screen)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.go)));

async function loadData(){
  const safeJson=(url,fallback=[])=>fetch(url).then(r=>r.ok?r.json():fallback).catch(()=>fallback);
  const [guests,schedule,events,settingsData,celebrityInfo,celebrityPricing,photoOps,autographs,groupPhotoOps,panels]=await Promise.all([
    safeJson("data/guests.json"),safeJson("data/schedule.json"),safeJson("data/events.json"),safeJson("data/settings.json"),
    safeJson("data/celebrity-info.json"),safeJson("data/celebrity-pricing.json"),safeJson("data/photo-ops.json"),
    safeJson("data/autograph-schedule.json"),safeJson("data/group-photo-ops.json"),safeJson("data/panels.json")
  ]);
  const savedSettings=Array.isArray(settingsData)&&settingsData[0]?settingsData[0]:{};
  state.settings={...DEFAULT_SETTINGS,...savedSettings};
  state.guests=guests;
  state.schedule=schedule.map((e,i)=>({...e,id:e.id||`schedule-${e.day}-${e.time}-${i}`}));
  state.events=events;
  state.celebrityInfo=Array.isArray(celebrityInfo)&&celebrityInfo[0]?celebrityInfo[0]:{};
  state.celebrityPricing=Array.isArray(celebrityPricing)?celebrityPricing:[];
  state.photoOps=Array.isArray(photoOps)?photoOps:[];
  state.autographs=Array.isArray(autographs)?autographs:[];
  state.groupPhotoOps=Array.isArray(groupPhotoOps)?groupPhotoOps:[];
  state.panels=Array.isArray(panels)?panels:[];
  renderAll();
}


function parseISODate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||"")))return null;
  const [y,m,d]=value.split("-").map(Number);
  return new Date(y,m-1,d,12,0,0);
}
function addDaysISO(value,days){
  const date=parseISODate(value);
  if(!date)return "";
  date.setDate(date.getDate()+days);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function formatEventDateRange(compact=false){
  const start=parseISODate(state.settings.startDate), end=parseISODate(state.settings.endDate);
  if(!start||!end)return compact?"EVENT DATES TBD":"EVENT DATES TBD";
  const monthLong=new Intl.DateTimeFormat("en-US",{month:"long"});
  const monthShort=new Intl.DateTimeFormat("en-US",{month:"short"});
  const sm=(compact?monthShort:monthLong).format(start).toUpperCase();
  const em=(compact?monthShort:monthLong).format(end).toUpperCase();
  const sd=start.getDate(), ed=end.getDate(), sy=start.getFullYear(), ey=end.getFullYear();
  if(sy===ey&&start.getMonth()===end.getMonth())return `${sm} ${sd}–${ed}, ${sy}`;
  if(sy===ey)return `${sm} ${sd} – ${em} ${ed}, ${sy}`;
  return `${sm} ${sd}, ${sy} – ${em} ${ed}, ${ey}`;
}
function eventDayDates(){
  return {
    Friday: state.settings.startDate,
    Saturday: addDaysISO(state.settings.startDate,1),
    Sunday: addDaysISO(state.settings.startDate,2)
  };
}
function eventLocationText(){
  return [state.settings.venue,[state.settings.city,state.settings.state].filter(Boolean).join(", ")].filter(Boolean).join(" • ");
}
function applyEventSettings(){
  const eventName=(state.settings.eventName||"Sci-Fi Valley Con").toUpperCase();
  const topbarName=document.getElementById("topbarEventName");
  if(topbarName)topbarName.textContent=eventName;

  const compactDates=formatEventDateRange(true);
  const fullDates=formatEventDateRange(false);
  const cityState=[state.settings.city,state.settings.state].filter(Boolean).join(", ").toUpperCase();

  const meta=document.getElementById("topbarEventMeta");
  if(meta)meta.textContent=[compactDates,cityState].filter(Boolean).join(" • ");

  const heroDates=document.getElementById("heroEventDates");
  if(heroDates)heroDates.textContent=fullDates;

  const guestDates=document.getElementById("guestEventDates");
  if(guestDates)guestDates.textContent=fullDates;

  const heroLocation=document.getElementById("heroEventLocation");
  if(heroLocation)heroLocation.textContent=eventLocationText();

  if(state.settings.photoShop){
    document.querySelectorAll("[data-photo-shop]").forEach(a=>a.href=state.settings.photoShop);
  }
}

function renderGuestFilters(){
  const filters=["All",...new Set(state.guests.map(g=>g.group))];
  const c=document.getElementById("guestFilters");
  c.innerHTML=filters.map(f=>`<button class="chip ${f===state.guestFilter?"active":""}" data-guest-filter="${f}">${f.toUpperCase()}</button>`).join("");
  c.querySelectorAll("[data-guest-filter]").forEach(b=>b.addEventListener("click",()=>{
    state.guestFilter=b.dataset.guestFilter; renderGuestFilters(); renderGuests();
  }));
}

function guestPhoto(g, cls="guest-photo"){
  return g.photo
    ? `<img class="${cls}" src="${g.photo}" alt="${g.name}" loading="lazy">`
    : `<div class="${cls==="guest-photo"?"guest-placeholder":"modal-photo-placeholder"}">${g.name}</div>`;
}

function renderGuests(){
  const q=document.getElementById("guestSearch").value.trim().toLowerCase();
  const matches=state.guests.filter(g=>{
    const filter=state.guestFilter==="All"||g.group===state.guestFilter;
    const hay=`${g.name} ${g.group} ${g.character||""} ${g.knownFor||""} ${g.bio||""}`.toLowerCase();
    return filter&&hay.includes(q);
  });
  document.getElementById("guestList").innerHTML=matches.map(g=>`
    <article class="guest-card">
      <div class="guest-image-wrap">${guestPhoto(g)}</div>
      <div>
        <div class="guest-topline">
          <div><span class="tag">${g.group.toUpperCase()}</span><h3>${g.name.toUpperCase()}</h3></div>
          <button class="favorite ${state.favorites.has(g.id)?"saved":""}" data-favorite="${g.id}" aria-label="Save ${g.name}">${state.favorites.has(g.id)?"♥":"♡"}</button>
        </div>
        <div class="guest-sub">${g.character||""}<br>${g.knownFor}</div>
        <div class="price-row">${g.photoOp?`<span class="price">PHOTO OP ${g.photoOp}</span>`:""}<span class="price">FULL BIO</span></div>
        <button class="guest-open" data-open-guest="${g.id}">VIEW GUEST DETAILS ›</button>
      </div>
    </article>`).join("") || `<div class="paper-panel muted-empty">No guests match that search.</div>`;
  document.querySelectorAll("[data-favorite]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();toggleFavorite(b.dataset.favorite)}));
  document.querySelectorAll("[data-open-guest]").forEach(b=>b.addEventListener("click",()=>openGuest(b.dataset.openGuest)));
  bindGuestPhotoLightboxes();
}

function toggleFavorite(id){
  state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
  localStorage.setItem("sfvc-favorites",JSON.stringify([...state.favorites]));
  renderGuests(); renderFavorites();
}

function renderFavorites(){
  const guests=state.guests.filter(g=>state.favorites.has(g.id));
  updateCombinedSavedCount();
  const c=document.getElementById("favoritePreview");
  if(!guests.length){c.className="stack muted-empty";c.innerHTML="Tap the heart on a guest to save them here.";return;}
  c.className="stack";
  c.innerHTML=guests.slice(0,6).map(g=>`<button class="status-card" data-home-guest="${g.id}" style="text-align:left"><strong>${g.name.toUpperCase()}</strong><div class="meta">${g.group}${g.photoOp?` • Photo Op ${g.photoOp}`:""}</div></button>`).join("");
  c.querySelectorAll("[data-home-guest]").forEach(b=>b.addEventListener("click",()=>openGuest(b.dataset.homeGuest)));
}

function openGuest(id){
  const g=state.guests.find(x=>x.id===id); if(!g)return;
  const external=g.imdb?`<a class="secondary-action" href="${g.imdb}" target="_blank" rel="noopener">IMDb PAGE ↗</a>`:
    g.instagram?`<a class="secondary-action" href="${g.instagram}" target="_blank" rel="noopener">INSTAGRAM ↗</a>`:"";
  const photoAction=g.photoShop?`<a class="full-action" href="${g.photoShop}" target="_blank" rel="noopener">ORDER ${g.name.toUpperCase()} PHOTO OP${g.photoOp?` • ${g.photoOp}`:""} ↗</a>`:
    `<a class="full-action" href="${state.settings.photoShop||PHOTO_SHOP}" target="_blank" rel="noopener">BROWSE CELEBRITY PHOTO OPS ↗</a>`;
  document.getElementById("guestModalContent").innerHTML=`
    <div class="modal-inner">
      <div class="modal-hero">
        ${guestPhoto(g,"modal-guest-photo").replace('class="modal-guest-photo"','class="modal-guest-photo"')}
        <div><span class="tag">${g.group.toUpperCase()}</span><h2>${g.name.toUpperCase()}</h2><div class="modal-known">${g.character||""}<br><b>Known for:</b> ${g.knownFor}</div>${g.photoOp?`<div class="price-row"><span class="price">PRO PHOTO OP ${g.photoOp}</span></div>`:""}</div>
      </div>
      <div class="modal-bio">${g.bio}</div>
      <div class="modal-actions">${external}<a class="primary-action" href="https://scifivalleycon.com/celebrity-guests" target="_blank" rel="noopener">OFFICIAL GUEST PAGE ↗</a>${photoAction}</div>
    </div>`;
  const modal=document.getElementById("guestModal");
  if(typeof modal.showModal==="function") modal.showModal(); else modal.setAttribute("open","");
  bindGuestPhotoLightboxes();
}

document.getElementById("closeGuestModal").addEventListener("click",()=>document.getElementById("guestModal").close());
document.getElementById("guestModal").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});


function celebrityPublished(){return state.celebrityInfo?.published===true}
function panelScheduleItems(){
  if(!celebrityPublished())return [];
  return state.panels.map((p,i)=>({id:`panel-${p.id||i}`,day:p.day,time:p.startTime,title:p.title,location:p.location||state.celebrityInfo.panelRoom||"Panel Room",category:"Celebrity Panel"}));
}
function photoOpScheduleItems(){
  if(!celebrityPublished())return [];
  return state.photoOps.map((p,i)=>({id:`photoop-${p.id||i}`,day:p.day,time:p.time,title:`${p.title} Photo Op`,location:state.celebrityInfo.photoOpLocation||"Photo Op Area",category:`Professional Photo Op${p.type?` • ${p.type}`:""}`}));
}
function generalScheduleItems(){return [...state.schedule,...panelScheduleItems()]}
function reminderScheduleItems(){return [...generalScheduleItems(),...photoOpScheduleItems()]}
function scheduleCardHtml(e){
  const saved=state.mySchedule.has(e.id);
  return `<article class="schedule-card"><div class="schedule-time">${e.time}</div><div><strong>${e.title.toUpperCase()}</strong><div class="meta">${e.location} • ${e.category}</div>${saved&&state.reminderMinutes>0?`<span class="schedule-reminder-label">🔔 ${formatReminder(state.reminderMinutes)}</span>`:""}</div><button class="schedule-save ${saved?"saved":""}" data-schedule-save="${e.id}">${saved?"🔔":"♡"}</button></article>`;
}
function bindScheduleSaveButtons(){
  document.querySelectorAll("[data-schedule-save]").forEach(b=>{if(b.dataset.bound==="yes")return;b.dataset.bound="yes";b.addEventListener("click",()=>toggleScheduleItem(b.dataset.scheduleSave))});
}
function renderCelebrityGuide(){
  const published=celebrityPublished();
  document.getElementById("celebrityUnpublished")?.classList.toggle("hidden",published);
  document.getElementById("celebrityPublished")?.classList.toggle("hidden",!published);
  if(!published)return;
  document.getElementById("celebrityStatusNotice").textContent=state.celebrityInfo.statusNotice||"Celebrity information is subject to change.";
  renderCelebrityTabs();renderCelebrityPrices();renderCelebrityPhotoOps();renderCelebrityAutographs();renderCelebrityPanels();
}
function renderCelebrityTabs(){
  document.querySelectorAll("[data-celebrity-tab]").forEach(b=>b.classList.toggle("active",b.dataset.celebrityTab===state.celebrityTab));
  const ids={prices:"celebrityPricesPanel",photoops:"celebrityPhotoOpsPanel",autographs:"celebrityAutographsPanel",panels:"celebrityPanelsPanel"};
  Object.entries(ids).forEach(([k,id])=>document.getElementById(id)?.classList.toggle("hidden",k!==state.celebrityTab));
}
function renderCelebrityPrices(){
  document.getElementById("celebrityPricingList").innerHTML=state.celebrityPricing.map(p=>`<article class="price-card"><div class="price-card-name">${p.guestName.toUpperCase()}</div><div class="price-grid"><div><small>AUTOGRAPH</small><strong>${p.autograph||"TBD"}</strong></div><div><small>SELFIE</small><strong>${p.selfie||"TBD"}</strong></div><div><small>COMBO</small><strong>${p.combo||"TBD"}</strong></div><div><small>PRO PHOTO</small><strong>${p.proPhoto||"TBD"}</strong></div></div>${p.notes?`<div class="price-note">${p.notes}</div>`:""}</article>`).join("")||`<div class="paper-panel muted-empty">Guest pricing has not been published yet.</div>`;
  document.getElementById("groupPhotoOpList").innerHTML=state.groupPhotoOps.map(g=>`<article class="group-op-card"><span class="tag">PHOTO OP</span><h3>${g.title.toUpperCase()}</h3><p>${g.participants}</p><strong>${g.price||"TBD"}</strong>${g.notes?`<small>${g.notes}</small>`:""}</article>`).join("")||`<div class="muted-empty">No group photo ops currently listed.</div>`;
  document.getElementById("celebrityGeneralNote").textContent=state.celebrityInfo.generalNote||"";
}
function renderCelebrityPhotoOps(){
  const info=state.celebrityInfo;
  document.getElementById("photoOpInfo").innerHTML=`<span class="section-kicker">PROFESSIONAL PHOTO OPS</span><h2>PHOTO OP INFORMATION</h2><p><strong>Line up ${info.photoOpLineupMinutes||15} minutes before your scheduled time.</strong></p><p>${info.photoOpNotice||""}</p><p><strong>${info.photoOpLocation||"Photo Op Area"}</strong>${info.photoOpLocationDetail?` • ${info.photoOpLocationDetail}`:""}${info.photoOpUpdatePoint?`<br>Updates: ${info.photoOpUpdatePoint}`:""}</p>`;
  const days=["Friday","Saturday","Sunday"], filters=document.getElementById("photoOpDayFilters");
  filters.innerHTML=days.map(d=>`<button class="chip ${d===state.celebrityPhotoDay?"active":""}" data-photo-day="${d}">${d.toUpperCase()}</button>`).join("");
  filters.querySelectorAll("[data-photo-day]").forEach(b=>b.addEventListener("click",()=>{state.celebrityPhotoDay=b.dataset.photoDay;renderCelebrityPhotoOps()}));
  document.getElementById("photoOpList").innerHTML=photoOpScheduleItems().filter(e=>e.day===state.celebrityPhotoDay).map(scheduleCardHtml).join("")||`<div class="paper-panel muted-empty">No photo ops listed for this day.</div>`;
  bindScheduleSaveButtons();
}
function renderCelebrityAutographs(){
  document.getElementById("autographInfo").textContent=state.celebrityInfo.autographNotice||"Autograph availability is flexible and subject to change.";
  document.getElementById("autographList").innerHTML=state.autographs.map(a=>`<article class="autograph-card"><h3>${a.guestName.toUpperCase()}</h3><div class="autograph-days">${["Friday","Saturday","Sunday"].map(d=>`<div><small>${d.toUpperCase()}</small><p>${String(a[d]||"TBD").replace(/\n/g,"<br>")}</p></div>`).join("")}</div></article>`).join("")||`<div class="paper-panel muted-empty">Autograph availability has not been published yet.</div>`;
}
function renderCelebrityPanels(){
  const info=state.celebrityInfo;
  document.getElementById("panelInfo").innerHTML=`<span class="section-kicker">CELEBRITY Q&amp;A</span><h2>${(info.panelRoom||"CELEBRITY PANELS").toUpperCase()}</h2><p>${info.panelNotice||""}</p>${info.panelSeatingNote?`<p><strong>${info.panelSeatingNote}</strong></p>`:""}`;
  const days=["Friday","Saturday","Sunday"], filters=document.getElementById("panelDayFilters");
  filters.innerHTML=days.map(d=>`<button class="chip ${d===state.celebrityPanelDay?"active":""}" data-panel-day="${d}">${d.toUpperCase()}</button>`).join("");
  filters.querySelectorAll("[data-panel-day]").forEach(b=>b.addEventListener("click",()=>{state.celebrityPanelDay=b.dataset.panelDay;renderCelebrityPanels()}));
  const records=state.panels.filter(p=>p.day===state.celebrityPanelDay);
  document.getElementById("panelList").innerHTML=records.map((p,i)=>{const e=panelScheduleItems().find(x=>x.id===`panel-${p.id||i}`),saved=e&&state.mySchedule.has(e.id);return `<article class="celebrity-panel-card"><div class="panel-card-head"><div><span class="panel-time">${p.startTime}${p.endTime?`–${p.endTime}`:""}</span><h3>${p.title}</h3></div>${e?`<button class="schedule-save ${saved?"saved":""}" data-schedule-save="${e.id}">${saved?"🔔":"♡"}</button>`:""}</div><div class="meta">${p.location||info.panelRoom||""}${p.participants?` • ${p.participants}`:""}</div>${p.description?`<p>${p.description}</p>`:""}</article>`}).join("")||`<div class="paper-panel muted-empty">No celebrity panels listed for this day.</div>`;
  bindScheduleSaveButtons();
}

function renderDayFilters(){
  const days=["Friday","Saturday","Sunday"];
  const c=document.getElementById("dayFilters");
  c.innerHTML=days.map(d=>`<button class="chip ${d===state.dayFilter?"active":""}" data-day="${d}">${d.toUpperCase()}</button>`).join("");
  c.querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{state.dayFilter=b.dataset.day;renderDayFilters();renderSchedule()}));
}
function renderSchedule(){const items=generalScheduleItems().filter(e=>e.day===state.dayFilter);document.getElementById("scheduleList").innerHTML=items.map(scheduleCardHtml).join("");bindScheduleSaveButtons();}


function formatReminder(m){if(m===0)return"No reminder";if(m===60)return"1 hour before";return`${m} minutes before`}
function toggleScheduleItem(id){state.mySchedule.has(id)?state.mySchedule.delete(id):state.mySchedule.add(id);localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));renderSchedule();renderCelebrityGuide();renderMySchedule();scheduleAllReminders()}
function removeScheduleItem(id){state.mySchedule.delete(id);localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));renderSchedule();renderCelebrityGuide();renderMySchedule();scheduleAllReminders()}
function renderMySchedule(){
  const saved=reminderScheduleItems().filter(e=>state.mySchedule.has(e.id)), preview=document.getElementById("schedulePreview"), list=document.getElementById("settingsScheduleList");
  const c=document.getElementById("settingsScheduleCount");if(c)c.textContent=`${saved.length} SAVED`;
  if(!saved.length){if(preview)preview.innerHTML="Tap the bell on a schedule item to add it to My Schedule.";if(list)list.innerHTML="You have not added any events yet.";updateCombinedSavedCount();return}
  const html=saved.map(e=>`<div class="saved-schedule-card"><div class="saved-schedule-time">${e.day.slice(0,3).toUpperCase()}<br>${e.time}</div><div><strong>${e.title.toUpperCase()}</strong><div class="meta">${e.location}${state.reminderMinutes?` • 🔔 ${formatReminder(state.reminderMinutes)}`:" • No reminder"}</div></div><button class="remove-schedule" data-remove-schedule="${e.id}">×</button></div>`).join("");
  if(preview)preview.innerHTML=html;if(list)list.innerHTML=html;document.querySelectorAll("[data-remove-schedule]").forEach(b=>b.addEventListener("click",()=>removeScheduleItem(b.dataset.removeSchedule)));updateCombinedSavedCount()
}
function updateCombinedSavedCount(){const b=document.getElementById("favoriteCount");if(b)b.textContent=`${state.favorites.size+state.mySchedule.size} SAVED`}
function eventDateTime(e){const d=eventDayDates()[e.day];const m=e.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);if(!d||!m)return null;let h=+m[1];if(m[3].toUpperCase()==="PM"&&h!==12)h+=12;if(m[3].toUpperCase()==="AM"&&h===12)h=0;return new Date(`${d}T${String(h).padStart(2,"0")}:${m[2]}:00`)}
function scheduleAllReminders(){for(const t of state.reminderTimers.values())clearTimeout(t);state.reminderTimers.clear();if(!state.reminderMinutes)return;const now=Date.now();reminderScheduleItems().filter(e=>state.mySchedule.has(e.id)).forEach(e=>{const t=eventDateTime(e);if(!t)return;const delay=t.getTime()-state.reminderMinutes*60000-now;if(delay>0&&delay<=2147483647)state.reminderTimers.set(e.id,setTimeout(()=>showScheduleNotification(e),delay))})}
async function showScheduleNotification(e){if(!("Notification"in window)||Notification.permission!=="granted")return;const reg=await navigator.serviceWorker?.ready;if(reg)reg.showNotification(`${e.title} starts soon`,{body:`${e.time} • ${e.location}`,icon:"assets/icons/app-icon-192.png",badge:"assets/icons/app-icon-192.png",data:{url:"./"}})}
function updateReminderUI(){const s=document.getElementById("reminderSettingSummary");if(s)s.textContent=state.reminderMinutes?`${formatReminder(state.reminderMinutes)} for My Schedule events`:"No reminders for My Schedule events";document.querySelectorAll('input[name="reminder"]').forEach(i=>i.checked=+i.value===state.reminderMinutes);renderSchedule();renderMySchedule();scheduleAllReminders()}
function updateNotificationStatus(){const t=document.getElementById("notificationStatusTitle"),c=document.getElementById("notificationStatusCopy"),b=document.getElementById("enableNotificationsButton");if(!t)return;if(!("Notification"in window)){t.textContent="NOTIFICATIONS NOT SUPPORTED";b.disabled=true}else if(Notification.permission==="granted"){t.textContent="NOTIFICATIONS ENABLED";c.textContent="This device has granted notification permission.";b.textContent="NOTIFICATIONS ENABLED";b.disabled=true}else if(Notification.permission==="denied"){t.textContent="NOTIFICATIONS BLOCKED";c.textContent="Notifications are blocked in browser settings.";b.disabled=true}else{t.textContent="NOTIFICATIONS NOT ENABLED";b.disabled=false}}

function renderStatus(){
  const now=new Date(), key=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const byDay=eventDayDates();
  const dates=Object.fromEntries(Object.entries(byDay).filter(([,v])=>v).map(([day,date])=>[date,day]));
  const c=document.getElementById("happeningNow");
  if(!dates[key]){
    const heading=formatEventDateRange(false).replace(/,\s*\d{4}$/,"");
    document.getElementById("nowHeading").textContent=`COMING ${heading}`;
    const edition=(state.settings.editionLabel||formatEventDateRange(false)).toUpperCase();
    c.innerHTML=`<div class="status-card"><strong>${edition} DIGITAL PROGRAM</strong><div class="meta">The program is being built now. During convention weekend this area will surface today's events automatically.</div></div>`;
    return;
  }
  const day=dates[key], items=generalScheduleItems().filter(e=>e.day===day).slice(0,4);
  document.getElementById("nowHeading").textContent=`TODAY • ${day.toUpperCase()}`;
  c.innerHTML=items.map(e=>`<div class="status-card"><strong>${e.time} • ${e.title.toUpperCase()}</strong><div class="meta">${e.location}</div></div>`).join("");
}

function renderEventFilters(){
  const filters=["All",...new Set(state.events.map(e=>e.category))];
  const c=document.getElementById("eventFilters");
  c.innerHTML=filters.map(f=>`<button class="chip ${f===state.eventFilter?"active":""}" data-event-filter="${f}">${f.toUpperCase()}</button>`).join("");
  c.querySelectorAll("[data-event-filter]").forEach(b=>b.addEventListener("click",()=>{state.eventFilter=b.dataset.eventFilter;renderEventFilters();renderEvents()}));
}

function renderBlock(b){
  if(b.type==="p")return `<p>${b.text}</p>`;
  if(b.type==="heading")return `<h4>${b.text}</h4>`;
  if(b.type==="note")return `<div class="info-note">${b.text}</div>`;
  if(b.type==="list")return `<ul>${b.items.map(i=>`<li>${i}</li>`).join("")}</ul>`;
  if(b.type==="schedule")return `<div class="schedule-box">${b.items.map(i=>`<div class="schedule-line">${i}</div>`).join("")}</div>`;
  if(b.type==="menu")return `<div class="menu-table">${b.items.map(i=>`<div class="menu-row"><div class="menu-name"><span>${i.name}</span><span>${i.price}</span></div>${i.desc?`<div class="menu-desc">${i.desc}</div>`:""}</div>`).join("")}</div>`;
  if(b.type==="systems")return `<h4>${b.title}</h4><div class="system-grid">${b.items.map(i=>`<div class="system-row"><strong>${i.name} (${i.year})</strong><small>${i.desc}</small></div>`).join("")}</div>`;
  return "";
}
function renderEvents(){
  const q=document.getElementById("eventSearch").value.trim().toLowerCase();
  const items=state.events.filter(e=>{
    const filter=state.eventFilter==="All"||e.category===state.eventFilter;
    const hay=JSON.stringify(e).toLowerCase();
    return filter&&hay.includes(q);
  });
  document.getElementById("eventList").innerHTML=items.map(e=>`
    <details class="event-card">
      <summary>
        <div class="event-summary-top">
          <div><span class="tag">${e.category.toUpperCase()}</span><h3>${e.title.toUpperCase()}</h3><p class="summary-copy">${e.summary}</p></div>
          <span class="event-arrow">›</span>
        </div>
      </summary>
      <div class="event-content">${e.content.map(renderBlock).join("")}</div>
    </details>`).join("") || `<div class="paper-panel muted-empty">No program information matches that search.</div>`;
}

function renderAll(){applyEventSettings();renderGuestFilters();renderGuests();renderFavorites();renderDayFilters();renderSchedule();renderStatus();renderEventFilters();renderEvents();renderCelebrityGuide();renderMySchedule();updateReminderUI();updateNotificationStatus();}
document.getElementById("guestSearch").addEventListener("input",renderGuests);
document.getElementById("eventSearch").addEventListener("input",renderEvents);
document.querySelectorAll("[data-celebrity-tab]").forEach(b=>b.addEventListener("click",()=>{state.celebrityTab=b.dataset.celebrityTab;renderCelebrityTabs()}));


document.querySelectorAll("[data-mycon-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mycon-tab]").forEach(x=>x.classList.toggle("active",x===b));document.getElementById("schedulePreview").classList.toggle("hidden",b.dataset.myconTab!=="schedule");document.getElementById("favoritePreview").classList.toggle("hidden",b.dataset.myconTab!=="guests")}));
document.getElementById("openReminderSheet").addEventListener("click",()=>{updateReminderUI();document.getElementById("reminderModal").showModal()});
document.getElementById("closeReminderModal").addEventListener("click",()=>document.getElementById("reminderModal").close());
document.querySelectorAll('input[name="reminder"]').forEach(i=>i.addEventListener("change",()=>{state.reminderMinutes=+i.value;localStorage.setItem("sfvc-reminder-minutes",String(state.reminderMinutes));updateReminderUI();setTimeout(()=>document.getElementById("reminderModal").close(),150)}));
document.getElementById("enableNotificationsButton").addEventListener("click",async()=>{if(!("Notification"in window))return;await Notification.requestPermission();updateNotificationStatus()});

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  const topInstall=document.getElementById("installButton");
  if(topInstall)topInstall.hidden=false;
  updateInstallExperience();
});
document.getElementById("installButton").addEventListener("click",async()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
    document.getElementById("installButton").hidden=true;
    updateInstallExperience();
  }else if(isIOSDevice()){
    showInstallHelp();
  }
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js"));



/* ----- Install / Add to Home Screen experience ----- */
const installCard=document.getElementById("installAppCard");
const installCardButton=document.getElementById("installAppCardButton");
const installCardHint=document.getElementById("installCardHint");
const installHelpModal=document.getElementById("installHelpModal");
const installHelpContent=document.getElementById("installHelpContent");

function isStandaloneMode(){
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone===true;
}
function isIOSDevice(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroidDevice(){
  return /android/i.test(navigator.userAgent);
}
function updateInstallExperience(){
  if(!installCard)return;

  // Already installed: never show another install promotion.
  if(isStandaloneMode()){
    document.body.classList.add("is-standalone");
    installCard.classList.add("hidden");
    const topInstall=document.getElementById("installButton");
    if(topInstall)topInstall.hidden=true;
    return;
  }

  document.body.classList.remove("is-standalone");

  // Respect dismissal.
  if(localStorage.getItem("sfvc-install-card-dismissed")==="yes"){
    installCard.classList.add("hidden");
    return;
  }

  // iPhone/iPad: manual Safari Add to Home Screen is supported.
  if(isIOSDevice()){
    installCard.classList.remove("hidden");
    if(installCardButton)installCardButton.textContent="ADD TO HOME SCREEN";
    if(installCardHint)installCardHint.textContent="Open in Safari, then use Share → Add to Home Screen.";
    return;
  }

  // Desktop / Android: only advertise installation if the browser
  // has explicitly provided an install prompt.
  if(deferredPrompt){
    installCard.classList.remove("hidden");
    if(installCardButton){
      installCardButton.textContent=isAndroidDevice() ? "INSTALL APP" : "INSTALL DESKTOP APP";
    }
    if(installCardHint){
      installCardHint.textContent=isAndroidDevice()
        ? "Install the web app for a Home Screen shortcut and faster access."
        : "Install Sci-Fi Valley Con as a desktop app with its own shortcut and standalone window.";
    }
    return;
  }

  // Unsupported/non-installable browser: show no install control.
  installCard.classList.add("hidden");
}
function showInstallHelp(){
  if(!installHelpContent || !isIOSDevice())return;
  installHelpContent.innerHTML=`<p>On iPhone or iPad:</p><ol><li>Open this page in <b>Safari</b>.</li><li>Tap the <b>Share</b> button.</li><li>Choose <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol>`;
  if(typeof installHelpModal.showModal==="function")installHelpModal.showModal();
}
installCardButton?.addEventListener("click",async()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    const choice=await deferredPrompt.userChoice;
    deferredPrompt=null;

    if(choice && choice.outcome==="accepted"){
      installCard.classList.add("hidden");
      const topInstall=document.getElementById("installButton");
      if(topInstall)topInstall.hidden=true;
    }else{
      updateInstallExperience();
    }
  }else if(isIOSDevice()){
    showInstallHelp();
  }else{
    installCard.classList.add("hidden");
  }
});
document.getElementById("dismissInstallCard")?.addEventListener("click",()=>{
  localStorage.setItem("sfvc-install-card-dismissed","yes");
  installCard?.classList.add("hidden");
});
document.getElementById("closeInstallHelpModal")?.addEventListener("click",()=>installHelpModal.close());
installHelpModal?.addEventListener("click",e=>{if(e.target===installHelpModal)installHelpModal.close()});
window.matchMedia("(display-mode: standalone)").addEventListener?.("change",updateInstallExperience);
window.addEventListener("appinstalled",()=>{
  deferredPrompt=null;
  document.body.classList.add("is-standalone");
  installCard?.classList.add("hidden");
  const topInstall=document.getElementById("installButton");
  if(topInstall)topInstall.hidden=true;
});
updateInstallExperience();

/* ----- Guest photo lightbox ----- */
function openPhotoLightbox(src,caption){
  if(!src)return;
  const modal=document.getElementById("photoLightbox");
  const image=document.getElementById("photoLightboxImage");
  image.src=src;
  image.alt=caption||"Celebrity guest photo";
  document.getElementById("photoLightboxCaption").textContent=caption||"";
  if(typeof modal.showModal==="function")modal.showModal();
}
function bindGuestPhotoLightboxes(){
  document.querySelectorAll(".guest-photo,.modal-guest-photo").forEach(img=>{
    if(img.dataset.lightboxBound==="yes")return;
    img.dataset.lightboxBound="yes";
    img.addEventListener("click",e=>{
      e.stopPropagation();
      openPhotoLightbox(img.currentSrc||img.src,img.alt);
    });
  });
}
document.getElementById("closePhotoLightbox")?.addEventListener("click",()=>document.getElementById("photoLightbox").close());
document.getElementById("photoLightbox")?.addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});

loadData().catch(err=>{console.error(err);document.getElementById("happeningNow").innerHTML=`<div class="status-card"><strong>APP DATA COULD NOT LOAD.</strong><div class="meta">Refresh the page or check the latest Cloudflare deployment.</div></div>`});
