const DEFAULT_SETTINGS = {
  eventName: "Sci-Fi Valley Con",
  editionLabel: "FALL 2026",
  startDate: "2026-10-16",
  endDate: "2026-10-18",
  venue: "Blair County Convention Center",
  city: "Altoona",
  state: "PA",
  photoShop: "https://checkout.conventions.leapevent.tech/eh/2026_October_Sci_Fi_Valley_Con_Photo_Ops",
  pushApiUrl: "https://notify.scifivalleycon.com"
};

const state = {
  guests: [], schedule: [], events: [], vendors: [], sponsors: [], socialLinks: [], tshirts: [], faq: [], homeBanner: {}, mapSettings: {}, mapLayout: {}, directions: {}, settings: {...DEFAULT_SETTINGS}, celebrityInfo: {}, celebrityPricing: [], photoOps: [], autographs: [], groupPhotoOps: [], panels: [], recentAlerts: [], mapQuery:"", mapSelectedVendorId:"", mapSelectedCodes: new Set(), celebrityTab:"prices", celebrityPhotoDay:"Friday", celebrityPanelDay:"Friday",
  guestFilter: "All", dayFilter: "Friday", eventFilter: "All", faqFilter: "All", scheduleHiddenCategories: new Set(JSON.parse(localStorage.getItem("sfvc-schedule-hidden-categories") || "[]")),
  favorites: new Set(JSON.parse(localStorage.getItem("sfvc-favorites") || "[]")), mySchedule: new Set(JSON.parse(localStorage.getItem("sfvc-my-schedule") || "[]")), reminderMinutes: Number(localStorage.getItem("sfvc-reminder-minutes") ?? 15), reminderTimers: new Map()
};

const MY_SCHEDULE_SNAPSHOT_KEY="sfvc-my-schedule-snapshots-v2";
const APP_BUILD_VERSION="4.50";
const APP_REFRESH_INTERVAL_MS=60*1000;
const APP_REFRESH_MIN_GAP_MS=10*1000;
const APP_FULL_REFRESH_FALLBACK_MS=10*60*1000;
const DEVICE_SAFETY_SYNC_MS=15*60*1000;
const REGISTRATION_SYNC_SAFETY_MS=6*60*60*1000;
let appDataRefreshPromise=null;
let appDataLastRefreshAt=0;
let appVisibleRefreshTimer=null;
let appVersionCheckSignature="";
let appVersionLastCheckedAt=0;
let deviceSafetySyncTimer=null;

function withJitter(baseMs,spread=0.25){
  const safe=Math.max(0,Number(baseMs)||0);
  const variance=Math.max(0,Math.min(0.9,Number(spread)||0));
  if(!safe||!variance)return safe;
  const offset=(Math.random()*2-1)*safe*variance;
  return Math.max(1000,Math.round(safe+offset));
}

function readTimestampMs(storageKey){
  const raw=localStorage.getItem(storageKey);
  if(!raw)return 0;
  const parsed=Date.parse(raw);
  return Number.isFinite(parsed)?parsed:0;
}

function programVersionSignatureFor(info){
  if(!info||typeof info!=="object")return "";
  const version=String(info.version||"").trim();
  const generatedAt=String(info.generatedAt||info.updatedAt||"").trim();
  if(version&&generatedAt)return `${version}|${generatedAt}`;
  return version||generatedAt||"";
}

function loadSavedScheduleSnapshots(){
  try{
    const value=JSON.parse(localStorage.getItem(MY_SCHEDULE_SNAPSHOT_KEY)||"{}");
    return value&&typeof value==="object"?value:{};
  }catch{return {}}
}
let savedScheduleSnapshots=loadSavedScheduleSnapshots();

function saveScheduleSnapshots(){
  localStorage.setItem(MY_SCHEDULE_SNAPSHOT_KEY,JSON.stringify(savedScheduleSnapshots));
}

function stableScheduleHash(value){
  let hash=2166136261;
  for(const ch of String(value||"")){
    hash^=ch.charCodeAt(0);
    hash=Math.imul(hash,16777619);
  }
  return (hash>>>0).toString(36);
}

function stableBaseScheduleId(event){
  if(event?.id)return String(event.id);
  const key=[
    event?.day||"",
    event?.time||"",
    event?.title||"",
    event?.location||"",
    event?.category||""
  ].join("|").toLowerCase();
  return `schedule-${stableScheduleHash(key)}`;
}

function snapshotScheduleEvent(event){
  if(!event?.id)return;
  savedScheduleSnapshots[event.id]={
    id:event.id,
    day:event.day||"",
    time:event.time||"",
    title:event.title||"",
    location:event.location||"",
    category:event.category||"",
    filterCategory:event.filterCategory||"",
    remindable:event.remindable!==false,
    savedAt:new Date().toISOString()
  };
  saveScheduleSnapshots();
}

function migrateLegacyScheduleIds(schedule){
  let changed=false;

  const normalized=schedule.map((event,index)=>({
    event,
    explicit:String(event.id||""),
    oldArrayId:`schedule-${event.day}-${event.time}-${index}`,
    oldHashId:(()=>{
      const key=[event.day||"",event.time||"",event.title||"",event.location||"",event.category||""].join("|").toLowerCase();
      return `schedule-${stableScheduleHash(key)}`;
    })()
  }));

  normalized.forEach(({explicit,oldArrayId,oldHashId})=>{
    if(!explicit)return;
    for(const legacy of [oldArrayId,oldHashId]){
      if(state.mySchedule.has(legacy)&&legacy!==explicit){
        state.mySchedule.delete(legacy);
        state.mySchedule.add(explicit);
        if(savedScheduleSnapshots[legacy]&&!savedScheduleSnapshots[explicit]){
          savedScheduleSnapshots[explicit]={...savedScheduleSnapshots[legacy],id:explicit};
        }
        delete savedScheduleSnapshots[legacy];
        changed=true;
      }
    }
  });

  for(const oldId of [...state.mySchedule]){
    if(normalized.some(x=>x.explicit===oldId))continue;
    const snap=savedScheduleSnapshots[oldId];
    if(!snap)continue;
    const matches=normalized.filter(x=>
      String(x.event.title||"").trim().toLowerCase()===String(snap.title||"").trim().toLowerCase() &&
      String(x.event.day||"")===String(snap.day||"")
    );
    if(matches.length===1&&matches[0].explicit){
      state.mySchedule.delete(oldId);
      state.mySchedule.add(matches[0].explicit);
      savedScheduleSnapshots[matches[0].explicit]={...snap,id:matches[0].explicit};
      delete savedScheduleSnapshots[oldId];
      changed=true;
    }
  }

  if(changed){
    localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));
    saveScheduleSnapshots();
  }
}


const APP_REGISTRATION_KEY="sfvc-app-registration-v1";

function loadAppRegistration(){
  try{
    const value=JSON.parse(localStorage.getItem(APP_REGISTRATION_KEY)||"null");
    return value&&typeof value==="object"?value:null;
  }catch{return null;}
}
function saveAppRegistrationLocal(profile){
  if(profile)localStorage.setItem(APP_REGISTRATION_KEY,JSON.stringify(profile));
  else localStorage.removeItem(APP_REGISTRATION_KEY);
}

const ANONYMOUS_DEVICE_ID_KEY="sfvc-anonymous-device-id-v1";
const DEVICE_SYNC_DEBOUNCE_MS=300;
let deviceSyncTimer=null;
let deviceSyncPromise=null;

