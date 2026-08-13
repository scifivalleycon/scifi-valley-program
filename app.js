const state = {
  guests: [], schedule: [], events: [],
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
  const [guests,schedule,events]=await Promise.all([
    fetch("data/guests.json").then(r=>r.json()),
    fetch("data/schedule.json").then(r=>r.json()),
    fetch("data/events.json").then(r=>r.json())
  ]);
  state.guests=guests; state.schedule=schedule.map((e,i)=>({...e,id:e.id||`${e.day}-${e.time}-${i}`})); state.events=events;
  renderAll();
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
    `<a class="full-action" href="${PHOTO_SHOP}" target="_blank" rel="noopener">BROWSE CELEBRITY PHOTO OPS ↗</a>`;
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

function renderDayFilters(){
  const days=["Friday","Saturday","Sunday"];
  const c=document.getElementById("dayFilters");
  c.innerHTML=days.map(d=>`<button class="chip ${d===state.dayFilter?"active":""}" data-day="${d}">${d.toUpperCase()}</button>`).join("");
  c.querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{state.dayFilter=b.dataset.day;renderDayFilters();renderSchedule()}));
}
function renderSchedule(){
  const items=state.schedule.filter(e=>e.day===state.dayFilter);
  document.getElementById("scheduleList").innerHTML=items.map(e=>{
    const saved=state.mySchedule.has(e.id);
    return `<article class="schedule-card"><div class="schedule-time">${e.time}</div><div><strong>${e.title.toUpperCase()}</strong><div class="meta">${e.location} • ${e.category}</div>${saved&&state.reminderMinutes>0?`<span class="schedule-reminder-label">🔔 ${formatReminder(state.reminderMinutes)}</span>`:""}</div><button class="schedule-save ${saved?"saved":""}" data-schedule-save="${e.id}">${saved?"🔔":"♡"}</button></article>`;
  }).join("");
  document.querySelectorAll("[data-schedule-save]").forEach(b=>b.addEventListener("click",()=>toggleScheduleItem(b.dataset.scheduleSave)));
}


function formatReminder(m){if(m===0)return"No reminder";if(m===60)return"1 hour before";return`${m} minutes before`}
function toggleScheduleItem(id){state.mySchedule.has(id)?state.mySchedule.delete(id):state.mySchedule.add(id);localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));renderSchedule();renderMySchedule();scheduleAllReminders()}
function removeScheduleItem(id){state.mySchedule.delete(id);localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));renderSchedule();renderMySchedule();scheduleAllReminders()}
function renderMySchedule(){
  const saved=state.schedule.filter(e=>state.mySchedule.has(e.id)), preview=document.getElementById("schedulePreview"), list=document.getElementById("settingsScheduleList");
  const c=document.getElementById("settingsScheduleCount");if(c)c.textContent=`${saved.length} SAVED`;
  if(!saved.length){if(preview)preview.innerHTML="Tap the bell on a schedule item to add it to My Schedule.";if(list)list.innerHTML="You have not added any events yet.";updateCombinedSavedCount();return}
  const html=saved.map(e=>`<div class="saved-schedule-card"><div class="saved-schedule-time">${e.day.slice(0,3).toUpperCase()}<br>${e.time}</div><div><strong>${e.title.toUpperCase()}</strong><div class="meta">${e.location}${state.reminderMinutes?` • 🔔 ${formatReminder(state.reminderMinutes)}`:" • No reminder"}</div></div><button class="remove-schedule" data-remove-schedule="${e.id}">×</button></div>`).join("");
  if(preview)preview.innerHTML=html;if(list)list.innerHTML=html;document.querySelectorAll("[data-remove-schedule]").forEach(b=>b.addEventListener("click",()=>removeScheduleItem(b.dataset.removeSchedule)));updateCombinedSavedCount()
}
function updateCombinedSavedCount(){const b=document.getElementById("favoriteCount");if(b)b.textContent=`${state.favorites.size+state.mySchedule.size} SAVED`}
function eventDateTime(e){const d={Friday:"2026-10-16",Saturday:"2026-10-17",Sunday:"2026-10-18"}[e.day];const m=e.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);if(!d||!m)return null;let h=+m[1];if(m[3].toUpperCase()==="PM"&&h!==12)h+=12;if(m[3].toUpperCase()==="AM"&&h===12)h=0;return new Date(`${d}T${String(h).padStart(2,"0")}:${m[2]}:00`)}
function scheduleAllReminders(){for(const t of state.reminderTimers.values())clearTimeout(t);state.reminderTimers.clear();if(!state.reminderMinutes)return;const now=Date.now();state.schedule.filter(e=>state.mySchedule.has(e.id)).forEach(e=>{const t=eventDateTime(e);if(!t)return;const delay=t.getTime()-state.reminderMinutes*60000-now;if(delay>0&&delay<=2147483647)state.reminderTimers.set(e.id,setTimeout(()=>showScheduleNotification(e),delay))})}
async function showScheduleNotification(e){if(!("Notification"in window)||Notification.permission!=="granted")return;const reg=await navigator.serviceWorker?.ready;if(reg)reg.showNotification(`${e.title} starts soon`,{body:`${e.time} • ${e.location}`,icon:"assets/icons/app-icon-192.png",badge:"assets/icons/app-icon-192.png",data:{url:"./"}})}
function updateReminderUI(){const s=document.getElementById("reminderSettingSummary");if(s)s.textContent=state.reminderMinutes?`${formatReminder(state.reminderMinutes)} for My Schedule events`:"No reminders for My Schedule events";document.querySelectorAll('input[name="reminder"]').forEach(i=>i.checked=+i.value===state.reminderMinutes);renderSchedule();renderMySchedule();scheduleAllReminders()}
function updateNotificationStatus(){const t=document.getElementById("notificationStatusTitle"),c=document.getElementById("notificationStatusCopy"),b=document.getElementById("enableNotificationsButton");if(!t)return;if(!("Notification"in window)){t.textContent="NOTIFICATIONS NOT SUPPORTED";b.disabled=true}else if(Notification.permission==="granted"){t.textContent="NOTIFICATIONS ENABLED";c.textContent="This device has granted notification permission.";b.textContent="NOTIFICATIONS ENABLED";b.disabled=true}else if(Notification.permission==="denied"){t.textContent="NOTIFICATIONS BLOCKED";c.textContent="Notifications are blocked in browser settings.";b.disabled=true}else{t.textContent="NOTIFICATIONS NOT ENABLED";b.disabled=false}}

