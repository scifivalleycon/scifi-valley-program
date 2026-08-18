(() => {
  "use strict";

  const EVENT_DATA_URL = `data/events.json?v=${Date.now()}`;
  let eventMap = new Map();
  let loadPromise = null;

  const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
  const wikiArticleCache = new Map();
  const wikiTitleCache = new Map();
  let wikiReturnScrollTop = 0;

  // A few console names in the Event Guide use common convention shorthand
  // rather than the exact Wikipedia article title. Everything else falls back
  // to Wikipedia search so newly added systems can still work without code edits.
  const WIKI_TITLE_ALIASES = new Map([
    ["sega game gear","Game Gear"],
    ["snk neo geo aes","Neo Geo (system)"],
    ["neo geo aes","Neo Geo (system)"],
    ["super nintendo","Super Nintendo Entertainment System"],
    ["snes","Super Nintendo Entertainment System"],
    ["philips cd-i","CD-i"],
    ["sony playstation","PlayStation (console)"],
    ["playstation","PlayStation (console)"],
    ["nintendo virtual boy","Virtual Boy"],
    ["sega dreamcast","Dreamcast"],
    ["sony playstation 2","PlayStation 2"],
    ["microsoft xbox","Xbox (console)"],
    ["nintendo gamecube","GameCube"],
    ["sony playstation 3","PlayStation 3"],
    ["nintendo wii","Wii"],
    ["nintendo wii u","Wii U"],
    ["sony playstation 4","PlayStation 4"],
    ["microsoft xbox one","Xbox One"],
    ["sony playstation 5","PlayStation 5"],
    ["microsoft xbox series x/s","Xbox Series X and Series S"],
    ["xbox series x/s","Xbox Series X and Series S"]
  ]);

  function esc(value){
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }


  function wikiKey(value){
    return String(value||"")
      .toLowerCase()
      .replace(/[®™©]/g,"")
      .replace(/[–—]/g,"-")
      .replace(/\s+/g," ")
      .trim();
  }

  function wikipediaArticleUrl(title){
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(String(title||"").replace(/ /g,"_"))}`;
  }

  async function wikiApi(params={}){
    const url=new URL(WIKIPEDIA_API);
    const merged={
      format:"json",
      formatversion:"2",
      origin:"*",
      ...params
    };
    Object.entries(merged).forEach(([key,value])=>{
      if(value!==undefined && value!==null && value!=="")url.searchParams.set(key,String(value));
    });

    const response=await fetch(url.toString(),{
      mode:"cors",
      credentials:"omit",
      cache:"default"
    });
    if(!response.ok)throw new Error(`Wikipedia returned ${response.status}`);
    const data=await response.json();
    if(data?.error)throw new Error(data.error.info||data.error.code||"Wikipedia request failed");
    return data;
  }

  async function resolveWikipediaTitle(consoleName,year){
    const key=wikiKey(consoleName);
    if(wikiTitleCache.has(key))return wikiTitleCache.get(key);

    const alias=WIKI_TITLE_ALIASES.get(key);
    if(alias){
      wikiTitleCache.set(key,alias);
      return alias;
    }

    const searchTerms=[consoleName,year,"video game console"].filter(Boolean).join(" ");
    const data=await wikiApi({
      action:"query",
      list:"search",
      srsearch:searchTerms,
      srnamespace:0,
      srlimit:6
    });
    const results=data?.query?.search||[];
    if(!results.length)throw new Error(`No Wikipedia article found for ${consoleName}`);

    const wanted=wikiKey(consoleName).replace(/[^a-z0-9]+/g," ").trim();
    const wantedTokens=wanted.split(" ").filter(token=>token.length>1);
    let best=results[0];
    let bestScore=-1;
    results.forEach(result=>{
      const title=wikiKey(result.title).replace(/[^a-z0-9]+/g," ").trim();
      let score=0;
      if(title===wanted)score+=100;
      if(title.startsWith(wanted)||wanted.startsWith(title))score+=30;
      wantedTokens.forEach(token=>{if(title.includes(token))score+=4;});
      if(/console|system|playstation|xbox|nintendo|sega|atari|game boy|dreamcast|wii|switch|jaguar|saturn|lynx|intellivision|colecovision|odyssey|neo geo/i.test(result.title))score+=3;
      if(score>bestScore){bestScore=score;best=result;}
    });

    wikiTitleCache.set(key,best.title);
    return best.title;
  }

  function makeWikipediaHtmlSafe(html){
    const doc=new DOMParser().parseFromString(String(html||""),"text/html");
    const root=doc.querySelector(".mw-parser-output")||doc.body;

    root.querySelectorAll([
      "script","style","link","meta","iframe","object","embed","form","input","textarea","select","button",
      ".mw-editsection",".mw-empty-elt",".noprint",".navbox",".vertical-navbox",".metadata",".ambox",
      ".hatnote",".toc",".reflist",".references",".authority-control",".sistersitebox",".portal",".catlinks",
      "sup.reference","table"
    ].join(",")).forEach(node=>node.remove());

    root.querySelectorAll("*").forEach(element=>{
      [...element.attributes].forEach(attr=>{
        const name=attr.name.toLowerCase();
        if(name.startsWith("on") || ["style","srcset","sizes","id"].includes(name))element.removeAttribute(attr.name);
      });
      element.removeAttribute("class");
    });

    root.querySelectorAll("img").forEach(img=>{
      let src=img.getAttribute("src")||"";
      if(src.startsWith("//"))src=`https:${src}`;
      else if(src.startsWith("/"))src=`https://en.wikipedia.org${src}`;
      if(src)img.setAttribute("src",src);
      img.removeAttribute("width");
      img.removeAttribute("height");
      img.setAttribute("loading","lazy");
      img.setAttribute("decoding","async");
    });

    root.querySelectorAll("a").forEach(anchor=>{
      const href=anchor.getAttribute("href")||"";
      if(!href)return;
      if(href.startsWith("#"))return;

      let wikiTitle="";
      try{
        if(href.startsWith("/wiki/")){
          wikiTitle=decodeURIComponent(href.slice(6).split("#")[0]).replace(/_/g," ");
        }else if(href.startsWith("./")){
          wikiTitle=decodeURIComponent(href.slice(2).split("#")[0]).replace(/_/g," ");
        }else{
          const url=new URL(href,"https://en.wikipedia.org");
          if(url.hostname==="en.wikipedia.org" && url.pathname.startsWith("/wiki/")){
            wikiTitle=decodeURIComponent(url.pathname.slice(6)).replace(/_/g," ");
          }
        }
      }catch{}

      if(wikiTitle && !/^(File|Special|Category|Template|Help|Portal|Wikipedia|Talk):/i.test(wikiTitle)){
        anchor.href="#";
        anchor.dataset.wikiTitle=wikiTitle;
        anchor.removeAttribute("target");
      }else{
        try{anchor.href=new URL(href,"https://en.wikipedia.org").href;}catch{}
        anchor.target="_blank";
        anchor.rel="noopener noreferrer";
      }
    });

    return root.innerHTML;
  }

  async function fetchWikipediaArticle(title){
    if(wikiArticleCache.has(title))return wikiArticleCache.get(title);
    const data=await wikiApi({
      action:"parse",
      page:title,
      prop:"text|displaytitle",
      redirects:1,
      disableeditsection:1,
      disabletoc:1
    });
    if(!data?.parse?.text)throw new Error(`Wikipedia article could not be loaded for ${title}`);
    const article={
      title:data.parse.title||title,
      html:makeWikipediaHtmlSafe(data.parse.text)
    };
    wikiArticleCache.set(title,article);
    return article;
  }

  function ensureWikiReader(){
    const modal=document.getElementById("eventModal");
    if(!modal)return null;
    let panel=modal.querySelector("#wikiReaderPanel");
    if(panel)return panel;

    panel=document.createElement("section");
    panel.id="wikiReaderPanel";
    panel.className="wiki-reader-panel";
    panel.setAttribute("role","dialog");
    panel.setAttribute("aria-modal","true");
    panel.setAttribute("aria-labelledby","wikiReaderTitle");
    panel.setAttribute("aria-hidden","true");
    panel.innerHTML=`
      <header class="wiki-reader-header">
        <div>
          <span class="wiki-reader-kicker">IN-APP WIKIPEDIA READER</span>
          <h2 id="wikiReaderTitle">WIKIPEDIA</h2>
          <p id="wikiReaderSubtitle">Console history & information</p>
        </div>
        <button id="closeWikiReader" class="wiki-reader-close" type="button" data-font-scale="locked" aria-label="Close Wikipedia reader">×</button>
      </header>
      <div id="wikiReaderScroll" class="wiki-reader-scroll" tabindex="0">
        <div id="wikiReaderStatus" class="wiki-reader-status">Choose a console to load its Wikipedia article.</div>
        <article id="wikiReaderArticle" class="wiki-reader-article"></article>
      </div>
      <footer class="wiki-reader-footer">
        <span>Content from Wikipedia under its applicable CC BY-SA license.</span>
        <a id="wikiReaderSourceLink" href="https://en.wikipedia.org" target="_blank" rel="noopener noreferrer">OPEN ORIGINAL PAGE ↗</a>
      </footer>`;
    modal.appendChild(panel);

    panel.querySelector("#closeWikiReader")?.addEventListener("click",event=>{
      event.preventDefault();
      event.stopPropagation();
      closeWikiReader();
    });
    return panel;
  }

  function closeWikiReader(){
    const modal=document.getElementById("eventModal");
    const panel=modal?.querySelector("#wikiReaderPanel");
    if(!modal||!panel)return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden","true");
    modal.classList.remove("wiki-reader-active");
    requestAnimationFrame(()=>{modal.scrollTop=wikiReturnScrollTop;});
  }

  async function openWikiReaderByTitle(title,{label=title,sourceSearch=""}={}){
    const modal=document.getElementById("eventModal");
    const panel=ensureWikiReader();
    if(!modal||!panel)return;

    if(!modal.open)modal.showModal();
    wikiReturnScrollTop=modal.scrollTop;
    modal.classList.add("wiki-reader-active");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden","false");

    const titleNode=panel.querySelector("#wikiReaderTitle");
    const subtitle=panel.querySelector("#wikiReaderSubtitle");
    const status=panel.querySelector("#wikiReaderStatus");
    const articleNode=panel.querySelector("#wikiReaderArticle");
    const scroll=panel.querySelector("#wikiReaderScroll");
    const sourceLink=panel.querySelector("#wikiReaderSourceLink");

    if(titleNode)titleNode.textContent=String(label||title||"Wikipedia").toUpperCase();
    if(subtitle)subtitle.textContent="Loading Wikipedia…";
    if(status){status.hidden=false;status.textContent="Loading article from Wikipedia…";}
    if(articleNode)articleNode.innerHTML="";
    if(sourceLink)sourceLink.href=sourceSearch||wikipediaArticleUrl(title);
    if(scroll)scroll.scrollTop=0;

    try{
      const article=await fetchWikipediaArticle(title);
      if(titleNode)titleNode.textContent=article.title.toUpperCase();
      if(subtitle)subtitle.textContent="Wikipedia article • displayed inside the Sci-Fi Valley Con app";
      if(status)status.hidden=true;
      if(articleNode)articleNode.innerHTML=article.html;
      if(sourceLink)sourceLink.href=wikipediaArticleUrl(article.title);
      if(scroll)scroll.scrollTop=0;
    }catch(err){
      console.error("Wikipedia reader failed:",err);
      if(subtitle)subtitle.textContent="Wikipedia article unavailable";
      if(status){
        status.hidden=false;
        status.innerHTML=`<strong>COULD NOT LOAD WIKIPEDIA</strong><br>Wikipedia requires an internet connection. You can try again or open the original article in your browser.`;
      }
      if(articleNode)articleNode.innerHTML="";
    }
  }

  async function openWikiReaderForConsole(consoleName,year){
    const panel=ensureWikiReader();
    const searchUrl=`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(consoleName)}`;
    if(panel){
      const source=panel.querySelector("#wikiReaderSourceLink");
      if(source)source.href=searchUrl;
    }
    try{
      const title=await resolveWikipediaTitle(consoleName,year);
      await openWikiReaderByTitle(title,{label:consoleName,sourceSearch:searchUrl});
    }catch(err){
      console.error("Wikipedia title lookup failed:",err);
      // Keep the whole experience inside the Event Guide and provide a browser
      // fallback instead of navigating the attendee away from the app.
      const modal=document.getElementById("eventModal");
      const reader=ensureWikiReader();
      if(!modal||!reader)return;
      if(!modal.open)modal.showModal();
      wikiReturnScrollTop=modal.scrollTop;
      modal.classList.add("wiki-reader-active");
      reader.classList.add("open");
      reader.setAttribute("aria-hidden","false");
      const titleNode=reader.querySelector("#wikiReaderTitle");
      const subtitle=reader.querySelector("#wikiReaderSubtitle");
      const status=reader.querySelector("#wikiReaderStatus");
      const articleNode=reader.querySelector("#wikiReaderArticle");
      const source=reader.querySelector("#wikiReaderSourceLink");
      if(titleNode)titleNode.textContent=String(consoleName||"Wikipedia").toUpperCase();
      if(subtitle)subtitle.textContent="Wikipedia article unavailable";
      if(status){status.hidden=false;status.innerHTML=`<strong>COULD NOT LOAD WIKIPEDIA</strong><br>Check your internet connection and try again.`;}
      if(articleNode)articleNode.innerHTML="";
      if(source)source.href=searchUrl;
    }
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
            <div class="system-card-heading">
              <strong>${esc(item.name)}</strong>
              ${item.year?`<span class="system-card-year">${esc(item.year)}</span>`:""}
            </div>
            ${item.desc?`<p>${esc(item.desc)}</p>`:""}
            <button class="system-wiki-button" type="button" data-wiki-console="${esc(item.name)}" data-wiki-year="${esc(item.year||"")}" data-font-scale-max="1.75" aria-label="Read about ${esc(item.name)} on Wikipedia inside the app">READ WIKIPEDIA</button>
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

  function showEventModal(modal){
    if(!modal)return;
    if(!modal.open)modal.showModal();

    // A reused <dialog> can retain its previous internal scroll position.
    // Reset it after opening so the event always starts at its heading while
    // the dialog itself remains centered in the current viewport.
    modal.scrollTop=0;
    const content=modal.querySelector("#eventModalContent");
    if(content)content.scrollTop=0;
    requestAnimationFrame(()=>{
      modal.scrollTop=0;
      if(content)content.scrollTop=0;
    });
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
      showEventModal(modal);
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

    showEventModal(modal);
  }

  function closeModal(){
    const modal=document.getElementById("eventModal");
    if(!modal)return;
    const reader=modal.querySelector("#wikiReaderPanel");
    reader?.classList.remove("open");
    reader?.setAttribute("aria-hidden","true");
    modal.classList.remove("wiki-reader-active");
    if(modal.open)modal.close();
  }

  // Wikipedia console links stay inside the Event Guide instead of navigating
  // away from the installed web app. Article links inside the reader do the same.
  document.addEventListener("click",event=>{
    const consoleButton=event.target.closest?.("[data-wiki-console]");
    if(consoleButton){
      event.preventDefault();
      event.stopImmediatePropagation();
      openWikiReaderForConsole(consoleButton.dataset.wikiConsole,consoleButton.dataset.wikiYear);
      return;
    }

    const wikiLink=event.target.closest?.("#wikiReaderPanel a[data-wiki-title]");
    if(wikiLink){
      event.preventDefault();
      event.stopImmediatePropagation();
      openWikiReaderByTitle(wikiLink.dataset.wikiTitle,{label:wikiLink.textContent?.trim()||wikiLink.dataset.wikiTitle});
    }
  },true);

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
      if(event.target!==event.currentTarget)return;
      if(event.currentTarget.classList.contains("wiki-reader-active"))closeWikiReader();
      else closeModal();
    },true);
  });
})();