function getAnonymousDeviceId(){
  let id=localStorage.getItem(ANONYMOUS_DEVICE_ID_KEY);
  if(id)return id;

  if(globalThis.crypto?.randomUUID){
    id=crypto.randomUUID();
  }else{
    const bytes=new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6]=(bytes[6]&15)|64;
    bytes[8]=(bytes[8]&63)|128;
    const hex=[...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");
    id=`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  localStorage.setItem(ANONYMOUS_DEVICE_ID_KEY,id);
  return id;
}

function deviceSchedulePayload(){
  const liveById=new Map(reminderScheduleItems().map(e=>[e.id,e]));
  const now=Date.now();

  return [...state.mySchedule].map(id=>{
    const event=liveById.get(id)||savedScheduleSnapshots[id];
    if(!event)return null;

    const eventTime=eventDateTime(event);
    const eventAt=eventTime?.getTime()||null;
    const reminderMinutes=Number(state.reminderMinutes||0);
    const notifyAt=eventAt&&reminderMinutes?eventAt-(reminderMinutes*60000):null;

    return {
      eventId:String(id),
      title:String(event.title||""),
      day:String(event.day||""),
      time:String(event.time||""),
      location:String(event.location||""),
      category:String(event.filterCategory||event.category||""),
      remindable:event.remindable!==false,
      reminderMinutes,
      eventAt,
      notifyAt,
      savedAt:String(savedScheduleSnapshots[id]?.savedAt||new Date().toISOString()),
      future:Boolean(eventAt&&eventAt>now)
    };
  }).filter(Boolean);
}

async function syncAnonymousDevice({force=false}={}){
  if(deviceSyncPromise&&!force)return deviceSyncPromise;
  deviceSyncPromise=(async()=>{
    try{
      const base=pushApiBase();
      if(!base)return {ok:false,reason:"api"};

      let subscription=null;
      if(notificationsSupported()&&Notification.permission==="granted"){
        subscription=await getPushSubscription().catch(()=>null);
      }

      const response=await fetch(`${base}/v1/device/sync`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          deviceId:getAnonymousDeviceId(),
          endpoint:subscription?.endpoint||null,
          pushEnabled:Boolean(subscription&&Notification.permission==="granted"&&!pushWasExplicitlyDisabled()),
          reminderMinutes:Number(state.reminderMinutes||0),
          favorites:deviceSchedulePayload(),
          appVersion:APP_BUILD_VERSION,
          timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||""
        })
      });

      const info=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(info.error||`Device sync returned ${response.status}.`);
      localStorage.setItem("sfvc-device-last-sync",new Date().toISOString());
      return info;
    }catch(err){
      console.warn("Anonymous device sync failed",err);
      return {ok:false,error:err.message};
    }finally{
      deviceSyncPromise=null;
    }
  })();
  return deviceSyncPromise;
}

function scheduleAnonymousDeviceSync(delay=DEVICE_SYNC_DEBOUNCE_MS){
  clearTimeout(deviceSyncTimer);
  deviceSyncTimer=setTimeout(()=>syncAnonymousDevice().catch(()=>{}),delay);
}

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


/* =========================================================
   V4.42 — PROGRAM TOOLS DRAWER / TEXT SIZE / PDF / PRINT
   ========================================================= */

const PROGRAM_TEXT_SCALE_KEY="sfvc-program-text-scale-v1";
const PROGRAM_TEXT_SCALES=[0.90,1,1.15,1.30];
let programTextScale=Number(localStorage.getItem(PROGRAM_TEXT_SCALE_KEY)||1);
if(!PROGRAM_TEXT_SCALES.includes(programTextScale))programTextScale=1;

let programTextObserver=null;
let utilityDrawerDragging=false;
let utilityDrawerDragStartY=0;
let utilityDrawerMoved=false;

function elementHasDirectText(element){
  return [...(element?.childNodes||[])].some(node=>
    node.nodeType===Node.TEXT_NODE && String(node.nodeValue||"").trim()
  );
}

const PROGRAM_TEXT_LOCKED_SELECTOR=[
  '[data-font-scale="locked"]',
  '.hero-logo',
  '.hero-rule',
  '#heroEventDates',
  '.event-countdown',
  '.home-show-hours',
  '.home-guest-banner-cta',
  '.topbar',
  '.bottom-nav',
  '.app-utility-drawer',
  '.map-svg-host',
  '.map-vendor-pointer',
  '.photo-lightbox',
  '.burst'
].join(',');

function fontScaleLocked(element){
  if(!(element instanceof HTMLElement))return true;
  if(element.closest(PROGRAM_TEXT_LOCKED_SELECTOR))return true;

  const computed=getComputedStyle(element);

  // Absolutely/fixed-positioned lettering is usually part of a composed visual
  // rather than flowing content. Scaling it independently is what caused the
  // Sci-Fi Valley Con masthead pieces to collide.
  if(computed.position==='absolute'||computed.position==='fixed')return true;
  return false;
}

function fontScaleEligible(element){
  if(!(element instanceof HTMLElement))return false;
  if(element.closest('svg'))return false;
  if(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE"].includes(element.tagName))return false;
  if(fontScaleLocked(element))return false;
  return elementHasDirectText(element);
}

function effectiveProgramTextScale(element,base){
  if(programTextScale<=1)return programTextScale;

  const computed=getComputedStyle(element);
  let cap=1.30;

  // Accessibility benefit is greatest on the small copy. Large display text is
  // already readable and gets a smaller increase so it does not crush adjacent UI.
  if(base>=28)cap=1.00;
  else if(base>=22)cap=1.08;
  else if(base>=16)cap=1.15;

  // Tight one-line controls and compact utility labels receive a conservative cap.
  if(computed.whiteSpace==='nowrap')cap=Math.min(cap,1.12);
  if(element.matches('button,input,select,textarea,code,.tag,.badge,.chip'))cap=Math.min(cap,1.18);

  return Math.min(programTextScale,cap);
}

function scaleTextElement(element){
  if(!fontScaleEligible(element))return;

  if(programTextScale===1){
    if(element.dataset.sfvcBaseFontPx){
      element.style.fontSize="";
      delete element.dataset.sfvcBaseFontPx;
    }
    return;
  }

  if(!element.dataset.sfvcBaseFontPx){
    const size=parseFloat(getComputedStyle(element).fontSize);
    if(!Number.isFinite(size)||size<=0)return;
    element.dataset.sfvcBaseFontPx=String(size);
  }

  const base=Number(element.dataset.sfvcBaseFontPx);
  const scale=effectiveProgramTextScale(element,base);
  element.style.fontSize=`${Math.round(base*scale*100)/100}px`;
}

function scaleTextTree(root=document.body){
  if(root instanceof HTMLElement)scaleTextElement(root);
  root.querySelectorAll?.("*").forEach(scaleTextElement);
}

function updateFontSizeControls(){
  const index=PROGRAM_TEXT_SCALES.indexOf(programTextScale);
  const label=document.getElementById("fontSizeLabel");
  if(label)label.textContent=`${Math.round(programTextScale*100)}%`;

  const decrease=document.getElementById("fontSizeDecrease");
  const increase=document.getElementById("fontSizeIncrease");
  if(decrease)decrease.disabled=index<=0;
  if(increase)increase.disabled=index>=PROGRAM_TEXT_SCALES.length-1;
}

function applyProgramTextScale(scale,{persist=true}={}){
  const requested=Number(scale);
  programTextScale=PROGRAM_TEXT_SCALES.includes(requested)?requested:1;

  // Reset existing inline sizes first if changing scale so every element
  // continues using its original CSS-defined proportions.
  document.querySelectorAll("[data-sfvc-base-font-px]").forEach(element=>{
    element.style.fontSize="";
    delete element.dataset.sfvcBaseFontPx;
  });

  document.body.dataset.programTextScale=String(programTextScale);
  document.body.classList.toggle('sfvc-text-enlarged',programTextScale>1);
  document.body.classList.toggle('sfvc-text-largest',programTextScale>=1.30);

  if(programTextScale!==1)scaleTextTree(document.body);
  if(persist)localStorage.setItem(PROGRAM_TEXT_SCALE_KEY,String(programTextScale));
  updateFontSizeControls();
}

function changeProgramTextScale(direction){
  const index=PROGRAM_TEXT_SCALES.indexOf(programTextScale);
  const next=Math.max(0,Math.min(PROGRAM_TEXT_SCALES.length-1,index+direction));
  applyProgramTextScale(PROGRAM_TEXT_SCALES[next]);
}

function initializeProgramTextScaling(){
  applyProgramTextScale(programTextScale,{persist:false});

  programTextObserver?.disconnect();
  programTextObserver=new MutationObserver(mutations=>{
    if(programTextScale===1)return;
    mutations.forEach(mutation=>{
      mutation.addedNodes.forEach(node=>{
        if(node instanceof HTMLElement)scaleTextTree(node);
      });
    });
  });
  programTextObserver.observe(document.body,{childList:true,subtree:true});
}

function setUtilityDrawerOpen(open){
  const drawer=document.getElementById("appUtilityDrawer");
  const handle=document.getElementById("appUtilityHandle");
  const arrow=document.getElementById("utilityHandleArrow");
  if(!drawer||!handle)return;
  drawer.classList.toggle("open",Boolean(open));
  handle.setAttribute("aria-expanded",open?"true":"false");
  if(arrow)arrow.textContent=open?"▲":"▼";
}

function toggleUtilityDrawer(){
  const drawer=document.getElementById("appUtilityDrawer");
  setUtilityDrawerOpen(!drawer?.classList.contains("open"));
}

function utilityDrawerPointerDown(event){
  utilityDrawerDragging=true;
  utilityDrawerMoved=false;
  utilityDrawerDragStartY=event.clientY;
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function utilityDrawerPointerMove(event){
  if(!utilityDrawerDragging)return;
  const dy=event.clientY-utilityDrawerDragStartY;
  if(Math.abs(dy)>8)utilityDrawerMoved=true;
}

function utilityDrawerPointerUp(event){
  if(!utilityDrawerDragging)return;
  const dy=event.clientY-utilityDrawerDragStartY;
  utilityDrawerDragging=false;
  event.currentTarget.releasePointerCapture?.(event.pointerId);

  if(dy>35)setUtilityDrawerOpen(true);
  else if(dy<-35)setUtilityDrawerOpen(false);
}


/* ---------- Printable program content ---------- */

function plainText(value){
  const temp=document.createElement("div");
  temp.innerHTML=String(value??"");
  return String(temp.textContent||temp.innerText||"")
    .replace(/\s+/g," ")
    .trim();
}

function exportEventContentLines(event){
  const lines=[];
  if(event?.summary)lines.push(plainText(event.summary));

  (event?.content||[]).forEach(block=>{
    if(block?.title)lines.push(plainText(block.title));
    if(block?.type==="list"||block?.type==="schedule"){
      (block.items||[]).forEach(item=>lines.push(`- ${plainText(item)}`));
    }else if(block?.type==="menu"){
      (block.items||[]).forEach(item=>{
        lines.push(`${plainText(item.name)}${item.price?` - ${plainText(item.price)}`:""}`);
        if(item.desc)lines.push(`  ${plainText(item.desc)}`);
      });
    }else if(block?.type==="systems"){
      if(block.title)lines.push(plainText(block.title));
      (block.items||[]).forEach(item=>{
        lines.push(`${plainText(item.name)}${item.year?` (${plainText(item.year)})`:""}`);
        if(item.desc)lines.push(`  ${plainText(item.desc)}`);
      });
    }
  });
  return lines;
}

const PROGRAM_PDF_SECTION_KEYS=[
  "eventInfo","updates","myCon","schedule","guests",
  "pricing","eventGuide","food","vendors","faq"
];

function fullProgramPdfSelection(){
  return new Set(PROGRAM_PDF_SECTION_KEYS);
}

function normalizeProgramPdfSelection(selection){
  if(selection instanceof Set)return selection;
  if(Array.isArray(selection))return new Set(selection);
  return fullProgramPdfSelection();
}

function isFoodEvent(event){
  const haystack=`${event?.title||""} ${event?.category||""} ${event?.summary||""}`.toLowerCase();
  return /café|cafe|food|menu|concession|dining|snack|restaurant|eat|beverage|drink/.test(haystack);
}

function programExportBlocks(selection=fullProgramPdfSelection()){
  const selected=normalizeProgramPdfSelection(selection);
  const blocks=[];
  const add=(type,text)=>{const value=plainText(text);if(value)blocks.push({type,text:value});};
  const addLine=text=>add("body",text);
  const addSection=text=>add("section",text);
  const addSub=text=>add("subheading",text);
  const addBullet=text=>add("bullet",text);

  // A recognizable cover/header is always included even for a tiny custom PDF.
  add("title",state.settings.eventName||"Sci-Fi Valley Con");
  add("subtitle","THE OFFICIAL DIGITAL PROGRAM");

  if(selected.has("eventInfo")){
    addLine(formatEventDateRange(false));
    addLine(eventLocationText());
    addLine("Friday: 2:00 PM - 9:00 PM | Saturday: 10:00 AM - 8:00 PM | Sunday: 10:00 AM - 5:00 PM");
  }
  add("small",`Generated ${new Date().toLocaleString()}`);

  if(selected.has("updates")){
    const currentAlerts=(state.recentAlerts||[])
      .map(item=>({...item,_date:parseBroadcastTimestamp(item.createdAt)}))
      .filter(item=>item._date&&Date.now()-item._date.getTime()<=RECENT_ALERT_RETENTION_MS)
      .sort((a,b)=>b._date-a._date);

    if(currentAlerts.length){
      addSection("LATEST EVENT UPDATES");
      currentAlerts.forEach(item=>{
        addSub(item.title||"Event Update");
        addLine(item.body||"");
      });
    }
  }

  const allSchedule=showScheduleItems();

  if(selected.has("myCon")){
    const myItems=allSchedule.filter(item=>state.mySchedule.has(item.id));
    const myGuests=(state.guests||[]).filter(guest=>state.favorites.has(guest.id));

    if(myItems.length||myGuests.length){
      addSection("MY CON");
      if(myItems.length){
        addSub("MY SCHEDULE");
        ["Friday","Saturday","Sunday"].forEach(day=>{
          const items=sortedScheduleItems(myItems.filter(item=>item.day===day));
          if(!items.length)return;
          add("day",day);
          items.forEach(item=>addBullet(`${item.time}${item.endTime?` - ${item.endTime}`:""} | ${item.title} | ${item.location}`));
        });
      }
      if(myGuests.length){
        addSub("MY SAVED GUESTS");
        myGuests.forEach(guest=>addBullet(`${guest.name}${guest.group?` | ${guest.group}`:""}`));
      }
    }else{
      addSection("MY CON");
      addLine("No personal schedule items or saved celebrity guests have been added on this device yet.");
    }
  }

  if(selected.has("schedule")){
    addSection("SHOW SCHEDULE");
    ["Friday","Saturday","Sunday"].forEach(day=>{
      const items=sortedScheduleItems(allSchedule.filter(item=>item.day===day));
      if(!items.length)return;
      add("day",day);
      items.forEach(item=>{
        addBullet(`${item.time}${item.endTime?` - ${item.endTime}`:""} | ${item.title} | ${item.location} | ${primaryScheduleCategory(item)}`);
      });
    });
  }

  if(selected.has("guests")&&state.guests?.length){
    addSection("CELEBRITY GUESTS");
    state.guests.forEach(guest=>{
      addSub(`${guest.name}${guest.group?` - ${guest.group}`:""}`);
      const detail=[guest.character,guest.knownFor].filter(Boolean).map(plainText).join(" | ");
      if(detail)addLine(detail);
      if(guest.bio)addLine(plainText(guest.bio));
    });
  }

  if(selected.has("pricing")&&celebrityPublished()&&state.celebrityPricing?.length){
    addSection("CELEBRITY PRICING");
    state.celebrityPricing.forEach(price=>{
      addSub(price.guestName||"Guest");
      addLine(`Autograph: ${price.autograph||"TBD"} | Selfie: ${price.selfie||"TBD"} | Combo: ${price.combo||"TBD"} | Pro Photo: ${price.proPhoto||"TBD"}`);
      if(price.notes)addLine(price.notes);
    });
  }

  if(selected.has("eventGuide")&&state.events?.length){
    const generalEvents=state.events.filter(event=>!isFoodEvent(event));
    if(generalEvents.length){
      addSection("EVENT GUIDE");
      generalEvents.forEach(event=>{
        addSub(`${event.title}${event.category?` - ${event.category}`:""}`);
        exportEventContentLines(event).forEach(addLine);
      });
    }
  }

  if(selected.has("food")&&state.events?.length){
    const foodEvents=state.events.filter(isFoodEvent);
    if(foodEvents.length){
      addSection("CAFÉ & FOOD INFORMATION");
      foodEvents.forEach(event=>{
        addSub(`${event.title}${event.category?` - ${event.category}`:""}`);
        exportEventContentLines(event).forEach(addLine);
      });
    }
  }

  if(selected.has("vendors")&&mapDirectoryVisible()&&state.vendors?.length){
    addSection("VENDOR DIRECTORY & FLOOR LOCATIONS");
    addLine("The interactive floor map remains available inside the app. This printable copy lists vendor locations for quick reference.");
    [...state.vendors]
      .sort((a,b)=>String(a.location||"").localeCompare(String(b.location||""),undefined,{numeric:true}))
      .forEach(vendor=>{
        addSub(`${vendor.location||"TBD"} - ${vendor.name||"Vendor"}`);
        if(vendor.description)addLine(`What they sell: ${vendor.description}`);
        else if(vendor.categories)addLine(`Products / categories: ${vendor.categories}`);
        if(vendor.conQuest)addLine("Con-Quest participant");
      });
  }

  if(selected.has("faq")){
    const faqs=(state.faq||[]).filter(item=>item&&item.enabled!==false&&item.question);
    if(faqs.length){
      addSection("FREQUENTLY ASKED QUESTIONS");
      faqs.forEach(item=>{
        addSub(item.question);
        addLine(faqAnswerText(item));
        (item.bullets||[]).forEach(addBullet);
      });
    }
  }

  addSection("IMPORTANT");
  addLine("Schedules, guests, pricing, locations and event information are subject to change. Check the live Sci-Fi Valley Con app for the latest updates.");

  return blocks;
}

/* ---------- Real shareable PDF file, no external library ---------- */

function pdfAscii(value){
  return String(value??"")
    .normalize("NFKD")
    .replace(/[\u2010-\u2015]/g,"-")
    .replace(/[\u2018\u2019]/g,"'")
    .replace(/[\u201C\u201D]/g,'"')
    .replace(/\u2022/g,"-")
    .replace(/[\u2600-\u27BF]/g,"")
    .replace(/[^\x20-\x7E]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

function pdfEscape(value){
  return pdfAscii(value).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
}

function wrapPdfText(text,size,maxWidth=528){
  const clean=pdfAscii(text);
  if(!clean)return [""];
  const approximateCharWidth=Math.max(3.2,size*0.50);
  const maxChars=Math.max(18,Math.floor(maxWidth/approximateCharWidth));
  const words=clean.split(/\s+/);
  const lines=[];
  let line="";

  words.forEach(word=>{
    const candidate=line?`${line} ${word}`:word;
    if(candidate.length<=maxChars){
      line=candidate;
      return;
    }
    if(line)lines.push(line);
    if(word.length<=maxChars){
      line=word;
      return;
    }
    for(let i=0;i<word.length;i+=maxChars){
      const part=word.slice(i,i+maxChars);
      if(part.length===maxChars)lines.push(part);
      else line=part;
    }
  });

  if(line)lines.push(line);
  return lines.length?lines:[""];
}

function pdfBlockStyle(type){
  const styles={
    title:{size:23,bold:true,before:0,after:8,leading:26},
    subtitle:{size:10,bold:true,before:0,after:8,leading:13},
    section:{size:13,bold:true,before:14,after:7,leading:17},
    day:{size:11,bold:true,before:8,after:3,leading:14},
    subheading:{size:10,bold:true,before:6,after:2,leading:13},
    bullet:{size:9,bold:false,before:0,after:2,leading:12,indent:12},
    small:{size:8,bold:false,before:1,after:4,leading:10},
    body:{size:9,bold:false,before:0,after:3,leading:12}
  };
  return styles[type]||styles.body;
}

function pdfColor(type,pageIndex,row){
  if(type==="title")return [0.20,0.12,0.09];
  if(type==="subtitle")return [0.72,0.26,0.16];
  if(type==="section")return [0.20,0.12,0.09];
  if(type==="day")return [0.72,0.26,0.16];
  if(type==="subheading")return [0.20,0.12,0.09];
  if(type==="small")return [0.34,0.29,0.26];
  return [0.13,0.10,0.08];
}

function pdfRgb(color){
  return `${color.map(value=>Number(value).toFixed(3)).join(" ")} rg`;
}

function buildProgramPdfBytes(selection=fullProgramPdfSelection()){
  const blocks=programExportBlocks(selection);
  const pages=[];
  let page=[];
  let y=748;

  const pushPage=()=>{
    if(page.length)pages.push(page);
    page=[];
    y=748;
  };

  blocks.forEach(block=>{
    const style=pdfBlockStyle(block.type);
    const wrapped=wrapPdfText(
      block.type==="bullet"?`- ${block.text}`:block.text,
      style.size,
      528-(style.indent||0)
    );
    const height=style.before+(wrapped.length*style.leading)+style.after;

    if(y-height<58&&page.length)pushPage();

    y-=style.before;
    wrapped.forEach(line=>{
      page.push({
        text:line,
        type:block.type,
        x:42+(style.indent||0),
        y,
        size:style.size,
        bold:style.bold
      });
      y-=style.leading;
    });
    y-=style.after;
  });

  pushPage();
  if(!pages.length)pages.push([]);

  const pageCount=pages.length;
  const objects={};
  objects[1]="<< /Type /Catalog /Pages 2 0 R >>";
  const pageIds=pages.map((_,index)=>7+(index*2));
  objects[2]=`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(" ")}] /Count ${pageCount} >>`;
  objects[3]="<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4]="<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objects[5]="<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>";

  pages.forEach((rows,index)=>{
    const contentId=6+(index*2);
    const pageId=7+(index*2);
    const footer=`${pdfAscii(state.settings.eventName||"Sci-Fi Valley Con")} Digital Program | Page ${index+1} of ${pageCount}`;
    const commands=[];

    // Ink-friendly white page. Keep the retro identity with thin rules only.
    commands.push("1 1 1 rg 0 0 612 792 re f");
    commands.push("0.205 0.125 0.094 RG 0.9 w 24 24 564 744 re S");

    if(index===0){
      // White masthead with dark text and a slim orange rule.
      commands.push("0.945 0.402 0.224 RG 2.2 w 25 702 562 0 l S");
      commands.push("0.205 0.125 0.094 RG 0.7 w 25 766 562 0 l S");
    }else{
      commands.push("0.945 0.402 0.224 RG 1.6 w 25 760 562 0 l S");
    }

    rows.forEach(row=>{
      if(row.type==="section"){
        // No filled section bars. Use slim teal/orange rules instead.
        commands.push(`0.420 0.690 0.690 RG 1.2 w 35 ${row.y-6} 542 0 l S`);
        commands.push(`0.945 0.402 0.224 RG 2.4 w 35 ${row.y-6} 30 0 l S`);
      }
      if(row.type==="day"){
        commands.push(`0.945 0.402 0.224 RG 1.5 w 42 ${row.y-3} 42 0 l S`);
      }

      const font=row.type==="body"||row.type==="bullet"||row.type==="small" ? 3 : (row.bold?2:1);
      commands.push(pdfRgb(pdfColor(row.type,index,row)));
      commands.push(`BT /F${font} ${row.size} Tf 1 0 0 1 ${row.x} ${row.y} Tm (${pdfEscape(row.text)}) Tj ET`);
    });

    // Footer treatment.
    commands.push("0.205 0.125 0.094 RG 0.45 w 38 41 536 0 l S");
    commands.push("0.340 0.290 0.260 rg");
    commands.push(`BT /F1 7 Tf 1 0 0 1 42 29 Tm (${pdfEscape(footer)}) Tj ET`);

    const stream=commands.join("\n");
    objects[contentId]=`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageId]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  const maxId=Math.max(...Object.keys(objects).map(Number));
  let pdf="%PDF-1.4\n";
  const offsets=[0];

  for(let id=1;id<=maxId;id++){
    offsets[id]=pdf.length;
    pdf+=`${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset=pdf.length;
  pdf+=`xref\n0 ${maxId+1}\n`;
  pdf+="0000000000 65535 f \n";
  for(let id=1;id<=maxId;id++){
    pdf+=`${String(offsets[id]).padStart(10,"0")} 00000 n \n`;
  }
  pdf+=`trailer\n<< /Size ${maxId+1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function programPdfFilename(){
  const name=String(state.settings.eventName||"Sci-Fi Valley Con")
    .replace(/[^a-z0-9]+/gi,"-")
    .replace(/^-+|-+$/g,"");
  return `${name||"SFVC"}-Digital-Program.pdf`;
}

function downloadBlob(blob,filename){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}

let pdfBuilderAction="share";
let activeProgramPdfSelection=fullProgramPdfSelection();

function programPdfBuilderModal(){
  return document.getElementById("programPdfBuilderModal");
}

function openProgramPdfBuilder(action="share"){
  pdfBuilderAction=action==="print"?"print":"share";
  const modal=programPdfBuilderModal();
  const custom=document.getElementById("pdfBuilderCustomPanel");
  const modes=document.getElementById("pdfBuilderModeChoices");
  const intro=document.getElementById("pdfBuilderIntro");
  const status=document.getElementById("pdfBuilderStatus");

  custom?.classList.add("hidden");
  modes?.classList.remove("hidden");
  if(status)status.textContent="";
  if(intro)intro.textContent=pdfBuilderAction==="print"
    ?"Choose a full printed program or build a shorter custom copy."
    :"Choose a full program or build a custom PDF with only what you want to save or share.";

  updatePdfBuilderSelectionCount();

  setUtilityDrawerOpen(false);
  if(typeof modal?.showModal==="function"&&!modal.open)modal.showModal();
  else modal?.setAttribute("open","");
}

function closeProgramPdfBuilder(){
  programPdfBuilderModal()?.close();
}

function pdfBuilderCheckedSelection(){
  return new Set(
    [...document.querySelectorAll('#pdfBuilderCustomPanel input[type="checkbox"]:checked')]
      .map(input=>input.value)
      .filter(value=>PROGRAM_PDF_SECTION_KEYS.includes(value))
  );
}

function setPdfBuilderCheckboxes(checked){
  document.querySelectorAll('#pdfBuilderCustomPanel input[type="checkbox"]')
    .forEach(input=>input.checked=Boolean(checked));
  updatePdfBuilderSelectionCount();
}

function updatePdfBuilderSelectionCount(){
  const selection=pdfBuilderCheckedSelection();
  const count=document.getElementById("pdfBuilderSelectionCount");
  const create=document.getElementById("pdfBuilderCreateCustom");
  if(count)count.textContent=`${selection.size} section${selection.size===1?"":"s"} selected`;
  if(create){
    create.disabled=selection.size===0;
    create.textContent=pdfBuilderAction==="print"?"PRINT CUSTOM PROGRAM":"CREATE CUSTOM PDF";
  }
}

function showCustomPdfBuilder(){
  document.getElementById("pdfBuilderModeChoices")?.classList.add("hidden");
  document.getElementById("pdfBuilderCustomPanel")?.classList.remove("hidden");
  updatePdfBuilderSelectionCount();
}

async function shareProgramPdf(selection){
  const status=document.getElementById("pdfBuilderStatus");
  if(status)status.textContent="BUILDING YOUR PDF…";

  try{
    const bytes=buildProgramPdfBytes(selection);
    const blob=new Blob([bytes],{type:"application/pdf"});
    const filename=programPdfFilename();
    const file=new File([blob],filename,{type:"application/pdf"});

    if(navigator.share&&navigator.canShare?.({files:[file]})){
      await navigator.share({
        title:`${state.settings.eventName||"Sci-Fi Valley Con"} Digital Program`,
        text:"Sci-Fi Valley Con digital event program",
        files:[file]
      });
      if(status)status.textContent="PDF READY. YOUR DEVICE SHARE MENU WAS OPENED.";
    }else{
      downloadBlob(blob,filename);
      if(status)status.textContent="PDF DOWNLOADED. OPEN THE FILE TO SHARE, EMAIL, SAVE OR PRINT IT.";
    }
  }catch(err){
    if(err?.name==="AbortError"){
      if(status)status.textContent="PDF SHARE CANCELED.";
    }else{
      console.error("Program PDF export failed",err);
      if(status)status.textContent="PDF EXPORT COULD NOT COMPLETE. TRY AGAIN OR USE PRINT / SAVE PDF.";
    }
  }
}


/* ---------- Browser print / Save as PDF ---------- */

function buildProgramPrintView(selection=activeProgramPdfSelection){
  const host=document.getElementById("programPrintView");
  if(!host)return;

  const blocks=programExportBlocks(selection);
  host.innerHTML=`
    <header class="program-print-header">
      <span>THE OFFICIAL DIGITAL PROGRAM</span>
      <h1>${escapeAppHtml(state.settings.eventName||"Sci-Fi Valley Con")}</h1>
      <p>${escapeAppHtml(formatEventDateRange(false))} • ${escapeAppHtml(eventLocationText())}</p>
    </header>
    <div class="program-print-content">
      ${blocks.slice(2).map(block=>{
        if(block.type==="section")return `<h2>${escapeAppHtml(block.text)}</h2>`;
        if(block.type==="day")return `<h3 class="print-day">${escapeAppHtml(block.text)}</h3>`;
        if(block.type==="subheading")return `<h3>${escapeAppHtml(block.text)}</h3>`;
        if(block.type==="bullet")return `<p class="print-bullet">• ${escapeAppHtml(block.text)}</p>`;
        if(block.type==="small")return `<p class="print-small">${escapeAppHtml(block.text)}</p>`;
        return `<p>${escapeAppHtml(block.text)}</p>`;
      }).join("")}
    </div>
    <footer>Generated from the Sci-Fi Valley Con Digital Program • ${escapeAppHtml(new Date().toLocaleString())}</footer>`;
}

function printProgramSelection(selection){
  activeProgramPdfSelection=normalizeProgramPdfSelection(selection);
  buildProgramPrintView(activeProgramPdfSelection);
  closeProgramPdfBuilder();

  setTimeout(()=>{
    window.print();
    const status=document.getElementById("utilityToolStatus");
    if(status)status.textContent="USE YOUR PRINT MENU TO PRINT OR SAVE AS PDF.";
  },120);
}

async function runProgramPdfSelection(selection){
  const normalized=normalizeProgramPdfSelection(selection);
  if(pdfBuilderAction==="print"){
    printProgramSelection(normalized);
    return;
  }
  await shareProgramPdf(normalized);
}

async function chooseFullProgramPdf(){
  activeProgramPdfSelection=fullProgramPdfSelection();
  await runProgramPdfSelection(activeProgramPdfSelection);
}

async function createCustomProgramPdf(){
  const selection=pdfBuilderCheckedSelection();
  if(!selection.size)return;
  activeProgramPdfSelection=selection;
  await runProgramPdfSelection(selection);
}

async function exportProgramPdfFile(){
  openProgramPdfBuilder("share");
}

function printProgramCopy(){
  openProgramPdfBuilder("print");
}


/* ---------- Share this web app ---------- */

function sfvcShareAppUrl(){
  return "https://app.scifivalleycon.com/";
}

function sfvcShareAppTitle(){
  return `${state.settings.eventName||"Sci-Fi Valley Con"} Digital Program`;
}

function sfvcShareAppText(){
  return `Check out the Sci-Fi Valley Con digital event program for guests, schedules, vendors, the floor map, event alerts and more:`;
}

function configureShareAppFallback(){
  const url=sfvcShareAppUrl();
  const text=sfvcShareAppText();
  const fullMessage=`${text} ${url}`;

  const textLink=document.getElementById("shareAppTextLink");
  const emailLink=document.getElementById("shareAppEmailLink");

  if(textLink){
    // sms:?&body= is broadly supported on iOS/Android and opens the user's
    // preferred messaging app without sending anything automatically.
    textLink.href=`sms:?&body=${encodeURIComponent(fullMessage)}`;
  }

  if(emailLink){
    emailLink.href=`mailto:?subject=${encodeURIComponent(sfvcShareAppTitle())}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
  }
}

function openShareWebAppFallback(){
  configureShareAppFallback();
  const modal=document.getElementById("shareWebAppModal");
  const status=document.getElementById("shareWebAppStatus");
  if(status)status.textContent="";
  if(typeof modal?.showModal==="function"&&!modal.open)modal.showModal();
  else modal?.setAttribute("open","");
}

function closeShareWebAppFallback(){
  document.getElementById("shareWebAppModal")?.close();
}

async function copyShareWebAppLink(){
  const status=document.getElementById("shareWebAppStatus");
  const url=sfvcShareAppUrl();

  try{
    await navigator.clipboard.writeText(url);
    if(status)status.textContent="✓ APP LINK COPIED";
  }catch{
    const input=document.createElement("input");
    input.value=url;
    input.setAttribute("readonly","");
    input.style.position="fixed";
    input.style.opacity="0";
    document.body.appendChild(input);
    input.select();
    const copied=document.execCommand?.("copy");
    input.remove();
    if(status)status.textContent=copied?"✓ APP LINK COPIED":`COPY THIS LINK: ${url}`;
  }
}

async function shareWebAppWithFriend(){
  const url=sfvcShareAppUrl();
  const shareData={
    title:sfvcShareAppTitle(),
    text:sfvcShareAppText(),
    url
  };

  setUtilityDrawerOpen(false);

  if(navigator.share){
    try{
      await navigator.share(shareData);
      return;
    }catch(err){
      // Closing the native share sheet is not an error that needs another popup.
      if(err?.name==="AbortError")return;
      console.warn("Native app share unavailable",err);
    }
  }

  openShareWebAppFallback();
}

/* ---------- Full refresh ---------- */

async function refreshProgramFromTools(){
  const button=document.getElementById("refreshAppNow");
  const status=document.getElementById("utilityToolStatus");
  if(button){
    button.disabled=true;
    button.textContent="↻ REFRESHING…";
  }
  if(status)status.textContent="CHECKING FOR THE LATEST PROGRAM DATA AND APP FILES…";

  try{
    await refreshAppData("manual-program-tools");
    const registration=await navigator.serviceWorker?.getRegistration?.();
    await registration?.update?.().catch(()=>{});
    if(status)status.textContent="LATEST DATA LOADED. RELOADING THE APP…";
    setTimeout(()=>window.location.reload(),350);
  }catch(err){
    console.error("Manual app refresh failed",err);
    if(status)status.textContent="REFRESH FAILED. CHECK YOUR CONNECTION AND TRY AGAIN.";
    if(button){
      button.disabled=false;
      button.textContent="↻ REFRESH APP & PAGE";
    }
  }
}


/* ---------- Bind Program Tools ---------- */

function initializeProgramTools(){
  const handle=document.getElementById("appUtilityHandle");
  const drawer=document.getElementById("appUtilityDrawer");

  handle?.addEventListener("pointerdown",utilityDrawerPointerDown);
  handle?.addEventListener("pointermove",utilityDrawerPointerMove);
  handle?.addEventListener("pointerup",utilityDrawerPointerUp);
  handle?.addEventListener("pointercancel",()=>{utilityDrawerDragging=false});

  handle?.addEventListener("click",()=>{
    if(utilityDrawerMoved){
      utilityDrawerMoved=false;
      return;
    }
    toggleUtilityDrawer();
  });

  document.getElementById("closeUtilityDrawer")?.addEventListener("click",()=>setUtilityDrawerOpen(false));
  document.getElementById("fontSizeDecrease")?.addEventListener("click",()=>changeProgramTextScale(-1));
  document.getElementById("fontSizeIncrease")?.addEventListener("click",()=>changeProgramTextScale(1));
  document.getElementById("fontSizeReset")?.addEventListener("click",()=>applyProgramTextScale(1));
  document.getElementById("exportProgramPdf")?.addEventListener("click",exportProgramPdfFile);
  document.getElementById("printProgram")?.addEventListener("click",printProgramCopy);
  document.getElementById("refreshAppNow")?.addEventListener("click",refreshProgramFromTools);
  document.getElementById("shareWebApp")?.addEventListener("click",shareWebAppWithFriend);
  document.getElementById("closeShareWebAppModal")?.addEventListener("click",closeShareWebAppFallback);
  document.getElementById("shareWebAppModal")?.addEventListener("click",event=>{
    if(event.target===event.currentTarget)event.currentTarget.close();
  });
  document.getElementById("copyShareAppLink")?.addEventListener("click",copyShareWebAppLink);

  document.querySelectorAll("[data-utility-go]").forEach(button=>{
    button.addEventListener("click",()=>{
      setUtilityDrawerOpen(false);
      goTo(button.dataset.utilityGo);
    });
  });

  document.getElementById("closeProgramPdfBuilder")?.addEventListener("click",closeProgramPdfBuilder);
  document.getElementById("programPdfBuilderModal")?.addEventListener("click",event=>{
    if(event.target===event.currentTarget)event.currentTarget.close();
  });
  document.getElementById("pdfBuilderFullProgram")?.addEventListener("click",chooseFullProgramPdf);
  document.getElementById("pdfBuilderCustomProgram")?.addEventListener("click",showCustomPdfBuilder);
  document.getElementById("pdfBuilderSelectAll")?.addEventListener("click",()=>setPdfBuilderCheckboxes(true));
  document.getElementById("pdfBuilderClearAll")?.addEventListener("click",()=>setPdfBuilderCheckboxes(false));
  document.getElementById("pdfBuilderCreateCustom")?.addEventListener("click",createCustomProgramPdf);
  document.querySelectorAll('#pdfBuilderCustomPanel input[type="checkbox"]').forEach(input=>{
    input.addEventListener("change",updatePdfBuilderSelectionCount);
  });

  // Swipe upward on the open panel to close it.
  drawer?.addEventListener("pointerdown",event=>{
    if(event.target.closest("button,input,a"))return;
    utilityDrawerPointerDown(event);
  });
  drawer?.addEventListener("pointermove",utilityDrawerPointerMove);
  drawer?.addEventListener("pointerup",event=>{
    if(!utilityDrawerDragging)return;
    utilityDrawerPointerUp(event);
  });

  window.addEventListener("beforeprint",buildProgramPrintView);
  initializeProgramTextScaling();
  updateFontSizeControls();
}

async function loadData({silent=false,force=false,versionInfo=null}={}){
  if(appDataRefreshPromise&&!force)return appDataRefreshPromise;
  const now=Date.now();
  if(!force&&appDataLastRefreshAt&&now-appDataLastRefreshAt<APP_REFRESH_MIN_GAP_MS){
    return;
  }

  appDataRefreshPromise=(async()=>{
    const stamp=`v=${Date.now()}`;
    const safeJson=(url,fallback=[])=>fetch(`${url}${url.includes("?")?"&":"?"}${stamp}`,{
      cache:"no-store",
      credentials:"same-origin"
    }).then(r=>r.ok?r.json():fallback).catch(()=>fallback);
    const safeObjectJson=(url,fallback={})=>fetch(`${url}${url.includes("?")?"&":"?"}${stamp}`,{
      cache:"no-store",
      credentials:"same-origin"
    }).then(r=>r.ok?r.json():fallback).catch(()=>fallback);

    const resolvedVersionInfo=versionInfo||await safeObjectJson("data/version.json",{});

    const [guests,schedule,events,vendors,sponsors,socialLinks,tshirts,faq,homeBannerData,mapLayoutData,mapSettingsData,directionsData,settingsData,celebrityInfo,celebrityPricing,photoOps,autographs,groupPhotoOps,panels]=await Promise.all([
      safeJson("data/guests.json"),safeJson("data/schedule.json"),safeJson("data/events.json"),safeJson("data/vendors.json"),
      safeJson("data/sponsors.json"),safeJson("data/social-links.json"),safeJson("data/tshirts.json"),safeJson("data/faq.json"),safeJson("data/home-banner.json"),
      safeJson("data/map-layout.json"),safeJson("data/map-settings.json"),safeJson("data/directions.json"),safeJson("data/settings.json"),safeJson("data/celebrity-info.json"),
      safeJson("data/celebrity-pricing.json"),safeJson("data/photo-ops.json"),safeJson("data/autograph-schedule.json"),
      safeJson("data/group-photo-ops.json"),safeJson("data/panels.json")
    ]);

    const rawSchedule=Array.isArray(schedule)?schedule:[];
    migrateLegacyScheduleIds(rawSchedule);
    const normalizedSchedule=rawSchedule.map(e=>({...e,id:stableBaseScheduleId(e)}));

    const savedSettings=Array.isArray(settingsData)&&settingsData[0]?settingsData[0]:{};
    state.settings={...DEFAULT_SETTINGS,...savedSettings};
    state.guests=Array.isArray(guests)?guests:[];
    state.schedule=normalizedSchedule;
    state.events=Array.isArray(events)?events:[];
    state.vendors=Array.isArray(vendors)?vendors:[];
    state.sponsors=Array.isArray(sponsors)?sponsors:[];
    state.socialLinks=Array.isArray(socialLinks)?socialLinks:[];
    state.tshirts=Array.isArray(tshirts)?tshirts:[];
    state.faq=Array.isArray(faq)?faq:[];
    state.homeBanner=Array.isArray(homeBannerData)&&homeBannerData[0]?homeBannerData[0]:{};

    // Render these immediately instead of waiting for the rest of the program.
    renderHomeGuestBanner();
    renderSocialLinks();
    renderSponsors();
    renderTshirts();

    state.mapLayout=Array.isArray(mapLayoutData)&&mapLayoutData[0]?mapLayoutData[0]:{};
    state.mapSettings=Array.isArray(mapSettingsData)&&mapSettingsData[0]?mapSettingsData[0]:{};
    state.directions=Array.isArray(directionsData)&&directionsData[0]?directionsData[0]:{};
    state.celebrityInfo=Array.isArray(celebrityInfo)&&celebrityInfo[0]?celebrityInfo[0]:{};
    state.celebrityPricing=Array.isArray(celebrityPricing)?celebrityPricing:[];
    state.photoOps=Array.isArray(photoOps)?photoOps:[];
    state.autographs=Array.isArray(autographs)?autographs:[];
    state.groupPhotoOps=Array.isArray(groupPhotoOps)?groupPhotoOps:[];
    state.panels=Array.isArray(panels)?panels:[];

    // Refresh stored snapshots using the newest event time/location/title.
    reminderScheduleItems().forEach(event=>{
      if(state.mySchedule.has(event.id))snapshotScheduleEvent(event);
    });

    appDataLastRefreshAt=Date.now();
    appVersionLastCheckedAt=appDataLastRefreshAt;
    const signature=programVersionSignatureFor(resolvedVersionInfo);
    if(signature)appVersionCheckSignature=signature;

    renderAll();

    if(!silent){
      initializePushPromptExperience();
      forcePushPromptForTesting();
    }
  })().finally(()=>{appDataRefreshPromise=null});

  return appDataRefreshPromise;
}

async function maybeRefreshProgramData(reason="version-check"){
  try{
    const elapsed=appDataLastRefreshAt?Date.now()-appDataLastRefreshAt:Infinity;
    const stamp=`v=${Date.now()}`;
    const versionInfo=await fetch(`data/version.json?${stamp}`,{
      cache:"no-store",
      credentials:"same-origin"
    }).then(r=>r.ok?r.json():null).catch(()=>null);

    appVersionLastCheckedAt=Date.now();
    const signature=programVersionSignatureFor(versionInfo);

    if(signature&&!appVersionCheckSignature){
      appVersionCheckSignature=signature;
    }

    if(signature&&appVersionCheckSignature&&signature!==appVersionCheckSignature){
      await loadData({silent:true,force:true,versionInfo});
      console.info(`SFVC app data refreshed: ${reason} (version changed)`);
      return true;
    }

    if(elapsed>=APP_FULL_REFRESH_FALLBACK_MS){
      await loadData({silent:true,force:true,versionInfo:versionInfo||null});
      console.info(`SFVC app data refreshed: ${reason} (fallback refresh)`);
      return true;
    }

    return false;
  }catch(err){
    console.warn(`SFVC app update check failed: ${reason}`,err);
    if(appDataLastRefreshAt&&Date.now()-appDataLastRefreshAt>=APP_FULL_REFRESH_FALLBACK_MS){
      try{
        await loadData({silent:true,force:true});
        console.info(`SFVC app data refreshed: ${reason} (offline fallback)`);
        return true;
      }catch(fallbackErr){
        console.warn(`SFVC app refresh failed: ${reason}`,fallbackErr);
      }
    }
    renderMySchedule();
    return false;
  }
}

async function refreshAppData(reason="manual"){
  try{
    await loadData({silent:true,force:true});
    console.info(`SFVC app data refreshed: ${reason}`);
  }catch(err){
    console.warn(`SFVC app refresh failed: ${reason}`,err);
    renderMySchedule();
  }
}

function startVisibleAppRefresh(){
  clearTimeout(appVisibleRefreshTimer);
  const loop=async()=>{
    if(document.visibilityState==="visible")await maybeRefreshProgramData("visible-interval");
    appVisibleRefreshTimer=setTimeout(loop,withJitter(APP_REFRESH_INTERVAL_MS,0.35));
  };
  appVisibleRefreshTimer=setTimeout(loop,withJitter(APP_REFRESH_INTERVAL_MS,0.35));
}

function startSafetySyncLoops(){
  clearTimeout(deviceSafetySyncTimer);

  const loop=async()=>{
    if(document.visibilityState==="visible"){
      const lastDeviceSync=readTimestampMs("sfvc-device-last-sync");
      if(!lastDeviceSync||Date.now()-lastDeviceSync>=DEVICE_SAFETY_SYNC_MS){
        await syncAnonymousDevice().catch(()=>{});
      }
      await syncSavedAppRegistration().catch(()=>{});
    }

    deviceSafetySyncTimer=setTimeout(loop,withJitter(DEVICE_SAFETY_SYNC_MS,0.20));
  };

  deviceSafetySyncTimer=setTimeout(loop,withJitter(DEVICE_SAFETY_SYNC_MS,0.20));
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

let eventCountdownTimer=null;

function eventStartDateTime(){
  const start=parseISODate(state.settings.startDate);
  if(!start)return null;
  return new Date(start.getFullYear(),start.getMonth(),start.getDate(),14,0,0,0);
}
function eventEndDateTime(){
  const end=parseISODate(state.settings.endDate);
  if(!end)return null;
  return new Date(end.getFullYear(),end.getMonth(),end.getDate(),17,0,0,0);
}
function addCalendarMonthsClamped(date,months){
  const copy=new Date(date);
  const originalDay=copy.getDate();
  copy.setDate(1);
  copy.setMonth(copy.getMonth()+months);
  const lastDay=new Date(copy.getFullYear(),copy.getMonth()+1,0).getDate();
  copy.setDate(Math.min(originalDay,lastDay));
  return copy;
}
function countdownBreakdown(now,target){
  let cursor=new Date(now);
  let months=0;
  while(months<240){
    const next=addCalendarMonthsClamped(cursor,1);
    if(next<=target){cursor=next;months+=1;}
    else break;
  }

  let remaining=Math.max(0,target.getTime()-cursor.getTime());
  const minute=60*1000,hour=60*minute,day=24*hour,week=7*day;
  const weeks=Math.floor(remaining/week);remaining-=weeks*week;
  const days=Math.floor(remaining/day);remaining-=days*day;
  const hours=Math.floor(remaining/hour);remaining-=hours*hour;
  const minutes=Math.floor(remaining/minute);
  return {months,weeks,days,hours,minutes};
}
function setFlipCountdownValue(id,value){
  const el=document.getElementById(id);
  if(!el)return;
  const next=String(Math.max(0,Number(value)||0)).padStart(2,"0");
  if(el.textContent===next)return;
  el.classList.remove("flip-changing");
  void el.offsetWidth;
  el.textContent=next;
  el.classList.add("flip-changing");
}
function renderEventCountdown(){
  const clock=document.getElementById("eventCountdownClock");
  const message=document.getElementById("eventCountdownMessage");
  if(!clock||!message)return;

  const start=eventStartDateTime();
  const end=eventEndDateTime();
  const now=new Date();

  if(!start){
    clock.classList.add("hidden");
    message.classList.remove("hidden");
    message.textContent="EVENT START TIME WILL APPEAR HERE WHEN EVENT DETAILS ARE PUBLISHED.";
    return;
  }

  if(now<start){
    const parts=countdownBreakdown(now,start);
    setFlipCountdownValue("countdownMonths",parts.months);
    setFlipCountdownValue("countdownWeeks",parts.weeks);
    setFlipCountdownValue("countdownDays",parts.days);
    setFlipCountdownValue("countdownHours",parts.hours);
    setFlipCountdownValue("countdownMinutes",parts.minutes);
    clock.classList.remove("hidden");
    message.classList.add("hidden");
    return;
  }

  clock.classList.add("hidden");
  message.classList.remove("hidden");
  message.textContent=end&&now<=end
    ?"★ SCI-FI VALLEY CON IS UNDERWAY ★"
    :"THANK YOU FOR JOINING SCI-FI VALLEY CON";
}
function initializeEventCountdown(){
  renderEventCountdown();
  if(eventCountdownTimer)clearInterval(eventCountdownTimer);
  eventCountdownTimer=setInterval(renderEventCountdown,30000);
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

  renderEventCountdown();

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

document.getElementById("faqSearch")?.addEventListener("input",renderFaq);
document.getElementById("tshirtSearch")?.addEventListener("input",renderTshirts);
document.getElementById("tshirtSort")?.addEventListener("change",renderTshirts);
document.getElementById("closeTshirtImageModal")?.addEventListener("click",()=>document.getElementById("tshirtImageModal")?.close());
document.getElementById("tshirtImageModal")?.addEventListener("click",event=>{
  if(event.target===event.currentTarget)event.currentTarget.close();
});

document.getElementById("openNewsletterSignup")?.addEventListener("click",()=>{
  const modal=document.getElementById("newsletterModal");
  if(modal)modal.showModal();
});
document.getElementById("closeNewsletterModal")?.addEventListener("click",()=>document.getElementById("newsletterModal")?.close());
document.getElementById("newsletterModal")?.addEventListener("click",event=>{
  if(event.target===event.currentTarget)event.currentTarget.close();
});
document.getElementById("closeEventModal")?.addEventListener("click",closeEventDetails);
document.getElementById("eventModal")?.addEventListener("click",event=>{
  if(event.target===event.currentTarget)closeEventDetails();
});
document.getElementById("closeGuestModal").addEventListener("click",()=>document.getElementById("guestModal").close());
document.getElementById("guestModal").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});


function celebrityPublished(){return state.celebrityInfo?.published===true}

function primaryScheduleCategory(e){
  if(e.filterCategory)return e.filterCategory;
  const category=String(e.category||"").trim();
  const title=String(e.title||"").trim();
  const location=String(e.location||"").toLowerCase();

  // Keep these important attendee-facing categories explicit instead of
  // allowing the room name or a generic Gaming category to swallow them.
  if(/trivia/i.test(title)||/trivia/i.test(category))return "Trivia";
  if(/celebrity panel|guest panel|q&a panel|reunion.*panel/i.test(`${title} ${category}`))return "Guest Panels";
  if(/artist/i.test(category))return "Artist Panels";
  if(/costume|cosplay/i.test(category))return "Costume & Cosplay";
  if(/workshop|paint/i.test(category))return "Workshops";
  if(/gaming|game/i.test(category))return "Gaming";
  if(/charity/i.test(category))return "Charity";
  if(/after party/i.test(category))return "After Party";
  if(/activity/i.test(category))return "Activities";
  if(location.includes("event room"))return "Event Room";
  return category||"Other";
}

function panelScheduleItems(){
  if(!celebrityPublished())return [];
  return state.panels
    .filter(p=>p&&p.day&&p.startTime&&p.title)
    .map((p,i)=>({
      id:`panel-${p.id||i}`,
      day:p.day,
      time:p.startTime,
      endTime:p.endTime||"",
      title:p.title,
      location:p.location||state.celebrityInfo.panelRoom||"Panel Room",
      category:"Guest Panel",
      filterCategory:"Guest Panels",
      participants:p.participants||"",
      description:p.description||"",
      remindable:true
    }));
}

function photoOpScheduleItems(){
  if(!celebrityPublished())return [];
  return state.photoOps.map((p,i)=>({
    id:`photoop-${p.id||i}`,
    day:p.day,
    time:p.time,
    title:`${p.title} Photo Op`,
    location:state.celebrityInfo.photoOpLocation||"Photo Op Area",
    category:`Professional Photo Op${p.type?` • ${p.type}`:""}`,
    filterCategory:"Photo Ops",
    remindable:true
  }));
}

function autographScheduleItems(){
  if(!celebrityPublished())return [];
  const items=[];
  state.autographs.forEach((a,guestIndex)=>{
    ["Friday","Saturday","Sunday"].forEach(day=>{
      String(a[day]||"").split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach((windowText,windowIndex)=>{
        items.push({
          id:`autograph-${a.id||guestIndex}-${day}-${windowIndex}`,
          day,
          time:windowText,
          title:`${a.guestName} Autographs`,
          location:"Celebrity Guest Tables",
          category:"Flexible Autograph Availability",
          filterCategory:"Autographs",
          remindable:false
        });
      });
    });
  });
  return items;
}

function baseScheduleItems(){
  return state.schedule.map(e=>({
    ...e,
    id:e.id||stableBaseScheduleId(e),
    filterCategory:primaryScheduleCategory(e),
    remindable:e.remindable!==false
  }));
}

function showScheduleItems(){
  return [...baseScheduleItems(),...panelScheduleItems(),...photoOpScheduleItems(),...autographScheduleItems()];
}

function headlineScheduleItems(){
  return [...baseScheduleItems(),...panelScheduleItems(),...photoOpScheduleItems()];
}

function reminderScheduleItems(){
  return headlineScheduleItems().filter(e=>e.remindable!==false);
}

function parseScheduleStartMinutes(value){
  const m=String(value||"").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if(!m)return 9999;
  let h=Number(m[1]), min=Number(m[2]);
  const ap=m[3].toUpperCase();
  if(ap==="PM"&&h!==12)h+=12;
  if(ap==="AM"&&h===12)h=0;
  return h*60+min;
}

function sortedScheduleItems(items){
  return [...items].sort((a,b)=>parseScheduleStartMinutes(a.time)-parseScheduleStartMinutes(b.time)||String(a.title).localeCompare(String(b.title)));
}

function scheduleCategoriesForDay(day){
  const preferred=["Guest Panels","Trivia","Photo Ops","Autographs","Artist Panels","Event Room","Gaming","Workshops","Costume & Cosplay","Charity","Activities","After Party","Other"];
  const categories=[...new Set(showScheduleItems().filter(e=>e.day===day).map(primaryScheduleCategory))];
  return categories.sort((a,b)=>{
    const ai=preferred.indexOf(a), bi=preferred.indexOf(b);
    if(ai!==-1||bi!==-1)return (ai===-1?999:ai)-(bi===-1?999:bi);
    return a.localeCompare(b);
  });
}

function scheduleCardHtml(e){
  const saved=state.mySchedule.has(e.id);
  const category=primaryScheduleCategory(e);
  const saveButton=e.remindable===false
    ? `<span class="schedule-no-reminder" title="Flexible availability">FLEX</span>`
    : `<button class="schedule-save ${saved?"saved":""}" data-schedule-save="${e.id}">${saved?"🔔":"♡"}</button>`;

  return `<article class="schedule-card" data-schedule-category="${category}">
    <div class="schedule-time">${e.time}</div>
    <div>
      <strong>${e.title.toUpperCase()}</strong>
      <div class="meta">${e.location} • ${e.category}</div>
      <span class="schedule-category-tag">${category}</span>
      ${saved&&state.reminderMinutes>0&&e.remindable!==false?`<button type="button" class="schedule-reminder-label" data-open-reminder-settings aria-label="Change reminder time. Current setting: ${escapeAppHtml(formatReminder(state.reminderMinutes))}">🔔 ${formatReminder(state.reminderMinutes)} <span>CHANGE</span></button>`:""}
    </div>
    ${saveButton}
  </article>`;
}

function bindScheduleSaveButtons(){
  document.querySelectorAll("[data-schedule-save]").forEach(b=>{
    if(b.dataset.bound==="yes")return;
    b.dataset.bound="yes";
    b.addEventListener("click",()=>toggleScheduleItem(b.dataset.scheduleSave));
  });
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


function localDateKey(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function eventStatusScheduleItems(){
  // Keep the Home status focused on actual convention programming and guest panels.
  // Professional photo ops remain available in the full Show Schedule and Celebrity Guide.
  return [...baseScheduleItems(),...panelScheduleItems()];
}

function statusCardHtml(label,title,meta="",accent=""){
  return `<article class="status-card event-status-card ${accent}">
    <span class="event-status-label">${escapeAppHtml(label)}</span>
    <strong>${escapeAppHtml(title)}</strong>
    ${meta?`<div class="meta">${escapeAppHtml(meta)}</div>`:""}
  </article>`;
}

function renderStatus(){
  const heading=document.getElementById("nowHeading");
  const host=document.getElementById("happeningNow");
  if(!heading||!host)return;

  const start=parseISODate(state.settings.startDate);
  const end=parseISODate(state.settings.endDate);
  const now=new Date();

  if(!start||!end){
    heading.textContent="EVENT STATUS";
    host.innerHTML=statusCardHtml(
      "PROGRAM UPDATE",
      "EVENT INFORMATION IS BEING UPDATED",
      "Check the Show Schedule and Event Guide for the latest convention information.",
      "status-neutral"
    );
    return;
  }

  // Treat the whole event as local calendar days, not UTC timestamps.
  const todayKey=localDateKey(now);
  const startKey=localDateKey(start);
  const endKey=localDateKey(end);

  if(todayKey<startKey){
    const todayNoon=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12,0,0);
    const startNoon=new Date(start.getFullYear(),start.getMonth(),start.getDate(),12,0,0);
    const days=Math.max(1,Math.ceil((startNoon-todayNoon)/(24*60*60*1000)));
    heading.textContent="COUNTDOWN TO SCI-FI VALLEY CON";
    host.innerHTML=statusCardHtml(
      `${days} DAY${days===1?"":"S"} TO GO`,
      `THE SHOW STARTS ${formatEventDateRange(false)}`,
      `${eventLocationText()} • Open the Show Schedule to start planning your weekend.`,
      "status-countdown"
    );
    return;
  }

  if(todayKey>endKey){
    heading.textContent="THANK YOU FOR JOINING US";
    host.innerHTML=statusCardHtml(
      "EVENT COMPLETE",
      "THIS SCI-FI VALLEY CON HAS WRAPPED",
      "Thank you for being part of the weekend. Watch the app and Sci-Fi Valley Con channels for future announcements.",
      "status-complete"
    );
    return;
  }

  const dayDates=eventDayDates();
  const eventDay=Object.entries(dayDates).find(([,date])=>date===todayKey)?.[0]||"";
  if(!eventDay){
    heading.textContent="EVENT STATUS";
    host.innerHTML=statusCardHtml(
      "AT THE CON",
      "SCI-FI VALLEY CON IS UNDERWAY",
      "Open the Show Schedule for today's latest activities, panels and times.",
      "status-live"
    );
    return;
  }

  const items=sortedScheduleItems(eventStatusScheduleItems().filter(item=>item.day===eventDay));
  if(!items.length){
    heading.textContent=`${eventDay.toUpperCase()} AT THE CON`;
    host.innerHTML=statusCardHtml(
      "LIVE PROGRAM",
      "TODAY'S SCHEDULE IS BEING UPDATED",
      "Check the Show Schedule and Event Guide for the latest information as it is published.",
      "status-neutral"
    );
    return;
  }

  const nowMinutes=now.getHours()*60+now.getMinutes();
  const valid=items.filter(item=>parseScheduleStartMinutes(item.time)<9999);
  const recentlyStarted=[...valid].reverse().find(item=>{
    const minutes=parseScheduleStartMinutes(item.time);
    return minutes<=nowMinutes&&minutes>=nowMinutes-45;
  });
  const upcoming=valid.filter(item=>parseScheduleStartMinutes(item.time)>nowMinutes).slice(0,recentlyStarted?2:3);

  if(recentlyStarted||upcoming.length){
    heading.textContent=recentlyStarted?"HAPPENING NOW & UP NEXT":"UP NEXT";
    const cards=[];
    if(recentlyStarted){
      cards.push(statusCardHtml(
        "STARTED RECENTLY",
        recentlyStarted.title,
        `${recentlyStarted.time} • ${recentlyStarted.location} • ${primaryScheduleCategory(recentlyStarted)}`,
        "status-live"
      ));
    }
    upcoming.forEach((item,index)=>cards.push(statusCardHtml(
      index===0?"UP NEXT":"COMING UP",
      item.title,
      `${item.time}${item.endTime?`–${item.endTime}`:""} • ${item.location} • ${primaryScheduleCategory(item)}`,
      index===0?"status-next":""
    )));
    host.innerHTML=cards.join("");
    return;
  }

  const nextDay=eventDay==="Friday"?"Saturday":eventDay==="Saturday"?"Sunday":"";
  heading.textContent="TODAY'S PROGRAM";
  host.innerHTML=statusCardHtml(
    "SCHEDULE UPDATE",
    nextDay?`TODAY'S LISTED ACTIVITIES HAVE WRAPPED`:`THE FINAL LISTED ACTIVITIES HAVE WRAPPED`,
    nextDay?`We'll see you again ${nextDay}. Check the Show Schedule for tomorrow's lineup.`:"Thank you for spending the weekend with Sci-Fi Valley Con.",
    "status-complete"
  );
}

function renderDayFilters(){
  const days=["Friday","Saturday","Sunday"];
  const c=document.getElementById("dayFilters");
  c.innerHTML=days.map(d=>`<button class="chip ${d===state.dayFilter?"active":""}" data-day="${d}">${d.toUpperCase()}</button>`).join("");
  c.querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{
    state.dayFilter=b.dataset.day;
    renderDayFilters();
    renderScheduleCategoryFilters();
    renderSchedule();
  }));
}

