(()=>{
"use strict";
const DEFAULT_ITEMS=[
  {id:"attendee-reporter",type:"builtin",visible:true,order:10},
  {id:"lost-found",type:"builtin",visible:true,order:20},
  {id:"cosplay-clinic",type:"builtin",visible:true,order:30},
  {id:"guest-banner",type:"builtin",visible:true,order:40},
  {id:"photo-ops",type:"builtin",visible:true,order:50},
  {id:"purchase-actions",type:"builtin",visible:true,order:60},
  {id:"event-status",type:"builtin",visible:true,order:70},
  {id:"recent-alerts",type:"builtin",visible:true,order:80},
  {id:"quick-links",type:"builtin",visible:true,order:90},
  {id:"my-con",type:"builtin",visible:true,order:100},
  {id:"venue-card",type:"builtin",visible:true,order:110}
];
let lastSignature="";
function home(){return document.getElementById("home")}
function builtinElement(id){const h=home();if(!h)return null;const map={
  "attendee-reporter":()=>h.querySelector(':scope > .home-reporter-card[data-go="report"]'),
  "lost-found":()=>h.querySelector(':scope > .home-lost-found-card'),
  "cosplay-clinic":()=>h.querySelector(':scope > .home-cosplay-clinic-card'),
  "guest-banner":()=>document.getElementById("homeGuestBanner"),
  "photo-ops":()=>h.querySelector(':scope > a.photo-cta'),
  "purchase-actions":()=>h.querySelector(':scope > .purchase-quick-grid'),
  "event-status":()=>document.getElementById("happeningNow")?.closest(".paper-panel"),
  "recent-alerts":()=>document.getElementById("recentAlertsPanel"),
  "quick-links":()=>h.querySelector(':scope > .quick-grid'),
  "my-con":()=>document.getElementById("schedulePreview")?.closest(".paper-panel"),
  "venue-card":()=>h.querySelector(':scope > .venue-style-card')
};return map[id]?.()||null}
function normalize(layout){const saved=Array.isArray(layout?.items)?layout.items:[];const byId=new Map(saved.map(x=>[String(x.id||""),x]));const built=DEFAULT_ITEMS.map(base=>{const old=byId.get(base.id)||{};return{...base,...old,id:base.id,type:"builtin",visible:old.visible!==false,order:Number.isFinite(Number(old.order))?Number(old.order):base.order}});const custom=saved.filter(x=>x&&x.type==="custom"&&x.id&&!DEFAULT_ITEMS.some(d=>d.id===x.id)).map((x,index)=>({...x,type:"custom",visible:x.visible!==false,order:Number.isFinite(Number(x.order))?Number(x.order):1000+index*10}));return [...built,...custom].sort((a,b)=>Number(a.order||0)-Number(b.order||0))}
function safeText(v){return String(v??"")}
function validColor(value){return /^#[0-9A-F]{6}$/i.test(String(value||""))}
function colorData(item){const c=item?.colors||{};return ["background","text","accent","border"].every(key=>validColor(c[key]))?c:null}
function clearColorTarget(target){if(!target)return;target.classList.remove("sfvc-layout-colorized");target.removeAttribute("data-sfvc-layout-color-target");["--sfvc-layout-bg","--sfvc-layout-text","--sfvc-layout-accent","--sfvc-layout-border"].forEach(name=>target.style.removeProperty(name))}
function clearColors(root){if(!root)return;clearColorTarget(root);root.querySelectorAll?.(".sfvc-layout-colorized,[data-sfvc-layout-color-target]").forEach(clearColorTarget)}
function setColors(target,item){const c=colorData(item);if(!target||!c)return;target.classList.add("sfvc-layout-colorized");target.dataset.sfvcLayoutColorTarget="true";target.style.setProperty("--sfvc-layout-bg",c.background);target.style.setProperty("--sfvc-layout-text",c.text);target.style.setProperty("--sfvc-layout-accent",c.accent);target.style.setProperty("--sfvc-layout-border",c.border)}
function applyColors(id,root,item){
  clearColors(root);
  if(!colorData(item)||!root)return;
  let targets=[root];
  if(id==="purchase-actions")targets=[...root.querySelectorAll(":scope > .purchase-quick-card")];
  else if(id==="quick-links")targets=[...root.querySelectorAll(":scope > .quick-card")];
  else if(id==="guest-banner")targets=[root.querySelector(".home-guest-banner-cta")||root];
  else if(id==="venue-card")targets=[root.querySelector(".venue-style-copy")||root];
  targets.filter(Boolean).forEach(target=>setColors(target,item))
}
function openCustom(item){const dest=safeText(item.destination).trim();if(!dest)return;if(item.linkType==="url"){if(/^https:\/\//i.test(dest))window.open(dest,"_blank","noopener");return}if(item.linkType==="event"){if(typeof window.goTo==="function")window.goTo("more");setTimeout(()=>{const target=[...document.querySelectorAll("[data-event-open]")].find(x=>x.dataset.eventOpen===dest);target?.click()},80);return}if(typeof window.goTo==="function"){window.goTo(dest);return}document.querySelector(`.nav-button[data-screen="${CSS.escape(dest)}"]`)?.click()}
function customElement(item){const button=document.createElement("button");button.type="button";button.className=`home-reporter-card sfvc-layout-custom-card sfvc-layout-style-${["coral","aqua","mustard","pink","paper"].includes(item.style)?item.style:"paper"}`;button.dataset.sfvcHomeLayoutId=item.id;const icon=document.createElement("span");icon.className="home-reporter-icon sfvc-layout-custom-icon";icon.setAttribute("data-font-scale","locked");icon.setAttribute("aria-hidden","true");icon.textContent=safeText(item.icon||"★").slice(0,4);const copy=document.createElement("span");const small=document.createElement("small");small.textContent=safeText(item.kicker||"SCI-FI VALLEY CON");const strong=document.createElement("strong");strong.textContent=safeText(item.title||"MORE INFORMATION");const em=document.createElement("em");em.textContent=safeText(item.description||"");copy.append(small,strong,em);const arrow=document.createElement("b");arrow.setAttribute("data-font-scale","locked");arrow.setAttribute("aria-hidden","true");arrow.textContent="›";button.append(icon,copy,arrow);button.addEventListener("click",()=>openCustom(item));applyColors(item.id,button,item);return button}
function apply(items){const h=home();if(!h)return;h.querySelectorAll(":scope > .sfvc-layout-custom-card").forEach(x=>x.remove());for(const d of DEFAULT_ITEMS){const el=builtinElement(d.id);if(el){el.classList.remove("sfvc-layout-hidden");el.dataset.sfvcHomeLayoutId=d.id;clearColors(el)}}
  for(const item of items){if(item.type==="builtin"){const el=builtinElement(item.id);if(!el)continue;el.classList.toggle("sfvc-layout-hidden",item.visible===false);applyColors(item.id,el,item);h.appendChild(el)}else if(item.type==="custom"&&item.visible!==false){h.appendChild(customElement(item))}}
  try{window.fitProgramPageHeadings?.(h)}catch{}
}
async function refresh(force=false){try{const response=await fetch(`data/map-settings.json?layout=${Date.now()}`,{cache:"no-store"});if(!response.ok)return;const raw=await response.json();const settings=Array.isArray(raw)?raw[0]:raw;const layout=settings?.homeLayout;const items=normalize(layout);const signature=JSON.stringify(items);if(force||signature!==lastSignature){lastSignature=signature;apply(items)}}catch(err){console.warn("SFVC homepage layout could not refresh",err)}}
refresh(true);setInterval(()=>{if(document.visibilityState==="visible")refresh()},60000);document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refresh(true)});window.addEventListener("pageshow",()=>refresh(true));
})();
