(()=>{
"use strict";

const MAIN_DEFAULTS=[
  {id:"celebrity-guide",type:"builtin",visible:true,order:10},
  {id:"directions",type:"builtin",visible:true,order:20},
  {id:"hotels",type:"builtin",visible:true,order:30},
  {id:"attendee-reporter",type:"builtin",visible:true,order:40},
  {id:"lost-found",type:"builtin",visible:true,order:50},
  {id:"cosplay-clinic",type:"builtin",visible:true,order:60},
  {id:"notification-settings",type:"builtin",visible:true,order:70},
  {id:"notifications",type:"builtin",visible:true,order:80},
  {id:"registration",type:"builtin",visible:true,order:90},
  {id:"tshirts",type:"builtin",visible:true,order:100},
  {id:"faq",type:"builtin",visible:true,order:110}
];

const ACTIVITY_DEFAULTS=[
  {id:"con-quest",type:"builtin",visible:true,order:10},
  {id:"costume-contest",type:"builtin",visible:true,order:20},
  {id:"quick-sketches",type:"builtin",visible:true,order:30},
  {id:"charity-auction",type:"builtin",visible:true,order:40},
  {id:"shuttle",type:"builtin",visible:true,order:50},
  {id:"after-party",type:"builtin",visible:true,order:60},
  {id:"medieval-combat",type:"builtin",visible:true,order:70},
  {id:"retro-gaming",type:"builtin",visible:true,order:80},
  {id:"tabletop-gaming",type:"builtin",visible:true,order:90},
  {id:"trivia",type:"builtin",visible:true,order:100},
  {id:"workshops",type:"builtin",visible:true,order:110}
];

let lastSignature="";

function guide(){return document.getElementById("more")}
function safeText(value){return String(value??"")}

function normalize(saved,defaults,zone){
  const raw=Array.isArray(saved)?saved:[];
  const byId=new Map(raw.map(item=>[String(item?.id||""),item]));
  const built=defaults.map(base=>{
    const old=byId.get(base.id)||{};
    return{
      ...base,
      ...old,
      id:base.id,
      type:"builtin",
      zone,
      visible:old.visible!==false,
      order:Number.isFinite(Number(old.order))?Number(old.order):base.order
    };
  });
  const custom=raw.filter(item=>item&&item.type==="custom"&&item.id&&!defaults.some(base=>base.id===item.id)).map((item,index)=>({
    ...item,
    type:"custom",
    zone,
    visible:item.visible!==false,
    order:Number.isFinite(Number(item.order))?Number(item.order):1000+(index*10)
  }));
  return [...built,...custom].sort((a,b)=>Number(a.order||0)-Number(b.order||0));
}

function builtinMainElement(id){
  const root=guide();
  if(!root)return null;
  const selectors={
    "celebrity-guide":'.settings-menu-card[data-go="celebrity"]',
    "directions":'.settings-menu-card[data-go="directions"]',
    "hotels":'.settings-menu-card[data-go="hotels"]',
    "attendee-reporter":'.settings-menu-card[data-go="report"]',
    "lost-found":'.settings-menu-card[data-go="lost-found"]',
    "cosplay-clinic":'.settings-menu-card[data-go="cosplay-clinic"]',
    "notification-settings":'.settings-menu-card[data-go="settings"]',
    "notifications":'.settings-menu-card[data-go="notifications"]',
    "registration":'.settings-menu-card[data-go="registration"]',
    "tshirts":'.settings-menu-card[data-go="tshirts"]',
    "faq":'.settings-menu-card[data-go="faq"]'
  };
  return root.querySelector(selectors[id]||".sfvc-no-match");
}

function builtinActivityElement(id){
  const grid=document.getElementById("eventQuickGrid");
  if(!grid)return null;
  return [...grid.querySelectorAll('[data-event-open]')].find(button=>button.dataset.eventOpen===id)||null;
}

function openCustom(item){
  const destination=safeText(item.destination).trim();
  if(!destination)return;

  if(item.linkType==="url"){
    if(/^https:\/\//i.test(destination))window.open(destination,"_blank","noopener");
    return;
  }

  if(item.linkType==="event"){
    if(typeof window.goTo==="function")window.goTo("more");
    setTimeout(()=>{
      const target=[...document.querySelectorAll("[data-event-open]")].find(button=>button.dataset.eventOpen===destination);
      target?.click();
    },80);
    return;
  }

  if(typeof window.goTo==="function"){
    window.goTo(destination);
    return;
  }

  document.querySelector(`.nav-button[data-screen="${CSS.escape(destination)}"]`)?.click();
}

function mainCustomElement(item){
  const button=document.createElement("button");
  button.type="button";
  button.className=`settings-menu-card sfvc-event-layout-custom-main sfvc-event-layout-style-${["coral","aqua","mustard","pink","paper"].includes(item.style)?item.style:"paper"}`;
  button.dataset.sfvcEventGuideLayoutId=item.id;

  const icon=document.createElement("span");
  icon.className="settings-menu-icon sfvc-event-layout-custom-icon";
  icon.setAttribute("data-font-scale","locked");
  icon.setAttribute("aria-hidden","true");
  icon.textContent=safeText(item.icon||"★").slice(0,4);

  const copy=document.createElement("span");
  const strong=document.createElement("strong");
  strong.textContent=safeText(item.title||"MORE INFORMATION");
  const small=document.createElement("small");
  small.textContent=safeText(item.description||item.kicker||"");
  copy.append(strong,small);

  const arrow=document.createElement("b");
  arrow.setAttribute("data-font-scale","locked");
  arrow.setAttribute("aria-hidden","true");
  arrow.textContent="›";

  button.append(icon,copy,arrow);
  button.addEventListener("click",()=>openCustom(item));
  return button;
}

function activityTone(style){
  if(style==="coral")return "tone-coral";
  if(style==="mustard")return "tone-mustard";
  if(style==="pink"||style==="paper")return "tone-pink";
  return "tone-aqua";
}

function activityCustomElement(item){
  const button=document.createElement("button");
  button.type="button";
  button.className=`event-quick-button ${activityTone(item.style)} sfvc-event-layout-custom-activity`;
  button.dataset.sfvcEventGuideLayoutId=item.id;

  const icon=document.createElement("span");
  icon.className="event-quick-icon";
  icon.setAttribute("aria-hidden","true");
  icon.textContent=safeText(item.icon||"★").slice(0,4);

  const copy=document.createElement("span");
  copy.className="event-quick-copy";
  const small=document.createElement("small");
  small.textContent=safeText(item.kicker||"EVENT GUIDE");
  const strong=document.createElement("strong");
  strong.textContent=safeText(item.title||"More Information");
  copy.append(small,strong);

  const arrow=document.createElement("span");
  arrow.className="event-quick-arrow";
  arrow.setAttribute("aria-hidden","true");
  arrow.textContent="›";

  button.append(icon,copy,arrow);
  button.addEventListener("click",()=>openCustom(item));
  return button;
}

function ensureMainZone(){
  const root=guide();
  if(!root)return null;
  let zone=document.getElementById("sfvcEventGuideMainLayoutZone");
  if(zone)return zone;

  zone=document.createElement("div");
  zone.id="sfvcEventGuideMainLayoutZone";
  zone.className="sfvc-event-guide-main-layout-zone";

  const title=root.querySelector(":scope > .page-title");
  if(title?.nextSibling)root.insertBefore(zone,title.nextSibling);
  else root.prepend(zone);
  return zone;
}

function applyMain(items){
  const zone=ensureMainZone();
  if(!zone)return;

  zone.querySelectorAll(":scope > .sfvc-event-layout-custom-main").forEach(element=>element.remove());

  for(const base of MAIN_DEFAULTS){
    const element=builtinMainElement(base.id);
    if(element){
      element.classList.remove("sfvc-event-layout-hidden");
      element.dataset.sfvcEventGuideLayoutId=base.id;
    }
  }

  for(const item of items){
    if(item.type==="builtin"){
      const element=builtinMainElement(item.id);
      if(!element)continue;
      element.classList.toggle("sfvc-event-layout-hidden",item.visible===false);
      zone.appendChild(element);
    }else if(item.type==="custom"&&item.visible!==false){
      zone.appendChild(mainCustomElement(item));
    }
  }
}

function applyActivities(items){
  const grid=document.getElementById("eventQuickGrid");
  if(!grid)return;

  grid.querySelectorAll(":scope > .sfvc-event-layout-custom-activity").forEach(element=>element.remove());

  for(const base of ACTIVITY_DEFAULTS){
    const element=builtinActivityElement(base.id);
    if(element){
      element.classList.remove("sfvc-event-layout-hidden");
      element.dataset.sfvcEventGuideLayoutId=base.id;
    }
  }

  for(const item of items){
    if(item.type==="builtin"){
      const element=builtinActivityElement(item.id);
      if(!element)continue;
      element.classList.toggle("sfvc-event-layout-hidden",item.visible===false);
      grid.appendChild(element);
    }else if(item.type==="custom"&&item.visible!==false){
      grid.appendChild(activityCustomElement(item));
    }
  }
}

function apply(layout){
  const mainItems=normalize(layout?.mainItems,MAIN_DEFAULTS,"main");
  const activityItems=normalize(layout?.activityItems,ACTIVITY_DEFAULTS,"activities");
  applyMain(mainItems);
  applyActivities(activityItems);
  try{window.fitProgramPageHeadings?.(guide())}catch{}
}

async function refresh(force=false){
  try{
    const response=await fetch(`data/map-settings.json?eventGuideLayout=${Date.now()}`,{cache:"no-store"});
    if(!response.ok)return;
    const raw=await response.json();
    const settings=Array.isArray(raw)?raw[0]:raw;
    const layout=settings?.eventGuideLayout||{};
    const normalized={
      mainItems:normalize(layout.mainItems,MAIN_DEFAULTS,"main"),
      activityItems:normalize(layout.activityItems,ACTIVITY_DEFAULTS,"activities")
    };
    const signature=JSON.stringify(normalized);
    if(force||signature!==lastSignature){
      lastSignature=signature;
      apply(normalized);
    }
  }catch(err){
    console.warn("SFVC Event Guide layout could not refresh",err);
  }
}

refresh(true);
setInterval(()=>{if(document.visibilityState==="visible")refresh()},60000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refresh(true)});
window.addEventListener("pageshow",()=>refresh(true));
})();