function renderScheduleCategoryFilters(){
  const container=document.getElementById("scheduleCategoryFilters");
  if(!container)return;
  const categories=scheduleCategoriesForDay(state.dayFilter);

  container.innerHTML=categories.map(category=>{
    const checked=!state.scheduleHiddenCategories.has(category);
    return `<label class="schedule-check ${checked?"checked":""}">
      <input type="checkbox" value="${category}" ${checked?"checked":""}>
      <span class="schedule-check-box">✓</span>
      <span>${category.toUpperCase()}</span>
    </label>`;
  }).join("")||`<div class="muted-empty">No schedule categories are available for this day yet.</div>`;

  container.querySelectorAll('input[type="checkbox"]').forEach(input=>input.addEventListener("change",()=>{
    const category=input.value;
    input.checked?state.scheduleHiddenCategories.delete(category):state.scheduleHiddenCategories.add(category);
    localStorage.setItem("sfvc-schedule-hidden-categories",JSON.stringify([...state.scheduleHiddenCategories]));
    renderScheduleCategoryFilters();
    renderSchedule();
  }));

  const summary=document.getElementById("scheduleFilterSummary");
  if(summary){
    const visible=categories.filter(c=>!state.scheduleHiddenCategories.has(c)).length;
    summary.textContent=`SHOWING ${visible} OF ${categories.length} CATEGORIES`;
  }
}

