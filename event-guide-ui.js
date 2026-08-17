(() => {
  "use strict";

  const EVENT_DATA_URL = `data/events.json?v=${Date.now()}`;
  let eventMap = new Map();
  let loadPromise = null;

  function esc(value){
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  async function loadEvents(){
    if(eventMap.size)return eventMap;
    if(loadPromise)return loadPromise;

    loadPromise = fetch(EVENT_DATA_URL,{cache:"no-store",credentials:"same-origin"})
      .then(response => {
        if(!response.ok)throw new Error(`Event data returned ${response.status}`);
        return response.json();
      })
      .then(rows => {
        if(!Array.isArray(rows))throw new Error("Event data is not an array.");
        eventMap = new Map(rows.map(item => [String(item.id), item]));
        return eventMap;
      })
      .catch(err => {
        console.error("Standalone Event Guide could not load data:",err);
        return eventMap;
      })
      .finally(() => { loadPromise = null; });

    return loadPromise;
  }

  function renderMenu(items=[]){
    return `<div class="menu-list">${items.map(item=>`
      <div class="menu-row">
        <div><strong>${esc(item.name)}</strong>${item.desc?`<small>${esc(item.desc)}</small>`:""}</div>
        ${item.price?`<b>${esc(item.price)}</b>`:""}
      </div>`).join("")}</div>`;
  }

  function renderBlock(block){
    if(!block || typeof block!=="object")return "";

    if(block.type==="heading")return `<h3>${esc(block.text)}</h3>`;
    if(block.type==="p")return `<p>${esc(block.text)}</p>`;
    if(block.type==="note")return `<div class="event-note">${esc(block.text)}</div>`;

    if(block.type==="list"){
      return `<ul>${(block.items||[]).map(item=>`<li>${esc(item)}</li>`).join("")}</ul>`;
    }

    if(block.type==="schedule"){
      return `<div class="schedule-box">${(block.items||[]).map(item=>`<div>${esc(item)}</div>`).join("")}</div>`;
    }

    if(block.type==="menu"){
      return renderMenu(block.items||[]);
    }

    if(block.type==="systems"){
      return `<section class="system-section">
        ${block.title?`<h3>${esc(block.title)}</h3>`:""}
        <div class="system-grid">${(block.items||[]).map(item=>`
          <article class="system-card">
            <div><strong>${esc(item.name)}</strong>${item.year?`<span>${esc(item.year)}</span>`:""}</div>
            ${item.desc?`<p>${esc(item.desc)}</p>`:""}
          </article>`).join("")}</div>
      </section>`;
    }

    return "";
  }

  function metaFor(id,category){
    const meta={
      "con-quest":{icon:"★",tone:"aqua"},
      "costume-contest":{icon:"♛",tone:"coral"},
      "quick-sketches":{icon:"✎",tone:"mustard"},
      "charity-auction":{icon:"◆",tone:"pink"},
      "shuttle":{icon:"▰",tone:"aqua"},
      "after-party":{icon:"●",tone:"coral"},
      "medieval-combat":{icon:"⚔",tone:"mustard"},
      "retro-gaming":{icon:"✚",tone:"pink"},
      "tabletop-gaming":{icon:"⚄",tone:"aqua"},
      "trivia":{icon:"?",tone:"coral"},
      "workshops":{icon:"✦",tone:"mustard"}
    };
    return meta[id]||{icon:"★",tone:"aqua",category};
  }

  async function openEvent(eventId){
    await loadEvents();

    const event = eventMap.get(String(eventId));
    const modal = document.getElementById("eventModal");
    const content = document.getElementById("eventModalContent");

    if(!modal || !content)return;

    if(!event){
      content.innerHTML = `
        <div class="event-modal-inner">
          <div class="event-modal-hero tone-coral">
            <span class="event-modal-icon">!</span>
            <div>
              <span class="event-modal-category">EVENT GUIDE</span>
              <h2>DETAILS COULD NOT LOAD</h2>
              <p>Please close this window and try again.</p>
            </div>
          </div>
        </div>`;
      modal.showModal();
      return;
    }

    const meta = metaFor(event.id,event.category);

    content.innerHTML = `
      <div class="event-modal-inner">
        <div class="event-modal-hero tone-${esc(meta.tone)}">
          <span class="event-modal-icon">${esc(meta.icon)}</span>
          <div>
            <span class="event-modal-category">${esc(event.category||"Event")}</span>
            <h2>${esc(event.title)}</h2>
            <p>${esc(event.summary||"")}</p>
          </div>
        </div>
        <div class="event-modal-body event-content">
          ${(event.content||[]).map(renderBlock).join("")}
        </div>
      </div>`;

    modal.showModal();
  }

  function closeModal(){
    const modal=document.getElementById("eventModal");
    if(modal?.open)modal.close();
  }

  // Capture phase intentionally owns these clicks so the standalone UI works
  // even if the main app renderer is stale or fails.
  document.addEventListener("click",event=>{
    const button=event.target.closest?.("[data-event-open]");
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openEvent(button.dataset.eventOpen);
  },true);

  document.addEventListener("DOMContentLoaded",()=>{
    loadEvents();

    document.getElementById("closeEventModal")?.addEventListener("click",event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      closeModal();
    },true);

    document.getElementById("eventModal")?.addEventListener("click",event=>{
      if(event.target===event.currentTarget)closeModal();
    },true);
  });
})();