function renderStatus(){
  const now=new Date(), key=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const dates={"2026-10-16":"Friday","2026-10-17":"Saturday","2026-10-18":"Sunday"},c=document.getElementById("happeningNow");
  if(!dates[key]){document.getElementById("nowHeading").textContent="COMING OCTOBER 16–18";c.innerHTML=`<div class="status-card"><strong>FALL 2026 DIGITAL PROGRAM</strong><div class="meta">The program is being built now. During convention weekend this area will surface today's events automatically.</div></div>`;return;}
  const day=dates[key], items=state.schedule.filter(e=>e.day===day).slice(0,4);
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

function renderAll(){renderGuestFilters();renderGuests();renderFavorites();renderDayFilters();renderSchedule();renderStatus();renderEventFilters();renderEvents();renderMySchedule();updateReminderUI();updateNotificationStatus();}
document.getElementById("guestSearch").addEventListener("input",renderGuests);
document.getElementById("eventSearch").addEventListener("input",renderEvents);


document.querySelectorAll("[data-mycon-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mycon-tab]").forEach(x=>x.classList.toggle("active",x===b));document.getElementById("schedulePreview").classList.toggle("hidden",b.dataset.myconTab!=="schedule");document.getElementById("favoritePreview").classList.toggle("hidden",b.dataset.myconTab!=="guests")}));
document.getElementById("openReminderSheet").addEventListener("click",()=>{updateReminderUI();document.getElementById("reminderModal").showModal()});
document.getElementById("closeReminderModal").addEventListener("click",()=>document.getElementById("reminderModal").close());
document.querySelectorAll('input[name="reminder"]').forEach(i=>i.addEventListener("change",()=>{state.reminderMinutes=+i.value;localStorage.setItem("sfvc-reminder-minutes",String(state.reminderMinutes));updateReminderUI();setTimeout(()=>document.getElementById("reminderModal").close(),150)}));
document.getElementById("enableNotificationsButton").addEventListener("click",async()=>{if(!("Notification"in window))return;await Notification.requestPermission();updateNotificationStatus()});

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installButton").hidden=false;if(installCardButton)installCardButton.textContent="INSTALL APP";if(installCard)installCard.classList.remove("hidden")});
document.getElementById("installButton").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installButton").hidden=true});
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
  if(isStandaloneMode()){
    document.body.classList.add("is-standalone");
    if(installCard)installCard.classList.add("hidden");
    return;
  }
  document.body.classList.remove("is-standalone");
  if(localStorage.getItem("sfvc-install-card-dismissed")!=="yes"){
    installCard?.classList.remove("hidden");
  }
  if(isIOSDevice()){
    if(installCardButton)installCardButton.textContent="HOW TO INSTALL";
    if(installCardHint)installCardHint.textContent="Add this site to your iPhone Home Screen for an app shortcut.";
  }else if(isAndroidDevice()){
    if(installCardHint)installCardHint.textContent="Install the web app for a Home Screen shortcut and faster access.";
  }
}
function showInstallHelp(){
  if(!installHelpContent)return;
  if(isIOSDevice()){
    installHelpContent.innerHTML=`<p>On iPhone or iPad:</p><ol><li>Open this page in <b>Safari</b>.</li><li>Tap the <b>Share</b> button.</li><li>Choose <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol>`;
  }else{
    installHelpContent.innerHTML=`<p>Your browser does not currently show its automatic install prompt. Open the browser menu and look for <b>Install app</b> or <b>Add to Home Screen</b>.</p>`;
  }
  if(typeof installHelpModal.showModal==="function")installHelpModal.showModal();
}
installCardButton?.addEventListener("click",async()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
    if(installCard)installCard.classList.add("hidden");
  }else{
    showInstallHelp();
  }
});
document.getElementById("dismissInstallCard")?.addEventListener("click",()=>{
  localStorage.setItem("sfvc-install-card-dismissed","yes");
  installCard?.classList.add("hidden");
});
document.getElementById("closeInstallHelpModal")?.addEventListener("click",()=>installHelpModal.close());
installHelpModal?.addEventListener("click",e=>{if(e.target===installHelpModal)installHelpModal.close()});
window.matchMedia("(display-mode: standalone)").addEventListener?.("change",updateInstallExperience);
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