function renderSchedule(){
  const items=sortedScheduleItems(
    showScheduleItems().filter(e=>
      e.day===state.dayFilter &&
      !state.scheduleHiddenCategories.has(primaryScheduleCategory(e))
    )
  );
  document.getElementById("scheduleList").innerHTML=items.map(scheduleCardHtml).join("")||
    `<div class="paper-panel muted-empty">No schedule items match the selected categories.</div>`;
  bindScheduleSaveButtons();
}


function formatReminder(m){if(m===0)return"No reminder";if(m===60)return"1 hour before";return`${m} minutes before`}
function toggleScheduleItem(id){
  if(state.mySchedule.has(id)){
    state.mySchedule.delete(id);
    delete savedScheduleSnapshots[id];
    saveScheduleSnapshots();
  }else{
    state.mySchedule.add(id);
    const event=reminderScheduleItems().find(e=>e.id===id);
    if(event)snapshotScheduleEvent(event);
  }
  localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));
  renderSchedule();renderCelebrityGuide();renderMySchedule();scheduleAllReminders();scheduleAnonymousDeviceSync();
}
function removeScheduleItem(id){
  state.mySchedule.delete(id);
  delete savedScheduleSnapshots[id];
  saveScheduleSnapshots();
  localStorage.setItem("sfvc-my-schedule",JSON.stringify([...state.mySchedule]));
  renderSchedule();renderCelebrityGuide();renderMySchedule();scheduleAllReminders();scheduleAnonymousDeviceSync();
}
function renderMySchedule(){
  const liveById=new Map(reminderScheduleItems().map(e=>[e.id,e]));
  const saved=[...state.mySchedule].map(id=>{
    const live=liveById.get(id);
    if(live){
      snapshotScheduleEvent(live);
      return live;
    }
    const snapshot=savedScheduleSnapshots[id];
    return snapshot?{...snapshot,_snapshot:true}:null;
  }).filter(Boolean);

  saved.sort((a,b)=>{
    const da=eventDateTime(a)?.getTime()||Number.MAX_SAFE_INTEGER;
    const db=eventDateTime(b)?.getTime()||Number.MAX_SAFE_INTEGER;
    return da-db;
  });

  const preview=document.getElementById("schedulePreview"),
        list=document.getElementById("settingsScheduleList");

  updateCombinedSavedCount();

  if(!saved.length){
    if(preview)preview.innerHTML='<div class="muted-empty">Tap the bell on a schedule item to add it to My Schedule.</div>';
    if(list)list.innerHTML='<div class="muted-empty">Your saved schedule is empty.</div>';
    return;
  }

  const markup=saved.map(e=>`
    <div class="saved-schedule-item${e._snapshot?" saved-schedule-snapshot":""}">
      <div>
        <strong>${escapeAppHtml(e.title)}</strong>
        <div class="meta">${escapeAppHtml(e.day)} • ${escapeAppHtml(e.time)} • ${escapeAppHtml(e.location)}</div>
        ${e._snapshot?'<div class="saved-sync-note">REFRESHING CURRENT SCHEDULE…</div>':""}
      </div>
      <button class="schedule-remove" data-remove-schedule="${escapeAppHtml(e.id)}" aria-label="Remove ${escapeAppHtml(e.title)}">×</button>
    </div>`).join("");

  if(preview)preview.innerHTML=markup;
  if(list)list.innerHTML=markup;

  document.querySelectorAll("[data-remove-schedule]").forEach(button=>{
    button.addEventListener("click",()=>removeScheduleItem(button.dataset.removeSchedule));
  });
}

function updateCombinedSavedCount(){
  const b=document.getElementById("favoriteCount");
  if(!b)return;
  const liveIds=new Set(reminderScheduleItems().map(e=>e.id));
  const scheduleCount=[...state.mySchedule].filter(id=>liveIds.has(id)||savedScheduleSnapshots[id]).length;
  b.textContent=`${state.favorites.size+scheduleCount} SAVED`;
}
function eventDateTime(e){const d=eventDayDates()[e.day];const m=e.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);if(!d||!m)return null;let h=+m[1];if(m[3].toUpperCase()==="PM"&&h!==12)h+=12;if(m[3].toUpperCase()==="AM"&&h===12)h=0;return new Date(`${d}T${String(h).padStart(2,"0")}:${m[2]}:00`)}
let reminderSyncTimer=null;
let reminderSyncInFlight=null;

function buildServerReminderPayload(){
  if(!state.reminderMinutes)return [];
  const now=Date.now();

  return reminderScheduleItems()
    .filter(e=>state.mySchedule.has(e.id)&&e.remindable!==false)
    .map(e=>{
      const eventTime=eventDateTime(e);
      if(!eventTime)return null;

      const eventAt=eventTime.getTime();
      const notifyAt=eventAt-(state.reminderMinutes*60000);
      if(notifyAt<=now)return null;

      return {
        key:`${e.id}:${state.reminderMinutes}`,
        eventId:e.id,
        title:`${e.title} starts soon`,
        body:`${e.time} • ${e.location}`,
        url:"/",
        tag:`sfvc-reminder-${String(e.id).replace(/[^A-Za-z0-9_-]/g,"-").slice(0,20)}`,
        urgency:"high",
        notifyAt,
        eventAt
      };
    })
    .filter(Boolean);
}

async function syncServerReminders({force=false}={}){
  const result=await syncAnonymousDevice({force});

  if(result?.ok&&result.pushLinked){
    localStorage.setItem("sfvc-reminders-last-sync",new Date().toISOString());
    const next=result.nextNotifyAt
      ? new Date(Number(result.nextNotifyAt)).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})
      : "NONE";
    updateReminderDeliveryStatus(
      `SERVER REMINDERS READY • ${Number(result.remindersSaved||0)} SAVED • NEXT ${next}`,
      "ready"
    );
  }else if(result?.ok&&!result.pushLinked){
    updateReminderDeliveryStatus(
      "PUSH IS NOT LINKED TO THIS DEVICE • RECONNECT EVENT ALERTS",
      "warning"
    );
  }else if(result?.error){
    updateReminderDeliveryStatus("BACKGROUND REMINDERS NEED CONNECTION","warning");
  }

  return result;
}

function scheduleServerReminderSync(delay=250){
  clearTimeout(reminderSyncTimer);
  reminderSyncTimer=setTimeout(()=>syncServerReminders().catch(()=>{}),delay);
}

function updateReminderDeliveryStatus(message="",kind=""){
  const el=document.getElementById("reminderDeliveryStatus");
  if(!el)return;

  if(message){
    el.textContent=message;
    el.dataset.kind=kind;
    return;
  }

  if(!notificationsSupported()){
    el.textContent="BACKGROUND REMINDERS NOT SUPPORTED ON THIS DEVICE";
    el.dataset.kind="warning";
  }else if(Notification.permission!=="granted"){
    el.textContent="ENABLE NOTIFICATIONS FOR BACKGROUND REMINDERS";
    el.dataset.kind="warning";
  }else if(pushWasExplicitlyDisabled()){
    el.textContent="EVENT ALERT CONNECTION IS OFF";
    el.dataset.kind="warning";
  }else{
    const last=localStorage.getItem("sfvc-reminders-last-sync");
    el.textContent=last?"BACKGROUND REMINDERS CONNECTED":"BACKGROUND REMINDERS CONNECTING…";
    el.dataset.kind=last?"ready":"";
  }
}

function scheduleAllReminders(){
  // Foreground fallback. The push Worker is the reliable background delivery path.
  for(const t of state.reminderTimers.values())clearTimeout(t);
  state.reminderTimers.clear();

  if(state.reminderMinutes){
    const now=Date.now();
    reminderScheduleItems()
      .filter(e=>state.mySchedule.has(e.id)&&e.remindable!==false)
      .forEach(e=>{
        const t=eventDateTime(e);
        if(!t)return;
        const delay=t.getTime()-state.reminderMinutes*60000-now;
        if(delay>0&&delay<=2147483647){
          state.reminderTimers.set(e.id,setTimeout(()=>showScheduleNotification(e),delay));
        }
      });
  }

  updateReminderDeliveryStatus();
  scheduleServerReminderSync();
}

async function showScheduleNotification(e){
  if(!("Notification"in window)||Notification.permission!=="granted")return;
  const reg=await navigator.serviceWorker?.ready;
  if(reg)reg.showNotification(`${e.title} starts soon`,{
    body:`${e.time} • ${e.location}`,
    icon:"assets/icons/app-icon-192.png",
    badge:"assets/icons/app-icon-192.png",
    tag:`sfvc-local-${e.id}`,
    data:{url:"./"}
  });
}



async function refreshAnonymousDeviceStatus(){
  const status=document.getElementById("reminderDeliveryStatus");
  if(!status)return;

  try{
    const response=await fetch(`${pushApiBase()}/v1/device/status`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({deviceId:getAnonymousDeviceId()})
    });

    const result=await response.json().catch(()=>({}));
    if(!response.ok||!result.ok)return;

    if(!result.pushLinked){
      status.textContent="PUSH IS NOT LINKED TO THIS DEVICE • RECONNECT EVENT ALERTS";
      status.dataset.kind="warning";
      return;
    }

    if(result.next?.notify_at){
      const next=new Date(Number(result.next.notify_at));
      status.textContent=`SERVER REMINDERS CONNECTED • NEXT ${next.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`;
      status.dataset.kind="ready";
    }else{
      status.textContent=`SERVER REMINDERS CONNECTED • ${Number(result.favorites||0)} SAVED`;
      status.dataset.kind="ready";
    }
  }catch(err){
    console.warn("Could not read anonymous device status",err);
  }
}

async function refreshRemoteReminderStatus(){
  const copy=document.getElementById("testReminderStatus");
  if(!copy||!notificationsSupported()||Notification.permission!=="granted")return;

  try{
    const subscription=await getPushSubscription();
    if(!subscription)return;

    const response=await fetch(`${pushApiBase()}/v1/reminders/status`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({endpoint:subscription.endpoint,deviceId:getAnonymousDeviceId()})
    });
    if(!response.ok)return;

    const result=await response.json();
    const last=result.last;
    const delivery=result.lastDelivery;
    if(!last)return;

    if(delivery&&String(last.reminder_key||"").startsWith("test:")){
      const statusCode=Number(delivery.push_service_status||0);
      const type=String(delivery.delivery_type||"").toUpperCase();
      if(delivery.outcome==="accepted"){
        copy.textContent=`REMOTE PUSH ACCEPTED BY PUSH SERVICE • ${type}${statusCode?` • HTTP ${statusCode}`:""}`;
        copy.dataset.kind="ready";
      }else if(delivery.outcome==="error"){
        copy.textContent=`REMOTE PUSH ERROR • ${type}${statusCode?` • HTTP ${statusCode}`:""}`;
        copy.dataset.kind="warning";
      }
    }

    if(String(last.reminder_key||"").startsWith("test:")){
      if(last.status==="delivered"){
        const delivered=last.delivered_at?new Date(Number(last.delivered_at)):null;
        copy.textContent=`LAST REMOTE TEST: DELIVERED${delivered?` • ${delivered.toLocaleTimeString([],{hour:"numeric",minute:"2-digit",second:"2-digit"})}`:""}`;
        copy.dataset.kind="ready";
      }else{
        copy.textContent=`LAST REMOTE TEST STATUS: ${String(last.status||"unknown").toUpperCase()}`;
        copy.dataset.kind=last.status==="queued"?"ready":"warning";
      }
    }
  }catch(err){
    console.warn("Could not read remote reminder status",err);
  }
}

async function scheduleReminderDeliveryTest(){
  const button=document.getElementById("testReminderButton");
  const copy=document.getElementById("testReminderStatus");

  if(button){
    button.disabled=true;
    button.textContent="SCHEDULING…";
  }

  try{
    if(!notificationsSupported())throw new Error("This device does not support Web Push.");
    if(Notification.permission!=="granted")throw new Error("Enable Event Alerts first so this device can receive the test.");
    if(pushWasExplicitlyDisabled())throw new Error("Event Alerts are disabled inside the app.");

    await ensurePushSubscriptionHealthy({force:true});
    const subscription=await getPushSubscription();
    if(!subscription)throw new Error("The push subscription could not be created.");

    const response=await fetch(`${pushApiBase()}/v1/reminders/test`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({endpoint:subscription.endpoint,delaySeconds:60})
    });

    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||`Test scheduling returned ${response.status}.`);

    if(copy){
      const time=new Date(result.notifyAt);
      copy.textContent=`REMOTE TEST QUEUED. Close the app and lock the iPhone now. It should arrive around ${time.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}, without reopening the app.`;
      copy.dataset.kind="ready";
    }
  }catch(err){
    if(copy){
      copy.textContent=err.message||"The reminder test could not be scheduled.";
      copy.dataset.kind="warning";
    }
  }finally{
    if(button){
      button.disabled=false;
      button.textContent="TEST LOCK-SCREEN PUSH IN 1 MINUTE";
    }
  }
}

function updateReminderUI(){
  const s=document.getElementById("reminderSettingSummary");
  if(s)s.textContent=state.reminderMinutes?`${formatReminder(state.reminderMinutes)} for My Schedule events`:"No reminders for My Schedule events";
  document.querySelectorAll('input[name="reminder"]').forEach(i=>i.checked=+i.value===state.reminderMinutes);
  renderSchedule();
  renderMySchedule();
  scheduleAllReminders();
  refreshRemoteReminderStatus().catch(()=>{});
  refreshAnonymousDeviceStatus().catch(()=>{});
}


const PUSH_BANNER_DELAY_MS=30*60*1000;
const PUSH_REOPEN_RESET_MS=30000;
const PUSH_HEALTH_RECHECK_MS=5*60*1000;
const PUSH_ENABLED_KEY="sfvc-push-enabled";
const PUSH_DISABLED_KEY="sfvc-push-user-disabled";
let pushBannerEligible=false;
let pushBannerTimer=null;
let pushPromptShownThisSession=false;
let pushLastHiddenAt=0;
let pushHealthRepairPromise=null;
let pushHealthLastCheckedAt=0;

function pushWasPreviouslyEnabled(){
  return localStorage.getItem(PUSH_ENABLED_KEY)==="yes";
}
function pushWasExplicitlyDisabled(){
  return localStorage.getItem(PUSH_DISABLED_KEY)==="yes";
}
function rememberPushEnabled(){
  localStorage.setItem(PUSH_ENABLED_KEY,"yes");
  localStorage.removeItem(PUSH_DISABLED_KEY);
}
function rememberPushDisabled(){
  localStorage.removeItem(PUSH_ENABLED_KEY);
  localStorage.setItem(PUSH_DISABLED_KEY,"yes");
}

function notificationsSupported(){
  return ("Notification" in window)&&("serviceWorker" in navigator)&&("PushManager" in window);
}

async function hasActivePushSubscription(){
  if(!notificationsSupported())return false;
  if(Notification.permission!=="granted")return false;
  if(pushWasExplicitlyDisabled())return false;

  const subscription=await getPushSubscription().catch(()=>null);
  if(subscription){
    rememberPushEnabled();
    return true;
  }

  // iOS can occasionally return no PushManager subscription during a service
  // worker/app lifecycle transition even though notification permission is still
  // enabled in Settings. Preserve the user's enabled state and repair it silently.
  if(pushWasPreviouslyEnabled()){
    ensurePushSubscriptionHealthy().catch(()=>{});
    return true;
  }

  // If iOS permission is still granted and the user has never explicitly
  // disabled alerts inside the app, treat the OS permission as an enabled intent.
  // The health check below recreates the Web Push subscription if necessary.
  ensurePushSubscriptionHealthy().catch(()=>{});
  return true;
}

function closePushPrompt(){
  const modal=document.getElementById("pushPromptModal");
  if(!modal)return;
  if(typeof modal.close==="function"&&modal.open)modal.close();
  else modal.removeAttribute("open");
}

async function showPushPromptForSession(){
  if(pushPromptShownThisSession)return;
  pushPromptShownThisSession=true;

  const modal=document.getElementById("pushPromptModal");
  const enable=document.getElementById("pushPromptEnableButton");
  const copy=document.getElementById("pushPromptCopy");
  const foot=document.getElementById("pushPromptFootnote");
  if(!modal||!enable||!copy)return;

  if(!notificationsSupported()){
    copy.textContent="This browser or device does not currently support Web Push notifications for this app.";
    enable.classList.add("hidden");
    if(foot)foot.textContent="You can still use My Schedule and the rest of the app normally.";
  }else if(Notification.permission==="denied"){
    copy.textContent="Notifications are currently blocked in your browser or device settings. To receive event alerts, allow notifications for Sci-Fi Valley Con in your browser or device settings.";
    enable.classList.add("hidden");
    if(foot)foot.textContent="After allowing notifications in your device settings, reopen the app.";
  }else{
    enable.classList.remove("hidden");
    enable.disabled=false;
    enable.textContent=Notification.permission==="granted"?"FINISH ENABLING":"ENABLE NOTIFICATIONS";
    if(foot)foot.textContent="You can change your notification settings at any time from Notification Settings.";
  }

  if(typeof modal.showModal==="function")modal.showModal();
  else modal.setAttribute("open","");
}

function startPushBannerTimer(){
  clearTimeout(pushBannerTimer);
  pushBannerEligible=false;

  pushBannerTimer=setTimeout(async()=>{
    if(await hasActivePushSubscription()){
      pushBannerEligible=false;
      updatePushOptInBanner();
      return;
    }
    if(!notificationsSupported()||Notification.permission==="denied"){
      pushBannerEligible=false;
      updatePushOptInBanner();
      return;
    }
    pushBannerEligible=true;
    updatePushOptInBanner();
  },PUSH_BANNER_DELAY_MS);
}

async function updatePushOptInBanner(){
  const banner=document.getElementById("pushOptInBanner");
  const enable=document.getElementById("pushBannerEnableButton");
  if(!banner||!enable)return;

  if(!notificationsSupported()||Notification.permission==="denied"){
    banner.classList.add("hidden");
    return;
  }

  const subscribed=await hasActivePushSubscription();
  if(subscribed){
    banner.classList.add("hidden");
    pushBannerEligible=false;
    clearTimeout(pushBannerTimer);
    return;
  }

  if(!pushBannerEligible){
    banner.classList.add("hidden");
    return;
  }

  banner.classList.remove("hidden");
  enable.disabled=false;
  enable.textContent=Notification.permission==="granted"?"FINISH ENABLING":"ENABLE NOTIFICATIONS";
}


function forcePushPromptForTesting(){
  const params=new URLSearchParams(location.search);
  if(params.get("forcePushPrompt")!=="1")return;
  pushPromptShownThisSession=false;
  setTimeout(()=>showPushPromptForSession(),300);
}

async function initializePushPromptExperience({forceSessionPrompt=false}={}){
  const subscribed=await hasActivePushSubscription();

  if(subscribed){
    pushPromptShownThisSession=true;
    pushBannerEligible=false;
    clearTimeout(pushBannerTimer);
    closePushPrompt();
    updatePushOptInBanner();
    return;
  }

  if(forceSessionPrompt)pushPromptShownThisSession=false;

  setTimeout(()=>showPushPromptForSession(),450);
  startPushBannerTimer();
}

async function enablePushFromBanner(){
  const button=document.getElementById("pushBannerEnableButton");
  if(button){
    button.disabled=true;
    button.textContent="ENABLING…";
  }

  try{
    await enablePushNotifications();
  }catch(err){
    console.warn("Banner push opt-in failed",err);
  }

  if(await hasActivePushSubscription()){
    pushBannerEligible=false;
    clearTimeout(pushBannerTimer);
    closePushPrompt();
  }

  await updatePushOptInBanner();
}

async function enablePushFromPrompt(){
  const button=document.getElementById("pushPromptEnableButton");
  if(button){
    button.disabled=true;
    button.textContent="ENABLING…";
  }

  try{
    await enablePushNotifications();
  }catch(err){
    console.warn("Prompt push opt-in failed",err);
  }

  const subscribed=await hasActivePushSubscription();
  if(subscribed){
    closePushPrompt();
    pushBannerEligible=false;
    clearTimeout(pushBannerTimer);
  }else if(button){
    button.disabled=false;
    button.textContent=Notification.permission==="granted"?"FINISH ENABLING":"ENABLE NOTIFICATIONS";
  }

  await updatePushOptInBanner();
}






/* Anonymous app-usage analytics — V3.8.4
   Starts independently of the rest of the app and uses redundant browser-safe
   delivery methods. D1 deduplicates by day + anonymous installation ID. */
const ANALYTICS_ID_KEY="sfvc-anonymous-analytics-id";
const ANALYTICS_HEARTBEAT_MS=180000;
const ANALYTICS_RETRY_MS=10000;
const ANALYTICS_FALLBACK_BASE="https://notify.scifivalleycon.com";
let analyticsHeartbeatTimer=null;
let analyticsRetryTimer=null;
let analyticsLastSuccessfulSend=0;
let analyticsInitialized=false;
let analyticsBeaconSequence=0;

function getAnonymousAnalyticsId(){
  let id=localStorage.getItem(ANALYTICS_ID_KEY);
  if(id)return id;

  if(globalThis.crypto?.randomUUID){
    id=crypto.randomUUID();
  }else{
    const bytes=new Uint8Array(16);
    crypto.getRandomValues(bytes);
    id=[...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  localStorage.setItem(ANALYTICS_ID_KEY,id);
  return id;
}

function analyticsApiBase(){
  return String(
    state?.settings?.pushApiUrl ||
    DEFAULT_SETTINGS?.pushApiUrl ||
    ANALYTICS_FALLBACK_BASE
  ).replace(/\/+$/,"");
}

function buildAnalyticsPingUrl(eventType="heartbeat"){
  const params=new URLSearchParams({
    id:getAnonymousAnalyticsId(),
    e:String(eventType||"heartbeat").slice(0,20),
    n:String(++analyticsBeaconSequence),
    t:String(Date.now())
  });
  return `${analyticsApiBase()}/v1/app/ping.svg?${params.toString()}`;
}

function scheduleAnalyticsRetry(){
  clearTimeout(analyticsRetryTimer);
  analyticsRetryTimer=setTimeout(()=>{
    if(document.visibilityState==="visible"){
      sendAnalyticsHeartbeat("retry",{force:true});
    }
  },ANALYTICS_RETRY_MS);
}

function sendAnalyticsDomBeacon(url){
  return new Promise(resolve=>{
    const image=document.createElement("img");
    image.alt="";
    image.width=1;
    image.height=1;
    image.setAttribute("aria-hidden","true");
    image.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;";

    let finished=false;
    const finish=ok=>{
      if(finished)return;
      finished=true;
      clearTimeout(timeout);
      image.remove();
      resolve(ok);
    };

    const timeout=setTimeout(()=>finish(false),8000);
    image.onload=()=>finish(true);
    image.onerror=()=>finish(false);

    // Appending the element before setting src ensures the browser treats this
    // exactly like a normal page image request, even in installed PWA mode.
    (document.body||document.documentElement).appendChild(image);
    image.src=url;
  });
}

function sendAnalyticsNoCorsFetch(url){
  // This is deliberately redundant. Even if the browser does not expose the
  // response because it is cross-origin, the GET can still reach the Worker.
  fetch(url,{
    method:"GET",
    mode:"no-cors",
    credentials:"omit",
    cache:"no-store",
    keepalive:true
  }).catch(()=>{});
}

async function sendAnalyticsHeartbeat(eventType="heartbeat",{force=false}={}){
  if(document.visibilityState==="hidden")return false;

  const now=Date.now();
  if(!force && eventType!=="open" && now-analyticsLastSuccessfulSend<90000)return true;

  const url=buildAnalyticsPingUrl(eventType);

  // Use a single primary request so convention-scale traffic does not double up.
  const success=await sendAnalyticsDomBeacon(url);

  if(success){
    analyticsLastSuccessfulSend=Date.now();
    clearTimeout(analyticsRetryTimer);
    return true;
  }

  // Fallback one-way request in case the image load is blocked by the browser.
  sendAnalyticsNoCorsFetch(url);
  console.warn("App activity beacon did not complete. Retrying shortly.");
  scheduleAnalyticsRetry();
  return false;
}

function initializeAppAnalytics(){
  if(analyticsInitialized)return;
  analyticsInitialized=true;

  // Start immediately. This no longer depends on data JSON, rendering,
  // notification setup, or any other attendee-app feature completing first.
  sendAnalyticsHeartbeat("open",{force:true});

  clearInterval(analyticsHeartbeatTimer);
  analyticsHeartbeatTimer=setInterval(()=>{
    if(document.visibilityState==="visible"){
      sendAnalyticsHeartbeat("heartbeat");
    }
  },ANALYTICS_HEARTBEAT_MS);

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      sendAnalyticsHeartbeat("foreground",{force:true});
    }
  });

  window.addEventListener("pageshow",()=>{
    sendAnalyticsHeartbeat("pageshow",{force:true});
  });
  window.addEventListener("focus",()=>sendAnalyticsHeartbeat("focus"));
  window.addEventListener("online",()=>sendAnalyticsHeartbeat("online",{force:true}));
}


function normalizedRegistrationProfileFromForm(){
  const name=String(document.getElementById("registrationName")?.value||"").trim();
  const pronouns=String(document.getElementById("registrationPronouns")?.value||"").trim();
  const email=String(document.getElementById("registrationEmail")?.value||"").trim().toLowerCase();
  const phone=String(document.getElementById("registrationPhone")?.value||"").trim();
  if(!name)throw new Error("Please enter your name.");
  if(!email)throw new Error("Please enter your email address.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error("Please enter a valid email address.");
  if(!phone)throw new Error("Please enter your phone number.");
  return {name,pronouns,email,phone};
}

function renderAppRegistration(){
  const profile=loadAppRegistration();
  const registered=Boolean(profile?.name&&profile?.email&&profile?.phone);
  const title=document.getElementById("registrationStatusTitle");
  const copy=document.getElementById("registrationStatusCopy");
  const badge=document.getElementById("registrationStatusBadge");
  const menu=document.getElementById("registrationMenuSummary");
  const saveButton=document.getElementById("saveAppRegistration");
  const removeButton=document.getElementById("removeAppRegistration");
  const deviceId=document.getElementById("registrationDeviceId");

  if(deviceId)deviceId.textContent=getAnonymousDeviceId();
  if(title)title.textContent=registered?"REGISTERED":"NOT REGISTERED";
  if(copy)copy.textContent=registered
    ? `Registered to ${profile.name}${profile.pronouns?` • ${profile.pronouns}`:""}. You can update this anytime.`
    : "Complete the form below to register this app installation.";
  if(badge){
    badge.textContent=registered?"✓":"ID";
    badge.classList.toggle("registered",registered);
  }
  if(menu)menu.textContent=registered?`Registered to ${profile.name}`:"Add your name, pronouns and contact information";
  const utilitySummary=document.getElementById("utilityRegistrationSummary");
  if(utilitySummary)utilitySummary.textContent=registered?`Registered to ${profile.name}`:"Add your attendee profile";
  if(saveButton)saveButton.textContent=registered?"UPDATE REGISTRATION":"REGISTER THIS APP";
  removeButton?.classList.toggle("hidden",!registered);

  const fields={
    registrationName:profile?.name||"",
    registrationPronouns:profile?.pronouns||"",
    registrationEmail:profile?.email||"",
    registrationPhone:profile?.phone||""
  };
  Object.entries(fields).forEach(([id,value])=>{
    const input=document.getElementById(id);
    if(input&&document.activeElement!==input)input.value=value;
  });
}

async function sendAppRegistrationToServer(profile){
  const base=pushApiBase();
  if(!base)throw new Error("Registration service is not configured.");
  const response=await fetch(`${base}/v1/profile/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      deviceId:getAnonymousDeviceId(),
      name:profile.name,
      pronouns:profile.pronouns,
      email:profile.email,
      phone:profile.phone,
      appVersion:APP_BUILD_VERSION,
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||""
    })
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||`Registration service returned ${response.status}.`);
  return result;
}

const APP_REGISTRATION_LAST_SYNC_KEY="sfvc-registration-last-sync";

function markAppRegistrationSynced(){
  localStorage.setItem(APP_REGISTRATION_LAST_SYNC_KEY,new Date().toISOString());
}

async function syncSavedAppRegistration({force=false}={}){
  const profile=loadAppRegistration();
  if(!profile?.name||!profile?.email||!profile?.phone)return false;

  const lastSync=readTimestampMs(APP_REGISTRATION_LAST_SYNC_KEY);
  if(!force&&lastSync&&Date.now()-lastSync<REGISTRATION_SYNC_SAFETY_MS)return true;

  try{
    await sendAppRegistrationToServer(profile);
    markAppRegistrationSynced();
    return true;
  }catch(err){
    console.warn("Saved app registration could not sync",err);
    return false;
  }
}

async function submitAppRegistration(event){
  event?.preventDefault();
  const status=document.getElementById("registrationFormStatus");
  const button=document.getElementById("saveAppRegistration");
  if(button){button.disabled=true;button.textContent="SAVING…";}
  if(status){status.textContent="Saving your app registration…";status.className="registration-form-status";}
  try{
    const profile=normalizedRegistrationProfileFromForm();
    const result=await sendAppRegistrationToServer(profile);
    saveAppRegistrationLocal({
      ...profile,
      registeredAt:String(result.createdAt||new Date().toISOString()),
      updatedAt:String(result.updatedAt||new Date().toISOString())
    });
    markAppRegistrationSynced();
    renderAppRegistration();
    scheduleAnonymousDeviceSync(40);
    if(status){status.textContent="✓ This app is registered.";status.className="registration-form-status success";}
  }catch(err){
    if(status){status.textContent=err.message;status.className="registration-form-status error";}
  }finally{
    if(button){button.disabled=false;button.textContent=loadAppRegistration()?"UPDATE REGISTRATION":"REGISTER THIS APP";}
  }
}

async function removeAppRegistration(){
  if(!confirm("Remove your registration from this app installation? Your admission ticket and saved My Schedule items are not affected."))return;
  const status=document.getElementById("registrationFormStatus");
  const button=document.getElementById("removeAppRegistration");
  if(button)button.disabled=true;
  try{
    const base=pushApiBase();
    if(base){
      const response=await fetch(`${base}/v1/profile/remove`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({deviceId:getAnonymousDeviceId()})
      });
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.error||`Registration service returned ${response.status}.`);
    }
    saveAppRegistrationLocal(null);
    renderAppRegistration();
    if(status){status.textContent="Your app registration was removed.";status.className="registration-form-status success";}
  }catch(err){
    if(status){status.textContent=`Could not remove registration: ${err.message}`;status.className="registration-form-status error";}
  }finally{
    if(button)button.disabled=false;
  }
}

function pushApiBase(){
  return String(state.settings.pushApiUrl||DEFAULT_SETTINGS.pushApiUrl||"").replace(/\/+$/,"");
}
function urlBase64ToUint8Array(base64String){
  const padding="=".repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64);
  return Uint8Array.from([...raw].map(ch=>ch.charCodeAt(0)));
}
async function getPushSubscription(){
  if(!("serviceWorker" in navigator)||!("PushManager" in window))return null;
  const reg=await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}
async function registerPushSubscription(){
  const base=pushApiBase();
  if(!base)throw new Error("Push service is not configured.");
  const reg=await navigator.serviceWorker.ready;
  let subscription=await reg.pushManager.getSubscription();

  if(!subscription){
    const keyResponse=await fetch(`${base}/v1/public-key`,{cache:"no-store"});
    if(!keyResponse.ok)throw new Error("Push service is not ready yet.");
    const {publicKey}=await keyResponse.json();
    if(!publicKey)throw new Error("Push public key is missing.");
    subscription=await reg.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:urlBase64ToUint8Array(publicKey)
    });
  }

  const response=await fetch(`${base}/v1/subscribe`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({deviceId:getAnonymousDeviceId(),subscription:subscription.toJSON()})
  });
  if(!response.ok)throw new Error("Could not register this device for event alerts.");
  rememberPushEnabled();
  return subscription;
}
async function unregisterPushSubscription(){
  const subscription=await getPushSubscription();
  const base=pushApiBase();
  if(subscription&&base){
    fetch(`${base}/v1/unsubscribe`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({endpoint:subscription.endpoint,deviceId:getAnonymousDeviceId()})
    }).catch(()=>{});
    await subscription.unsubscribe().catch(()=>false);
  }
  rememberPushDisabled();
}
async function enablePushNotifications(){
  if(!("Notification" in window)||!("serviceWorker" in navigator)||!("PushManager" in window))return;
  localStorage.removeItem(PUSH_DISABLED_KEY);
  const permission=Notification.permission==="granted"?"granted":await Notification.requestPermission();
  if(permission!=="granted"){
    await updateNotificationStatus();
    return;
  }
  const button=document.getElementById("enableNotificationsButton");
  if(button){button.disabled=true;button.textContent="CONNECTING…";}
  try{
    await registerPushSubscription();
  }catch(err){
    console.warn("Push registration failed",err);
    const copy=document.getElementById("notificationStatusCopy");
    if(copy)copy.textContent=err.message||"Push registration could not be completed.";
  }
  await updateNotificationStatus();
  if(await hasActivePushSubscription()){
    closePushPrompt();
    pushBannerEligible=false;
    clearTimeout(pushBannerTimer);
  }
  await updatePushOptInBanner();
}


async function ensurePushSubscriptionHealthy({force=false}={}){
  if(!notificationsSupported())return false;
  if(Notification.permission!=="granted")return false;
  if(pushWasExplicitlyDisabled())return false;

  const now=Date.now();
  if(!force && pushHealthLastCheckedAt && now-pushHealthLastCheckedAt<PUSH_HEALTH_RECHECK_MS){
    return true;
  }
  if(pushHealthRepairPromise)return pushHealthRepairPromise;

  pushHealthRepairPromise=(async()=>{
    try{
      const base=pushApiBase();
      if(!base)return false;

      const reg=await navigator.serviceWorker.ready;
      let subscription=await reg.pushManager.getSubscription();

      if(!subscription){
        const keyResponse=await fetch(`${base}/v1/public-key`,{cache:"no-store"});
        if(!keyResponse.ok)throw new Error("Push public key could not be refreshed.");
        const {publicKey}=await keyResponse.json();
        if(!publicKey)throw new Error("Push public key is missing.");

        subscription=await reg.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:urlBase64ToUint8Array(publicKey)
        });
      }

      // Re-register even an existing browser subscription. This makes the repair
      // idempotent and restores the backend record if it was ever pruned.
      const response=await fetch(`${base}/v1/subscribe`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({deviceId:getAnonymousDeviceId(),subscription:subscription.toJSON()})
      });
      if(!response.ok)throw new Error("Event-alert subscription could not be refreshed.");

      rememberPushEnabled();
      pushHealthLastCheckedAt=Date.now();
      scheduleServerReminderSync(100);
      scheduleAnonymousDeviceSync(120);
      return true;
    }catch(err){
      console.warn("Push subscription health check failed",err);
      // Do not flip the UI back to disabled just because a background repair
      // failed while offline or during an iOS/service-worker lifecycle transition.
      return false;
    }finally{
      pushHealthRepairPromise=null;
    }
  })();

  return pushHealthRepairPromise;
}

async function updateNotificationStatus(){
  const t=document.getElementById("notificationStatusTitle"),
        c=document.getElementById("notificationStatusCopy"),
        b=document.getElementById("enableNotificationsButton"),
        disable=document.getElementById("disablePushNotificationsButton");
  if(!t)return;

  const supported=("Notification" in window)&&("serviceWorker" in navigator)&&("PushManager" in window);
  if(!supported){
    t.textContent="PUSH ALERTS NOT SUPPORTED";
    c.textContent="This browser or device does not currently support Web Push for this app.";
    if(b){b.disabled=true;b.textContent="NOT SUPPORTED";}
    disable?.classList.add("hidden");
    return;
  }

  if(Notification.permission==="denied"){
    t.textContent="NOTIFICATIONS BLOCKED";
    c.textContent="Notifications are blocked in your browser or device settings.";
    if(b){b.disabled=true;b.textContent="BLOCKED";}
    disable?.classList.add("hidden");
    return;
  }

  if(Notification.permission==="granted"){
    if(pushWasExplicitlyDisabled()){
      t.textContent="EVENT ALERTS OFF IN APP";
      c.textContent="Notifications are allowed on this device, but event alerts were turned off inside the Sci-Fi Valley Con app.";
      if(b){b.disabled=false;b.textContent="ENABLE EVENT ALERTS";}
      disable?.classList.add("hidden");
      return;
    }

    const subscription=await getPushSubscription().catch(()=>null);

    if(subscription){
      rememberPushEnabled();
      t.textContent="EVENT ALERTS ENABLED";
      c.textContent="This device is subscribed to convention-wide updates, room changes, delays and other important announcements.";
      if(b){b.disabled=true;b.textContent="EVENT ALERTS ENABLED";}
      disable?.classList.remove("hidden");

      // Refresh the backend registration periodically without changing the UI.
      ensurePushSubscriptionHealthy().catch(()=>{});
      return;
    }

    // iOS permission is still ON. Do not tell the attendee to enable it again.
    // Keep the persistent enabled state and silently recreate the Push subscription.
    t.textContent="EVENT ALERTS ENABLED";
    c.textContent="Notifications are enabled on this device. The app is automatically verifying the event-alert connection in the background.";
    if(b){b.disabled=true;b.textContent="EVENT ALERTS ENABLED";}
    disable?.classList.remove("hidden");
    ensurePushSubscriptionHealthy({force:true}).then(ok=>{
      if(ok){
        c.textContent="This device is subscribed to convention-wide updates, room changes, delays and other important announcements.";
      }
    }).catch(()=>{});
    return;
  }

  t.textContent="EVENT ALERTS NOT ENABLED";
  c.textContent="Enable alerts for important convention-wide updates such as room changes, delays, cancellations, or emergency schedule updates.";
  if(b){b.disabled=false;b.textContent="ENABLE EVENT ALERTS";}
  disable?.classList.add("hidden");
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

const FEATURED_EVENT_IDS=[
  "con-quest",
  "costume-contest",
  "quick-sketches",
  "charity-auction",
  "shuttle",
  "after-party",
  "medieval-combat",
  "retro-gaming",
  "tabletop-gaming",
  "trivia",
  "workshops"
];

const FEATURED_EVENT_META={
  "con-quest":{icon:"★",short:"CHARITY QUEST",tone:"aqua"},
  "costume-contest":{icon:"♛",short:"COSPLAY",tone:"coral"},
  "quick-sketches":{icon:"✎",short:"LIVE ART",tone:"mustard"},
  "charity-auction":{icon:"◆",short:"CHARITY",tone:"pink"},
  "shuttle":{icon:"▰",short:"TRANSPORTATION",tone:"aqua"},
  "after-party":{icon:"●",short:"BOWLING & KARAOKE",tone:"coral"},
  "medieval-combat":{icon:"⚔",short:"LIVE DEMOS",tone:"mustard"},
  "retro-gaming":{icon:"✚",short:"75+ SYSTEMS",tone:"pink"},
  "tabletop-gaming":{icon:"⚄",short:"GAME ROOM",tone:"aqua"},
  "trivia":{icon:"?",short:"TOURNAMENT",tone:"coral"},
  "workshops":{icon:"✦",short:"HANDS-ON",tone:"mustard"}
};

function eventById(id){
  return (state.events||[]).find(event=>String(event.id)===String(id))||null;
}

function renderEventQuickLinks(){
  const host=document.getElementById("eventQuickGrid");
  if(!host)return;

  const items=FEATURED_EVENT_IDS
    .map(id=>eventById(id))
    .filter(Boolean);

  if(!items.length){
    host.innerHTML='<div class="muted-empty">Event details are being updated.</div>';
    return;
  }

  host.innerHTML=items.map(event=>{
    const meta=FEATURED_EVENT_META[event.id]||{icon:"★",short:event.category||"EVENT",tone:"aqua"};
    return `<button class="event-quick-button tone-${escapeAppHtml(meta.tone)}"
      type="button" data-event-open="${escapeAppHtml(event.id)}">
      <span class="event-quick-icon" aria-hidden="true">${escapeAppHtml(meta.icon)}</span>
      <span class="event-quick-copy">
        <small>${escapeAppHtml(meta.short)}</small>
        <strong>${escapeAppHtml(event.title)}</strong>
      </span>
      <span class="event-quick-arrow" aria-hidden="true">›</span>
    </button>`;
  }).join("");

  host.querySelectorAll("[data-event-open]").forEach(button=>{
    button.addEventListener("click",()=>openEventDetails(button.dataset.eventOpen));
  });
}

function openEventDetails(eventId){
  const event=eventById(eventId);
  const modal=document.getElementById("eventModal");
  const content=document.getElementById("eventModalContent");
  if(!event||!modal||!content)return;

  const meta=FEATURED_EVENT_META[event.id]||{icon:"★",short:event.category||"EVENT",tone:"aqua"};

  content.innerHTML=`
    <div class="event-modal-inner">
      <div class="event-modal-hero tone-${escapeAppHtml(meta.tone)}">
        <span class="event-modal-icon">${escapeAppHtml(meta.icon)}</span>
        <div>
          <span class="event-modal-category">${escapeAppHtml(event.category||"Event")}</span>
          <h2>${escapeAppHtml(event.title)}</h2>
          <p>${escapeAppHtml(event.summary||"")}</p>
        </div>
      </div>
      <div class="event-modal-body event-content">
        ${(event.content||[]).map(renderBlock).join("")}
      </div>
    </div>`;

  modal.showModal();
}

function closeEventDetails(){
  const modal=document.getElementById("eventModal");
  if(modal?.open)modal.close();
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


/* Recent Event Alerts — V3.9
   Broadcasts sent by staff remain visible on the home screen for 72 hours. */
const RECENT_ALERT_RETENTION_MS=72*60*60*1000;
const RECENT_ALERT_REFRESH_MS=5*60*1000;
const RECENT_ALERT_DISMISSED_KEY="sfvc-recent-alerts-dismissed-v1";
let recentAlertRefreshTimer=null;
let recentAlertsInitialized=false;

function loadDismissedRecentAlerts(){
  try{
    const raw=JSON.parse(localStorage.getItem(RECENT_ALERT_DISMISSED_KEY)||"{}");
    const now=Date.now();
    const cleaned={};
    for(const [id,ts] of Object.entries(raw||{})){
      const age=now-Number(ts||0);
      if(Number.isFinite(age)&&age>=0&&age<RECENT_ALERT_RETENTION_MS)cleaned[String(id)]=Number(ts);
    }
    localStorage.setItem(RECENT_ALERT_DISMISSED_KEY,JSON.stringify(cleaned));
    return cleaned;
  }catch{
    return {};
  }
}

function dismissRecentAlertLocally(id){
  const key=String(id||"").trim();
  if(!key)return;
  const dismissed=loadDismissedRecentAlerts();
  dismissed[key]=Date.now();
  localStorage.setItem(RECENT_ALERT_DISMISSED_KEY,JSON.stringify(dismissed));
  renderRecentAlerts();
}

function escapeAppHtml(value=""){
  return String(value).replace(/[&<>"']/g,char=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[char]));
}

function parseBroadcastTimestamp(value){
  const date=new Date(String(value||""));
  return Number.isNaN(date.getTime())?null:date;
}

function formatAlertAge(date){
  if(!date)return "RECENT UPDATE";
  const seconds=Math.max(0,Math.floor((Date.now()-date.getTime())/1000));
  if(seconds<60)return "JUST NOW";
  const minutes=Math.floor(seconds/60);
  if(minutes<60)return `${minutes} MIN${minutes===1?"":"S"} AGO`;
  const hours=Math.floor(minutes/60);
  if(hours<24)return `${hours} HOUR${hours===1?"":"S"} AGO`;
  const days=Math.floor(hours/24);
  return `${days} DAY${days===1?"":"S"} AGO`;
}

function safeAlertUrl(value){
  const raw=String(value||"/").trim();
  if(!raw||raw==="/"||raw==="./")return "";

  try{
    const url=new URL(raw,location.origin);
    if(url.origin!==location.origin)return "";
    return url.href;
  }catch{
    return "";
  }
}

function renderRecentAlerts(){
  const panel=document.getElementById("recentAlertsPanel");
  const list=document.getElementById("recentAlertsList");
  const count=document.getElementById("recentAlertsCount");
  if(!panel||!list||!count)return;

  const cutoff=Date.now()-RECENT_ALERT_RETENTION_MS;
  const dismissed=loadDismissedRecentAlerts();
  const alerts=(state.recentAlerts||[])
    .map(item=>({...item,_date:parseBroadcastTimestamp(item.createdAt)}))
    .filter(item=>item._date&&item._date.getTime()>=cutoff)
    .filter(item=>!dismissed[String(item.id||"")])
    .sort((a,b)=>b._date-a._date);

  state.recentAlerts=alerts.map(({_date,...item})=>item);

  if(!alerts.length){
    panel.classList.add("hidden");
    list.innerHTML="";
    count.textContent="0";
    return;
  }

  panel.classList.remove("hidden");
  count.textContent=`${alerts.length} ${alerts.length===1?"UPDATE":"UPDATES"}`;

  list.innerHTML=alerts.map(item=>{
    const url=safeAlertUrl(item.url);
    const urgency=String(item.urgency||"normal").toLowerCase();
    const urgencyClass=urgency==="high"?" high-priority":"";
    return `<article class="recent-alert-card${urgencyClass}">
      <button class="recent-alert-dismiss" type="button"
        data-dismiss-recent-alert="${escapeAppHtml(item.id)}"
        aria-label="Dismiss this update on this device"
        title="Dismiss this update">×</button>
      <div class="recent-alert-meta">
        <span>${urgency==="high"?"⚠ IMPORTANT UPDATE":"🔔 EVENT UPDATE"}</span>
        <time datetime="${escapeAppHtml(item.createdAt)}">${formatAlertAge(item._date)}</time>
      </div>
      <h3>${escapeAppHtml(item.title)}</h3>
      <p>${escapeAppHtml(item.body)}</p>
      ${url?`<a class="recent-alert-link" href="${escapeAppHtml(url)}">VIEW UPDATE ›</a>`:""}
    </article>`;
  }).join("");
}

async function loadRecentAlerts(){
  const base=pushApiBase();
  if(!base)return;

  try{
    const response=await fetch(`${base}/v1/updates`,{
      method:"GET",
      mode:"cors",
      credentials:"omit",
      cache:"no-store"
    });
    if(!response.ok)throw new Error(`Event alerts returned ${response.status}.`);

    const result=await response.json();
    state.recentAlerts=Array.isArray(result.broadcasts)?result.broadcasts:[];
    renderRecentAlerts();
  }catch(err){
    console.warn("Recent event alerts unavailable",err);
    // Do not remove alerts already loaded during this session if a refresh fails.
    renderRecentAlerts();
  }
}

function initializeRecentAlerts(){
  if(recentAlertsInitialized)return;
  recentAlertsInitialized=true;

  document.getElementById("recentAlertsList")?.addEventListener("click",event=>{
    const button=event.target.closest?.("[data-dismiss-recent-alert]");
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    dismissRecentAlertLocally(button.dataset.dismissRecentAlert);
  });

  loadRecentAlerts();
  clearInterval(recentAlertRefreshTimer);
  recentAlertRefreshTimer=setInterval(()=>{
    if(document.visibilityState==="visible")loadRecentAlerts();
  },RECENT_ALERT_REFRESH_MS);

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible")loadRecentAlerts();
  });
  window.addEventListener("online",loadRecentAlerts);
}




/* Venue and shuttle driving directions — V4.49 */
const DEFAULT_DIRECTIONS={
  venueName:"Blair County Convention Center",
  venueAddress:"1 Convention Center Dr, Altoona, PA 16602",
  venueNotes:"Parking and convention entrance destination",
  shuttleEnabled:false,
  shuttleName:"Shuttle Pickup",
  shuttleAddress:"",
  shuttleNotes:"",
  shuttleHours:""
};
let selectedDirectionsDestination="venue";
let currentDirectionsCoordinates="";

function directionsConfig(){
  return {...DEFAULT_DIRECTIONS,...(state.directions||{})};
}

function directionsDestination(type=selectedDirectionsDestination){
  const cfg=directionsConfig();
  if(type==="shuttle"&&cfg.shuttleEnabled&&String(cfg.shuttleAddress||"").trim()){
    return {type:"shuttle",name:cfg.shuttleName||"Shuttle Pickup",address:cfg.shuttleAddress};
  }
  return {type:"venue",name:cfg.venueName||DEFAULT_DIRECTIONS.venueName,address:cfg.venueAddress||DEFAULT_DIRECTIONS.venueAddress};
}

function renderDirections(){
  const cfg=directionsConfig();
  const venueName=document.getElementById("directionsVenueName");
  const venueAddress=document.getElementById("directionsVenueAddress");
  const shuttleCard=document.getElementById("shuttleDirectionsCard");
  const unavailable=document.getElementById("shuttleDirectionsUnavailable");
  const shuttleName=document.getElementById("directionsShuttleName");
  const shuttleAddress=document.getElementById("directionsShuttleAddress");
  const shuttleNotes=document.getElementById("directionsShuttleNotes");

  if(venueName)venueName.textContent=cfg.venueName||DEFAULT_DIRECTIONS.venueName;
  if(venueAddress)venueAddress.textContent=cfg.venueAddress||DEFAULT_DIRECTIONS.venueAddress;

  const shuttleAvailable=Boolean(cfg.shuttleEnabled&&String(cfg.shuttleAddress||"").trim());
  shuttleCard?.classList.toggle("hidden",!shuttleAvailable);
  unavailable?.classList.toggle("hidden",shuttleAvailable);
  if(shuttleName)shuttleName.textContent=cfg.shuttleName||"Shuttle Pickup";
  if(shuttleAddress)shuttleAddress.textContent=cfg.shuttleAddress||"";
  if(shuttleNotes){
    const details=[cfg.shuttleNotes,cfg.shuttleHours].filter(Boolean).join(" • ");
    shuttleNotes.textContent=details||"Park here and board the event shuttle.";
  }

  if(!shuttleAvailable&&selectedDirectionsDestination==="shuttle")selectedDirectionsDestination="venue";
  updateDirectionsSelection();
}

function updateDirectionsSelection(){
  document.querySelectorAll("[data-directions-destination]").forEach(card=>{
    card.classList.toggle("selected",card.dataset.directionsDestination===selectedDirectionsDestination);
  });
  document.querySelectorAll("[data-directions-destination-button]").forEach(button=>{
    const selected=button.dataset.directionsDestinationButton===selectedDirectionsDestination;
    button.textContent=selected?"✓ SELECTED":"SELECT";
  });
  const dest=directionsDestination();
  const summary=document.getElementById("directionsSelectedSummary");
  if(summary)summary.textContent=`TO ${String(dest.name||"DESTINATION").toUpperCase()}`;
}

function selectDirectionsDestination(type){
  const cfg=directionsConfig();
  if(type==="shuttle"&&!(cfg.shuttleEnabled&&String(cfg.shuttleAddress||"").trim()))return;
  selectedDirectionsDestination=type==="shuttle"?"shuttle":"venue";
  updateDirectionsSelection();
}

function googleMapsDirectionsUrl(destination,origin=""){
  const params=new URLSearchParams({api:"1",destination:String(destination||""),travelmode:"driving",dir_action:"navigate"});
  if(String(origin||"").trim())params.set("origin",String(origin).trim());
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function enteredDirectionsOrigin(){
  const typed=String(document.getElementById("directionsOrigin")?.value||"").trim();
  return currentDirectionsCoordinates||typed;
}

function openSelectedDrivingDirections(){
  const destination=directionsDestination();
  if(!destination.address)return;
  const url=googleMapsDirectionsUrl(destination.address,enteredDirectionsOrigin());
  window.open(url,"_blank","noopener,noreferrer");
}

function setDirectionsLocationStatus(message="",kind=""){
  const status=document.getElementById("directionsLocationStatus");
  if(!status)return;
  status.textContent=message;
  status.dataset.kind=kind;
}

function useCurrentLocationForDirections(){
  if(!navigator.geolocation){
    setDirectionsLocationStatus("Current location is not supported on this device. Enter your starting address instead.","error");
    return;
  }
  const button=document.getElementById("directionsUseLocation");
  if(button){button.disabled=true;button.textContent="⌖ FINDING YOUR LOCATION…";}
  setDirectionsLocationStatus("Requesting your current location…","");
  navigator.geolocation.getCurrentPosition(position=>{
    currentDirectionsCoordinates=`${position.coords.latitude},${position.coords.longitude}`;
    const input=document.getElementById("directionsOrigin");
    if(input)input.value="Current device location";
    setDirectionsLocationStatus("✓ Current location ready for driving directions.","success");
    if(button){button.disabled=false;button.textContent="⌖ USE MY CURRENT LOCATION";}
  },error=>{
    currentDirectionsCoordinates="";
    const message=error?.code===1
      ? "Location permission was not granted. Enter your starting address, or leave it blank and Google Maps can ask for your location."
      : "Your current location could not be determined. Enter your starting address instead.";
    setDirectionsLocationStatus(message,"error");
    if(button){button.disabled=false;button.textContent="⌖ USE MY CURRENT LOCATION";}
  },{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}

function clearDirectionsOrigin(){
  currentDirectionsCoordinates="";
  const input=document.getElementById("directionsOrigin");
  if(input)input.value="";
  setDirectionsLocationStatus("","");
}

function initializeDirections(){
  document.querySelectorAll("[data-directions-destination-button]").forEach(button=>{
    button.addEventListener("click",()=>selectDirectionsDestination(button.dataset.directionsDestinationButton));
  });
  document.querySelectorAll("[data-directions-destination]").forEach(card=>{
    card.addEventListener("click",event=>{
      if(event.target.closest("button"))return;
      selectDirectionsDestination(card.dataset.directionsDestination);
    });
  });
  document.getElementById("directionsUseLocation")?.addEventListener("click",useCurrentLocationForDirections);
  document.getElementById("directionsClearOrigin")?.addEventListener("click",clearDirectionsOrigin);
  document.getElementById("directionsOrigin")?.addEventListener("input",()=>{currentDirectionsCoordinates="";setDirectionsLocationStatus("","");});
  document.getElementById("openDrivingDirections")?.addEventListener("click",openSelectedDrivingDirections);
}

/* Interactive vector floor plan — V4.2 */
let mapZoom=1;
let mapPreviewMode=new URLSearchParams(location.search).get("mapPreview")==="1";

function expandLocationCodes(value){
  const result=[];
  String(value||"").split(",").map(x=>x.trim()).filter(Boolean).forEach(part=>{
    const m=part.match(/^([A-Z]+)(\d+)\s*-\s*([A-Z]+)?(\d+)$/i);
    if(m){
      const p1=m[1].toUpperCase(),start=Number(m[2]),p2=(m[3]||m[1]).toUpperCase(),end=Number(m[4]);
      if(p1===p2){const step=start<=end?1:-1;for(let n=start;step>0?n<=end:n>=end;n+=step)result.push(`${p1}${n}`);return;}
    }
    result.push(part.toUpperCase().replace(/\s+/g,""));
  });
  return [...new Set(result)];
}
function vendorForLocation(code){
  const target=String(code||"").toUpperCase();
  return state.vendors.find(v=>expandLocationCodes(v.location).includes(target))||null;
}
function mapDirectoryVisible(){return state.mapSettings.directoryPublished===true||mapPreviewMode}
function mapVisible(){return state.mapSettings.published===true||mapPreviewMode}
function mapLayout(){return state.mapLayout&&typeof state.mapLayout==="object"?state.mapLayout:{canvas:{width:1200,height:1780,defaultWidth:820},elements:[],locations:[]}}
function svgTextLines(text){return String(text||"").split(/\n/)}
function svgEscape(value=""){return escapeAppHtml(value)}
function mapCodeFontSize(code,w,h){
  const shortest=Math.max(8,Math.min(Number(w||20),Number(h||12)));
  const byShape=Math.max(6,Math.min(10,shortest*.70));
  return Math.max(5.5,byShape-(String(code).length>2?.8:0));
}
function renderMapLegend(){
  const c=document.getElementById("mapLegend");if(!c)return;
  const items=Array.isArray(state.mapSettings.legend)?state.mapSettings.legend:[];
  c.innerHTML=items.map(item=>`<div class="map-legend-item"><span style="background:${svgEscape(item.color)}"></span><b>${svgEscape(item.label)}</b></div>`).join("");
  const note=document.getElementById("mapConQuestNote");if(note)note.textContent=state.mapSettings.conQuestNote||"Red table markers indicate Con-Quest participation.";
}
function mapElementTransform(item){
  const tx=Number(item.translateX||0),ty=Number(item.translateY||0),sx=Number(item.scaleX??1),sy=Number(item.scaleY??1),ox=Number(item.originX||0),oy=Number(item.originY||0),rot=Number(item.rotation||0);
  const parts=[];
  if(tx||ty)parts.push(`translate(${tx} ${ty})`);
  if(rot)parts.push(`rotate(${rot} ${ox} ${oy})`);
  if(sx!==1||sy!==1)parts.push(`translate(${ox} ${oy}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`);
  return parts.length?` transform="${parts.join(' ')}"`:'';
}
function buildMapSvg(){
  const layout=mapLayout(),canvas=layout.canvas||{},w=Number(canvas.width||1200),h=Number(canvas.height||1780),out=[];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="floorPlanTitle floorPlanDesc">`);
  out.push(`<title id="floorPlanTitle">Sci-Fi Valley Con interactive convention center floor plan</title><desc id="floorPlanDesc">Interactive venue map with rooms, exhibit halls, celebrity areas, patio vendors and table locations.</desc>`);
  out.push(`<style>
    .outline{fill:#fffdf4;stroke:#352720;stroke-width:5;stroke-linejoin:round}.zone{stroke:#352720;stroke-width:4}
    .zone-label,.level-label,.tiny{fill:#291f1a;text-anchor:middle}.zone-label{font-family:Georgia,serif;font-weight:800}.level-label{font-family:Arial,sans-serif;font-weight:900;letter-spacing:2px}
    .hall-floor{fill:#ebe8dd;stroke:#352720;stroke-width:4}.stairs{fill:#fffdf4;stroke:#352720;stroke-width:3}.tiny{font-family:Arial,sans-serif;font-size:12px;font-weight:800}
    .map-location-group{cursor:pointer}.map-table{fill:#fffdf6;stroke:#40322b;stroke-width:2}.map-table.conquest{fill:#e65338}.map-table.selected,.service.selected{stroke:#167985;stroke-width:7;filter:drop-shadow(0 0 5px rgba(22,121,133,.7))}
    .service{fill:#f2bd3f;stroke:#352720;stroke-width:3}.map-table-label{font-family:Arial,sans-serif;font-weight:900;fill:#201916;text-anchor:middle;dominant-baseline:middle;pointer-events:none;paint-order:stroke;stroke:#fffdf4;stroke-width:1.8px;stroke-linejoin:round}
  </style>`);
  (layout.elements||[]).forEach(item=>{
    if(item.hidden)return;
    const cls=item.className?` class="${svgEscape(item.className)}"`:'';const fill=item.fill?` fill="${svgEscape(item.fill)}"`:'';const transform=mapElementTransform(item);
    if(item.type==="rect")out.push(`<rect id="${svgEscape(item.id)}"${cls} x="${Number(item.x)||0}" y="${Number(item.y)||0}" width="${Number(item.width)||0}" height="${Number(item.height)||0}" rx="${Number(item.rx||0)}"${fill}${transform}/>`);
    else if(item.type==="path")out.push(`<path id="${svgEscape(item.id)}"${cls} d="${svgEscape(item.d||'')}"${fill}${transform}/>`);
    else if(item.type==="text"){
      const lines=svgTextLines(item.text),x=Number(item.x)||0,y=Number(item.y)||0,anchor=item.anchor||'middle',fontSize=Number(item.fontSize||22),lineHeight=Number(item.lineHeight||1.15),fillText=item.fill||'#291f1a',weight=item.fontWeight||'800',style=item.fontStyle||'normal',family=item.fontFamily||'Georgia, serif';
      out.push(`<text id="${svgEscape(item.id)}"${cls} x="${x}" y="${y}" text-anchor="${svgEscape(anchor)}" font-size="${fontSize}" font-weight="${svgEscape(weight)}" font-style="${svgEscape(style)}" font-family="${svgEscape(family)}" fill="${svgEscape(fillText)}">`);
      lines.forEach((line,index)=>out.push(`<tspan x="${x}" dy="${index===0?0:fontSize*lineHeight}">${svgEscape(line)}</tspan>`));out.push(`</text>`);
    }
  });
  (layout.locations||[]).forEach(loc=>{
    if(loc.hidden)return;
    const code=String(loc.id||'').toUpperCase(),shape=(loc.shape||'rect').toLowerCase(),rot=Number(loc.rotation||0),x=Number(loc.x||0),y=Number(loc.y||0),ww=Number(loc.w||28),hh=Number(loc.h||12),cx=x+ww/2,cy=y+hh/2;
    const rotate=rot?`rotate(${rot} ${cx} ${cy})`:'';
    const counterRotate=rot?` transform="rotate(${-rot} ${cx} ${cy})"`:'';
    const fs=mapCodeFontSize(code,ww,hh);
    out.push(`<g class="map-location-group" data-location="${svgEscape(code)}" transform="${rotate}">`);
    if(shape==='booth'){
      out.push(`<rect id="table-${svgEscape(code)}" class="map-table" data-location="${svgEscape(code)}" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="2"/>`);
      out.push(`<path d="M${x},${y} L${cx},${cy} L${x+ww},${y} Z" fill="#f4f4f4" stroke="#d8d8d8" stroke-width="1" pointer-events="none"/><path d="M${x},${y+hh} L${cx},${cy} L${x+ww},${y+hh} Z" fill="#eeeeee" stroke="#d8d8d8" stroke-width="1" pointer-events="none"/>`);
    }else{
      const tableClass=shape==='service'?'service':'map-table';out.push(`<rect id="table-${svgEscape(code)}" class="${tableClass}" data-location="${svgEscape(code)}" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="1"/>`);
    }
    out.push(`<text class="map-table-label" x="${cx+(Number(loc.labelDx)||0)}" y="${cy+(Number(loc.labelDy)||0)}" font-size="${fs}"${counterRotate}>${svgEscape(code)}</text></g>`);
  });
  out.push(`<text class="tiny" x="600" y="1756">VECTOR FLOOR PLAN • TAP A TABLE OR BOOTH FOR DETAILS</text></svg>`);return out.join('');
}
function applyMapVendorData(){
  const svg=document.querySelector('#mapSvgHost svg');if(!svg)return;
  svg.querySelectorAll('.map-location-group').forEach(group=>{
    const code=group.dataset.location,vendor=vendorForLocation(code),table=group.querySelector('.map-table,.service'),cq=Boolean(vendor?.conQuest);
    if(table?.classList.contains('map-table'))table.classList.toggle('conquest',cq);
    group.setAttribute('aria-label',mapDirectoryVisible()&&vendor?`${code}: ${vendor.name}`:code);
  });
  applyMapSelection();
}
function bindMapLocations(){
  document.querySelectorAll('#mapSvgHost .map-location-group').forEach(group=>{
    group.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();selectMapLocation(group.dataset.location);openMapLocation(group.dataset.location)});
  });
}
function renderFloorPlanSvg(){
  const host=document.getElementById('mapSvgHost');
  if(!host)return;
  host.innerHTML=buildMapSvg();
  applyMapVendorData();
  bindMapLocations();
  const svg=host.querySelector('svg');
  svg?.addEventListener('click',event=>{
    if(!event.target.closest('.map-location-group'))clearMapSelection();
  });
  applyMapZoom();
}
function openMapLocation(code,{nonModal=false}={}){
  const vendor=vendorForLocation(code),content=document.getElementById('mapLocationModalContent'),modal=document.getElementById('mapLocationModal');if(!content||!modal)return;
  if(vendor&&mapDirectoryVisible())content.innerHTML=`<span class="tag">${escapeAppHtml(code)}</span><h2>${escapeAppHtml(vendor.name)}</h2><div class="map-modal-meta">${escapeAppHtml(vendor.area||"")} • ${escapeAppHtml(vendor.type||"")}</div>${vendor.description?`<div class="map-vendor-description"><strong>WHAT THEY SELL</strong><p>${escapeAppHtml(vendor.description)}</p></div>`:""}${vendor.categories?`<p><strong>Products / Categories:</strong> ${escapeAppHtml(vendor.categories)}</p>`:""}<div class="map-modal-location"><strong>LOCATION:</strong> ${escapeAppHtml(vendor.location)}</div>${vendor.conQuest?`<button class="map-conquest-badge conquest-info-trigger" type="button" data-open-conquest-info aria-label="Tap to learn what Con-Quest is" title="Tap to learn what Con-Quest is">★ CON-QUEST PARTICIPANT</button>`:""}${vendor.notes?`<p>${escapeAppHtml(vendor.notes)}</p>`:""}`;
  else content.innerHTML=`<span class="tag">${escapeAppHtml(code)}</span><h2>LOCATION ${escapeAppHtml(code)}</h2><p>Vendor or guest assignment has not been published for this location yet.</p>`;

  if(modal.open)modal.close();
  modal.classList.toggle('map-directory-popover',Boolean(nonModal));
  if(nonModal&&typeof modal.show==='function')modal.show();
  else if(typeof modal.showModal==='function')modal.showModal();
  else modal.setAttribute('open','');
}
function mapVendorMatches(v){
  const q=state.mapQuery.trim().toLowerCase();
  if(!q)return true;
  return `${v.name} ${v.description||''} ${v.categories||''} ${v.location||''} ${v.area||''}`.toLowerCase().includes(q);
}
function renderMapDirectory(){
  const list=document.getElementById('mapDirectoryList'),count=document.getElementById('mapDirectoryCount'),notice=document.getElementById('mapDirectoryNotice');if(!list||!count)return;
  if(!mapDirectoryVisible()){list.innerHTML='';count.textContent='DRAFT';notice?.classList.remove('hidden');if(notice)notice.textContent='Vendor and table assignments are still being finalized. The vector floor plan can be published separately from the vendor directory.';return;}
  notice?.classList.add('hidden');const rows=state.vendors.filter(mapVendorMatches).sort((a,b)=>String(a.location).localeCompare(String(b.location),undefined,{numeric:true}));count.textContent=String(rows.length);
  list.innerHTML=rows.map(v=>`<button class="map-directory-card ${state.mapSelectedVendorId===v.id?'selected-vendor':''}" data-map-vendor="${escapeAppHtml(v.id)}"><span class="map-directory-location">${escapeAppHtml(v.location)}</span><span class="map-directory-copy"><strong>${escapeAppHtml(v.name)}</strong><small>${escapeAppHtml(v.area||"")}${v.description?` • ${escapeAppHtml(v.description)}`:v.categories?` • ${escapeAppHtml(v.categories)}`:""}</small></span>${v.conQuest?'<span class="map-directory-cq">CQ</span>':''}<b>DETAILS + LOCATE ›</b></button>`).join('')||`<div class="paper-panel muted-empty">No vendors match this search.</div>`;
  list.querySelectorAll('[data-map-vendor]').forEach(btn=>btn.addEventListener('click',()=>{const v=state.vendors.find(x=>x.id===btn.dataset.mapVendor);if(v)selectVendorOnMap(v,{openInfo:true})}));
}
function hideVendorMapPointer(){
  document.getElementById('mapVendorPointer')?.classList.add('hidden');
}
function selectedVendorMapGroups(v){
  if(!v)return [];
  return expandLocationCodes(v.location)
    .map(code=>document.querySelector(`#mapSvgHost .map-location-group[data-location="${CSS.escape(code)}"]`))
    .filter(Boolean);
}
function positionVendorMapPointer(v){
  const pointer=document.getElementById('mapVendorPointer');
  const label=document.getElementById('mapVendorPointerLabel');
  const viewport=document.getElementById('mapViewport');
  const groups=selectedVendorMapGroups(v);
  if(!pointer||!viewport||!groups.length){hideVendorMapPointer();return;}

  const viewportRect=viewport.getBoundingClientRect();
  const rects=groups.map(group=>group.getBoundingClientRect());
  const left=Math.min(...rects.map(r=>r.left));
  const right=Math.max(...rects.map(r=>r.right));
  const top=Math.min(...rects.map(r=>r.top));

  pointer.style.left=`${((left+right)/2)-viewportRect.left+viewport.scrollLeft}px`;
  pointer.style.top=`${top-viewportRect.top+viewport.scrollTop}px`;
  if(label)label.textContent=`HERE • ${String(v.location||'').toUpperCase()}`;
  pointer.classList.remove('hidden');
}
function clearMapSelection({scroll=false}={}){
  state.mapSelectedVendorId='';state.mapSelectedCodes.clear();applyMapSelection();renderMapDirectory();hideVendorMapPointer();if(scroll)document.getElementById('mapViewport')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function selectMapLocation(code){state.mapSelectedVendorId='';state.mapSelectedCodes=new Set([String(code||'').toUpperCase()]);applyMapSelection();renderMapDirectory();hideVendorMapPointer()}
function selectVendorOnMap(v,{openInfo=false}={}){
  state.mapSelectedVendorId=v.id;state.mapSelectedCodes=new Set(expandLocationCodes(v.location));applyMapSelection();renderMapDirectory();
  const groups=selectedVendorMapGroups(v),first=groups[0];
  document.getElementById('mapViewport')?.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>{
    first?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
    setTimeout(()=>{
      positionVendorMapPointer(v);
      if(openInfo){
        const firstCode=[...state.mapSelectedCodes][0];
        if(firstCode)openMapLocation(firstCode,{nonModal:true});
      }
    },280);
  },180);
}
function applyMapSelection(){
  const svg=document.querySelector('#mapSvgHost svg');if(svg){svg.querySelectorAll('.map-table.selected,.service.selected').forEach(el=>el.classList.remove('selected'));state.mapSelectedCodes.forEach(code=>svg.querySelectorAll(`.map-location-group[data-location="${CSS.escape(code)}"] .map-table,.map-location-group[data-location="${CSS.escape(code)}"] .service`).forEach(el=>el.classList.add('selected')))}
}
function applyMapZoom(){
  const svg=document.querySelector('#mapSvgHost svg');
  const viewport=document.getElementById('mapViewport');
  if(!svg)return;

  // 1.0 means FIT TO AVAILABLE WIDTH. This keeps the complete map visible
  // in the normal document flow instead of trapping it inside a 72vh box.
  const percent=Math.max(50,Math.round(mapZoom*100));
  svg.style.width=`${percent}%`;
  svg.style.height='auto';
  svg.style.maxWidth='none';

  // Horizontal scrolling is only useful after the visitor intentionally zooms in.
  viewport?.classList.toggle('map-is-zoomed',mapZoom>1.001);
  if(state.mapSelectedVendorId){
    const selected=state.vendors.find(v=>v.id===state.mapSelectedVendorId);
    if(selected)requestAnimationFrame(()=>positionVendorMapPointer(selected));
  }
}
function renderMapScreen(){
  const content=document.getElementById('mapPublishedContent'),draft=document.getElementById('mapDraftNotice'),subtitle=document.getElementById('mapSubtitle'),draftNote=document.getElementById('mapDraftNote');
  if(subtitle)subtitle.textContent=state.mapSettings.subtitle||'Interactive convention floor plan.';if(draftNote)draftNote.textContent=state.mapSettings.draftNote||'This map is still being prepared.';const visible=mapVisible();content?.classList.toggle('hidden',!visible);draft?.classList.toggle('hidden',state.mapSettings.published===true);if(!visible)return;renderMapLegend();renderFloorPlanSvg();renderMapDirectory();applyMapSelection();
}
document.getElementById('mapSearch')?.addEventListener('input',event=>{state.mapQuery=event.target.value;renderMapDirectory()});
document.getElementById('mapZoomIn')?.addEventListener('click',()=>{mapZoom=Math.min(2.75,mapZoom+.25);applyMapZoom()});document.getElementById('mapZoomOut')?.addEventListener('click',()=>{mapZoom=Math.max(.65,mapZoom-.25);applyMapZoom()});document.getElementById('mapZoomReset')?.addEventListener('click',()=>{mapZoom=1;applyMapZoom()});
document.getElementById('closeMapLocationModal')?.addEventListener('click',()=>document.getElementById('mapLocationModal')?.close());
document.getElementById('mapLocationModal')?.addEventListener('close',e=>e.currentTarget.classList.remove('map-directory-popover'));
document.getElementById('mapLocationModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});

function openConQuestInfo(){
  const vendorModal=document.getElementById('mapLocationModal');
  const modal=document.getElementById('conQuestInfoModal');
  if(!modal)return;

  if(vendorModal?.open){
    vendorModal.close();
  }

  // A tiny delay lets the browser release focus/inert state from the vendor
  // dialog before opening the Con-Quest explainer, which is more reliable on mobile.
  setTimeout(()=>{
    if(typeof modal.showModal==='function'&&!modal.open)modal.showModal();
    else if(!modal.open)modal.setAttribute('open','');
  },40);
}

function closeConQuestInfo(){
  document.getElementById('conQuestInfoModal')?.close();
}

document.addEventListener('click',event=>{
  const trigger=event.target.closest?.('[data-open-conquest-info]');
  if(!trigger)return;
  event.preventDefault();
  event.stopPropagation();
  openConQuestInfo();
});

document.getElementById('closeConQuestInfoModal')?.addEventListener('click',closeConQuestInfo);
document.getElementById('conQuestInfoModal')?.addEventListener('click',event=>{
  if(event.target===event.currentTarget)event.currentTarget.close();
});
window.addEventListener('resize',()=>{
  if(!state.mapSelectedVendorId)return;
  const selected=state.vendors.find(v=>v.id===state.mapSelectedVendorId);
  if(selected)requestAnimationFrame(()=>positionVendorMapPointer(selected));
});


function socialIconSvg(platform){
  const p=String(platform||"").toLowerCase();
  if(p==="facebook"||p==="facebook-page"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18.7 29V17.2h4l.6-4.6h-4.6V9.7c0-1.3.4-2.2 2.3-2.2h2.5V3.4c-.4-.1-1.9-.2-3.6-.2-3.6 0-6 2.2-6 6.1v3.4h-4v4.6h4V29h4.8z"/></svg>';
  }
  if(p==="facebook-group"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="5"/><circle cx="22.5" cy="12" r="3.8"/><path d="M3 27c.5-6 3.3-9.3 9-9.3s8.5 3.3 9 9.3H3zm17.3-.2c-.2-2.8-1-5.1-2.5-6.8 1.1-.7 2.5-1.1 4.2-1.1 4.5 0 6.7 2.7 7 7.9h-8.7z"/></svg>';
  }
  if(p==="facebook-event"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="3"/><path class="cut" d="M4 12h24M10 3v7M22 3v7"/><path class="cut" d="M10 18h4v4h-4zM18 18h4v4h-4z"/></svg>';
  }
  if(p==="instagram"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="7"/><circle class="cut" cx="16" cy="16" r="6"/><circle cx="23.5" cy="8.5" r="1.7"/></svg>';
  }
  if(p==="youtube"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2.5" y="7" width="27" height="18" rx="6"/><path class="inverse" d="M13 11.5 22 16l-9 4.5v-9z"/></svg>';
  }
  if(p==="threads"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 4 8.2 4 15.7 4 24 9 29 16.1 29c6.1 0 10.2-3.5 10.2-8.4 0-3.5-2.2-6.1-5.9-7.2-.6-4-3.1-6.2-7-6.2-3.4 0-5.9 1.8-6.8 4.9l4 1c.4-1.5 1.4-2.3 2.9-2.3 1.6 0 2.6.8 2.9 2.3-5.4.1-8.5 2.4-8.5 6.2 0 3.5 2.8 5.9 6.8 5.9 3.8 0 6.1-2.1 6.4-5.8.8.6 1.2 1.4 1.2 2.4 0 2.2-2.1 3.7-5.3 3.7-5.1 0-8-3.6-8-10.1C8 10.4 11 7 16 7c4.8 0 7.8 2.9 8.3 8.1l4-.4C27.6 7.4 23 3 16 3zm-1.1 18.6c-1.7 0-2.8-.9-2.8-2.3 0-1.6 1.6-2.5 4.4-2.5h.3v.9c0 2.5-.6 3.9-1.9 3.9z"/></svg>';
  }
  if(p==="bluesky"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7.1 5.4C10.7 8.1 14.5 13.7 16 16.7c1.5-3 5.3-8.6 8.9-11.3 2.6-2 6.8-3.5 6.8 1.4 0 1-.6 8.3-1 9.5-1.4 4.3-6.5 5.4-11 4.7 7.9 1.3 9.9 5.7 5.6 10.1-8.1 8.3-11.6-2.1-12.5-4.7-.2-.5-.3-.8-.4-.8-.1 0-.2.3-.4.8-.9 2.6-4.4 13-12.5 4.7-4.3-4.4-2.3-8.8 5.6-10.1-4.5.7-9.6-.4-11-4.7-.4-1.2-1-8.5-1-9.5 0-4.9 4.2-3.4 6.8-1.4z" transform="scale(.78) translate(4 1)"/></svg>';
  }
  if(p==="tiktok"){
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18.2 3h5c.2 2.5 1.7 4.7 4 5.9v5c-1.5-.1-2.9-.5-4-1.2v8.5c0 5-4 8.8-9 8.8s-9-3.8-9-8.8 4-8.8 9-8.8c.7 0 1.4.1 2 .2v5.1a4.3 4.3 0 0 0-2-.5c-2.3 0-4.1 1.8-4.1 4s1.8 4 4.1 4 4-1.8 4-4V3z"/></svg>';
  }
  return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12"/><path class="inverse" d="M10 15h12v3H10z"/></svg>';
}

function renderSocialLinks(){
  const host=document.getElementById("socialLinksGrid");
  if(!host)return;

  const links=(state.socialLinks||[]).filter(item=>item&&item.url&&item.enabled!==false);
  if(!links.length){
    host.innerHTML='<div class="muted-empty social-empty">Social links are being updated.</div>';
    return;
  }

  host.innerHTML=links.map(item=>`
    <a class="social-link-card social-${escapeAppHtml(String(item.platform||"other").replace(/[^a-z0-9-]/gi,"").toLowerCase())}"
       href="${escapeAppHtml(item.url)}" target="_blank" rel="noopener noreferrer">
      <span class="social-link-icon">${socialIconSvg(item.platform)}</span>
      <span class="social-link-copy">
        <strong>${escapeAppHtml(item.label||item.platform||"Social Media")}</strong>
        <small>${escapeAppHtml(item.subtitle||"FOLLOW SCI-FI VALLEY CON")}</small>
      </span>
      <b>↗</b>
    </a>`).join("");
}

function renderSponsors(){
  const host=document.getElementById("sponsorLogos");
  if(!host)return;

  const sponsors=(state.sponsors||[]).filter(item=>item&&item.name&&item.enabled!==false);
  if(!sponsors.length){
    host.innerHTML='<span class="sponsor-empty">Sponsor information coming soon.</span>';
    return;
  }

  host.innerHTML=sponsors.map(item=>{
    const content=item.logo
      ? `<img src="${escapeAppHtml(item.logo)}" alt="${escapeAppHtml(item.name)}" loading="lazy">`
      : `<span>${escapeAppHtml(item.name)}</span>${item.label?`<small>${escapeAppHtml(item.label)}</small>`:""}`;

    return `<a class="sponsor ${item.logo?"sponsor-image":"sponsor-wordmark"}"
       href="${escapeAppHtml(item.url||"#")}" ${item.url?'target="_blank" rel="noopener noreferrer"':""}
       aria-label="${escapeAppHtml(item.name)}">${content}</a>`;
  }).join("");
}


function tshirtYear(item){
  const match=String(item?.title||item?.badge||"").match(/\b(20\d{2}|19\d{2})\b/);
  return match?Number(match[1]):0;
}

function tshirtNumericPrice(item){
  const raw=String(item?.price||"").replace(/[^0-9.]/g,"");
  const value=Number(raw);
  return Number.isFinite(value)?value:999999;
}

function tshirtOptionText(item){
  const options=Array.isArray(item?.options)?item.options:[];
  const parts=[];
  for(const option of options){
    const name=String(option?.name||"").trim();
    const choices=Array.isArray(option?.choices)
      ? option.choices.map(choice=>String(choice?.text||choice?.name||choice||"").trim()).filter(Boolean)
      : [];
    if(name&&choices.length)parts.push(`${name}: ${choices.slice(0,12).join(", ")}${choices.length>12?"…":""}`);
  }
  return parts.join(" • ");
}

function tshirtImages(item){
  const values=[
    item?.image,
    ...(Array.isArray(item?.gallery)?item.gallery:[])
  ].map(String).map(v=>v.trim()).filter(Boolean);
  return [...new Set(values)];
}

function openTshirtImage(id,imageIndex=0){
  const item=(state.tshirts||[]).find(row=>String(row.id)===String(id));
  if(!item)return;
  const images=tshirtImages(item);
  if(!images.length)return;

  const modal=document.getElementById("tshirtImageModal");
  const image=document.getElementById("tshirtLightboxImage");
  const title=document.getElementById("tshirtLightboxTitle");
  const thumbs=document.getElementById("tshirtLightboxThumbs");
  if(!modal||!image||!title||!thumbs)return;

  const setImage=index=>{
    const safeIndex=Math.max(0,Math.min(images.length-1,Number(index)||0));
    image.src=images[safeIndex];
    image.alt=item.title||"Sci-Fi Valley Con T-shirt";
    thumbs.querySelectorAll("button").forEach((button,i)=>button.classList.toggle("active",i===safeIndex));
  };

  title.textContent=item.title||"Official Sci-Fi Valley Con T-shirt";
  thumbs.innerHTML=images.length>1?images.map((src,index)=>`
    <button type="button" data-tshirt-thumb="${index}" aria-label="View image ${index+1}">
      <img src="${escapeAppHtml(src)}" alt="">
    </button>`).join(""):"";

  thumbs.querySelectorAll("[data-tshirt-thumb]").forEach(button=>{
    button.addEventListener("click",()=>setImage(button.dataset.tshirtThumb));
  });

  setImage(imageIndex);
  modal.showModal();
}


function renderHomeGuestBanner(){
  const button=document.getElementById("homeGuestBanner");
  const image=document.getElementById("homeGuestBannerImage");
  if(!button||!image)return;

  const cfg=state.homeBanner||{};
  const enabled=cfg.enabled!==false;
  button.classList.toggle("hidden",!enabled);
  if(!enabled)return;

  const src=String(cfg.imageUrl||"").trim();
  if(src && image.src!==src) image.src=src;

  image.alt=String(cfg.alt||"Sci-Fi Valley Con celebrity guest banner");
  button.dataset.go=String(cfg.linkTarget||"guests");
}


function faqAnswerText(item){
  return String(item?.answer||"")
    .replaceAll("{EVENT_DATES}",formatEventDateRange(false));
}

function renderFaqFilters(){
  const host=document.getElementById("faqFilters");
  if(!host)return;

  const categories=["All",...new Set((state.faq||[])
    .filter(item=>item&&item.enabled!==false&&item.category)
    .map(item=>String(item.category).trim())
    .filter(Boolean))];

  host.innerHTML=categories.map(category=>`
    <button type="button"
      class="chip ${state.faqFilter===category?"active":""}"
      data-faq-filter="${escapeAppHtml(category)}">
      ${escapeAppHtml(category.toUpperCase())}
    </button>`).join("");

  host.querySelectorAll("[data-faq-filter]").forEach(button=>{
    button.addEventListener("click",()=>{
      state.faqFilter=button.dataset.faqFilter||"All";
      renderFaqFilters();
      renderFaq();
    });
  });
}

function renderFaq(){
  const host=document.getElementById("faqList");
  if(!host)return;

  const q=String(document.getElementById("faqSearch")?.value||"").trim().toLowerCase();
  const items=(state.faq||[])
    .filter(item=>item&&item.enabled!==false&&item.question)
    .filter(item=>state.faqFilter==="All"||String(item.category||"")===state.faqFilter)
    .filter(item=>{
      if(!q)return true;
      const haystack=[
        item.question,
        item.answer,
        item.category,
        ...(Array.isArray(item.bullets)?item.bullets:[])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });

  if(!items.length){
    host.innerHTML='<div class="muted-empty">No FAQ entries match your search.</div>';
    return;
  }

  host.innerHTML=items.map((item,index)=>{
    const answer=faqAnswerText(item);
    const paragraphs=answer.split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
    const bullets=Array.isArray(item.bullets)?item.bullets.filter(Boolean):[];

    return `<details class="faq-item" ${q&&items.length<=3?"open":""}>
      <summary>
        <span class="faq-number">${String(index+1).padStart(2,"0")}</span>
        <span class="faq-summary-copy">
          <small>${escapeAppHtml(String(item.category||"General").toUpperCase())}</small>
          <strong>${escapeAppHtml(item.question)}</strong>
        </span>
        <span class="faq-chevron">+</span>
      </summary>
      <div class="faq-answer">
        ${paragraphs.map(text=>`<p>${escapeAppHtml(text)}</p>`).join("")}
        ${bullets.length?`<ul>${bullets.map(text=>`<li>${escapeAppHtml(text)}</li>`).join("")}</ul>`:""}
      </div>
    </details>`;
  }).join("");
}

function renderTshirts(){
  const host=document.getElementById("tshirtGrid");
  if(!host)return;

  const q=String(document.getElementById("tshirtSearch")?.value||"").trim().toLowerCase();
  const sort=String(document.getElementById("tshirtSort")?.value||"store");

  let shirts=(state.tshirts||[]).filter(item=>item&&item.title&&item.enabled!==false);
  shirts=shirts.filter(item=>!q||JSON.stringify(item).toLowerCase().includes(q));

  if(sort==="newest")shirts.sort((a,b)=>tshirtYear(b)-tshirtYear(a));
  if(sort==="oldest")shirts.sort((a,b)=>tshirtYear(a)-tshirtYear(b));
  if(sort==="price-low")shirts.sort((a,b)=>tshirtNumericPrice(a)-tshirtNumericPrice(b));
  if(sort==="price-high")shirts.sort((a,b)=>tshirtNumericPrice(b)-tshirtNumericPrice(a));

  const count=document.getElementById("tshirtCatalogCount");
  if(count)count.textContent=`${shirts.length} SHIRT${shirts.length===1?"":"S"} SHOWN`;

  if(!shirts.length){
    host.innerHTML='<div class="muted-empty">No matching shirts are currently listed.</div>';
    return;
  }

  host.innerHTML=shirts.map(item=>{
    const images=tshirtImages(item);
    const mainImage=images[0]||"";
    const options=tshirtOptionText(item);
    const inStock=item.inStock!==false;
    const description=String(item.description||"").replace(/\s+/g," ").trim();

    return `<article class="tshirt-shop-card">
      <button class="tshirt-shop-image-button ${mainImage?"has-image":"no-image"}"
        type="button" data-tshirt-image="${escapeAppHtml(item.id)}" ${mainImage?"":"disabled"}>
        ${mainImage
          ? `<img src="${escapeAppHtml(mainImage)}" alt="${escapeAppHtml(item.title)}" loading="lazy">`
          : `<div class="tshirt-placeholder"><span>SFVC</span><b>IMAGE PENDING</b></div>`}
        ${item.badge?`<span class="tshirt-badge">${escapeAppHtml(item.badge)}</span>`:""}
        ${mainImage?'<span class="tshirt-enlarge-hint">TAP TO ENLARGE</span>':""}
      </button>

      <div class="tshirt-shop-card-copy">
        <div class="tshirt-shop-card-title">
          <span class="tshirt-stock ${inStock?"in":"out"}">${inStock?"AVAILABLE":"OUT OF STOCK"}</span>
          <h2>${escapeAppHtml(item.title)}</h2>
        </div>

        <div class="tshirt-price-row">
          <strong>${escapeAppHtml(item.price||"SEE STORE")}</strong>
          ${item.source==="ecwid"?'<small>LIVE STORE LISTING</small>':""}
        </div>

        ${description?`<p>${escapeAppHtml(description)}</p>`:""}
        ${options?`<div class="tshirt-options">${escapeAppHtml(options)}</div>`:""}

        <a class="tshirt-buy-button" href="${escapeAppHtml(item.url||"https://www.cryptoteeology.com/shop/Sci-fi-Valley-Con-Shirts-c118538756")}"
          target="_blank" rel="noopener">
          BUY NOW AT CRYPTOTEEOLOGY ↗
        </a>
      </div>
    </article>`;
  }).join("");

  host.querySelectorAll("[data-tshirt-image]").forEach(button=>{
    button.addEventListener("click",()=>openTshirtImage(button.dataset.tshirtImage,0));
  });
}


function safeRenderSection(name,fn){
  try{
    const result=fn();
    if(result&&typeof result.catch==="function"){
      result.catch(err=>console.error(`SFVC ${name} render failed`,err));
    }
    return result;
  }catch(err){
    console.error(`SFVC ${name} render failed`,err);
    return null;
  }
}

function renderAll(){
  // These two are intentionally first so a failure elsewhere in the app can
  // never leave their original "Loading..." placeholders on screen.
  safeRenderSection("home guest banner",renderHomeGuestBanner);
  safeRenderSection("social links",renderSocialLinks);
  safeRenderSection("sponsors",renderSponsors);
  safeRenderSection("t-shirts",renderTshirts);
  safeRenderSection("FAQ filters",renderFaqFilters);
  safeRenderSection("FAQ",renderFaq);

  safeRenderSection("event settings",applyEventSettings);
  safeRenderSection("directions",renderDirections);
  safeRenderSection("map",renderMapScreen);
  safeRenderSection("guest filters",renderGuestFilters);
  safeRenderSection("guests",renderGuests);
  safeRenderSection("favorites",renderFavorites);
  safeRenderSection("day filters",renderDayFilters);
  safeRenderSection("schedule category filters",renderScheduleCategoryFilters);
  safeRenderSection("schedule",renderSchedule);
  safeRenderSection("event status",renderStatus);
  safeRenderSection("featured event buttons",renderEventQuickLinks);
  safeRenderSection("event filters",renderEventFilters);
  safeRenderSection("event guide",renderEvents);
  safeRenderSection("celebrity guide",renderCelebrityGuide);
  safeRenderSection("My Con",renderMySchedule);
  safeRenderSection("reminder UI",updateReminderUI);
  safeRenderSection("notification status",updateNotificationStatus);
  safeRenderSection("app registration",renderAppRegistration);
}
document.getElementById("guestSearch").addEventListener("input",renderGuests);
document.getElementById("eventSearch").addEventListener("input",renderEvents);
document.getElementById("showAllScheduleCategories")?.addEventListener("click",()=>{
  state.scheduleHiddenCategories.clear();
  localStorage.setItem("sfvc-schedule-hidden-categories","[]");
  renderScheduleCategoryFilters();
  renderSchedule();
});
document.querySelectorAll("[data-celebrity-tab]").forEach(b=>b.addEventListener("click",()=>{state.celebrityTab=b.dataset.celebrityTab;renderCelebrityTabs()}));


document.querySelectorAll("[data-mycon-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mycon-tab]").forEach(x=>x.classList.toggle("active",x===b));document.getElementById("schedulePreview").classList.toggle("hidden",b.dataset.myconTab!=="schedule");document.getElementById("favoritePreview").classList.toggle("hidden",b.dataset.myconTab!=="guests")}));
function openReminderSettings(){
  updateReminderUI();
  const modal=document.getElementById("reminderModal");
  if(modal&&!modal.open)modal.showModal();
}

document.getElementById("openReminderSheet").addEventListener("click",openReminderSettings);

document.addEventListener("click",event=>{
  const trigger=event.target.closest?.("[data-open-reminder-settings]");
  if(!trigger)return;
  event.preventDefault();
  event.stopPropagation();
  openReminderSettings();
});
document.getElementById("closeReminderModal").addEventListener("click",()=>document.getElementById("reminderModal").close());
document.querySelectorAll('input[name="reminder"]').forEach(i=>i.addEventListener("change",()=>{
  state.reminderMinutes=+i.value;
  localStorage.setItem("sfvc-reminder-minutes",String(state.reminderMinutes));
  updateReminderUI();
  scheduleAnonymousDeviceSync(50);
  setTimeout(()=>document.getElementById("reminderModal").close(),150);
}));
document.getElementById("testReminderButton")?.addEventListener("click",scheduleReminderDeliveryTest);
document.getElementById("enableNotificationsButton").addEventListener("click",enablePushNotifications);
document.getElementById("pushBannerEnableButton")?.addEventListener("click",enablePushFromBanner);
document.getElementById("pushPromptEnableButton")?.addEventListener("click",enablePushFromPrompt);
document.getElementById("pushPromptLaterButton")?.addEventListener("click",closePushPrompt);
document.getElementById("closePushPromptModal")?.addEventListener("click",closePushPrompt);
document.getElementById("pushPromptModal")?.addEventListener("click",event=>{
  if(event.target===event.currentTarget)closePushPrompt();
});
window.addEventListener("pageshow",event=>{
  if(event.persisted){
    initializePushPromptExperience({forceSessionPrompt:true});
  }
});

document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden"){
    pushLastHiddenAt=Date.now();
    return;
  }

  if(document.visibilityState==="visible"){
    ensurePushSubscriptionHealthy().catch(()=>{});
    updateNotificationStatus().catch(()=>{});
    refreshRemoteReminderStatus().catch(()=>{});
    refreshAnonymousDeviceStatus().catch(()=>{});
    maybeRefreshProgramData("foreground").catch(()=>{});
    syncSavedAppRegistration().catch(()=>{});

    const lastDeviceSync=readTimestampMs("sfvc-device-last-sync");
    if(!lastDeviceSync||Date.now()-lastDeviceSync>=DEVICE_SAFETY_SYNC_MS){
      scheduleAnonymousDeviceSync(100);
    }
  }

  if(document.visibilityState==="visible" &&
     pushLastHiddenAt &&
     Date.now()-pushLastHiddenAt>=PUSH_REOPEN_RESET_MS){
    initializePushPromptExperience({forceSessionPrompt:true});
  }
});

window.addEventListener("online",()=>{
  ensurePushSubscriptionHealthy({force:true}).then(()=>{
    updateNotificationStatus();
    syncServerReminders({force:true}).catch(()=>{});
    syncAnonymousDevice({force:true}).catch(()=>{});
    syncSavedAppRegistration({force:true}).catch(()=>{});
  }).catch(()=>{});
});
window.addEventListener("pageshow",()=>{
  ensurePushSubscriptionHealthy().then(()=>updateNotificationStatus()).catch(()=>{});
  maybeRefreshProgramData("pageshow").catch(()=>{});
});
navigator.serviceWorker?.addEventListener?.("controllerchange",()=>{
  pushHealthLastCheckedAt=0;
  ensurePushSubscriptionHealthy({force:true}).then(()=>updateNotificationStatus()).catch(()=>{});
});

document.getElementById("pushBannerDismissButton")?.addEventListener("click",()=>{pushBannerEligible=false;document.getElementById("pushOptInBanner")?.classList.add("hidden");startPushBannerTimer();});
document.getElementById("disablePushNotificationsButton")?.addEventListener("click",async()=>{
  await unregisterPushSubscription();
  pushBannerEligible=false;
  startPushBannerTimer();
  await updateNotificationStatus();
  await updatePushOptInBanner();
});

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
if("serviceWorker" in navigator)window.addEventListener("load",async()=>{
  try{
    const swRegistration=await navigator.serviceWorker.register("service-worker.js",{updateViaCache:"none"});
    swRegistration.update().catch(()=>{});
    if(Notification.permission==="granted"&&!pushWasExplicitlyDisabled()){
      ensurePushSubscriptionHealthy().then(()=>updateNotificationStatus()).catch(()=>{});
    }
  }catch(err){
    console.warn("Service worker registration failed",err);
  }
});



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


/* V3.8.5 — suppress browser double-click/double-tap zoom inside the app.
   CSS touch-action: manipulation is the primary control and still permits pinch zoom. */
document.addEventListener("dblclick",event=>{
  if(event.target.closest(".topbar,.bottom-nav,#app")){
    event.preventDefault();
  }
},{passive:false});

document.getElementById("appRegistrationForm")?.addEventListener("submit",submitAppRegistration);
document.getElementById("removeAppRegistration")?.addEventListener("click",removeAppRegistration);

initializeAppAnalytics();
initializeRecentAlerts();
initializeEventCountdown();
initializeProgramTools();
initializeDirections();

loadData().then(()=>{
  startVisibleAppRefresh();
  startSafetySyncLoops();
  syncSavedAppRegistration().catch(()=>{});
}).catch(err=>{
  console.error(err);
  renderMySchedule();
  document.getElementById("happeningNow").innerHTML=`<div class="status-card"><strong>APP DATA COULD NOT LOAD.</strong><div class="meta">Saved My Con items remain available while the app retries the latest program data.</div></div>`;
});
