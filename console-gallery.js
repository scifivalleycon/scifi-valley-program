/* Sci-Fi Valley Con console images. Names were matched to the supplied posters. */
(() => {
  "use strict";
  const records = [[1,"Magnavox Odyssey"],[2,"SNK Neo Geo CD","Neo Geo CD","SNK NeoGeo CD"],[3,"SNK Neo Geo AES","NeoGeo AES","Neo Geo AES","SNK NeoGeo AES"],[4,"Philips CD-i"],[5,"Sony PlayStation 2","PlayStation 2","PS2"],[6,"Sony PlayStation","PlayStation","Sony PlayStation 1","PlayStation 1","PS1"],[7,"Sega Dreamcast","Dreamcast"],[8,"Sega Genesis"],[9,"Sega Master System"],[10,"Sega Saturn"],[11,"Goldstar 3DO","GoldStar 3DO","3DO"],[12,"National Semiconductor Adversary","Adversary"],[13,"Mattel Intellivision","Intellivision"],[14,"Nintendo GameCube","GameCube"],[15,"ColecoVision"],[16,"Atari 7800"],[17,"Atari 5200"],[18,"Atari 2600"],[19,"Atari Jaguar"],[20,"Magnavox Odyssey²","Magnavox Odyssey 2","Odyssey 2"],[21,"Super Nintendo (SNES)","Super Nintendo","Super Nintendo Entertainment System","SNES"],[22,"NEC TurboGrafx-16 / PC Engine","TurboGrafx-16 / PC Engine","TurboGrafx-16","NEC TurboGrafx-16"],[23,"Nintendo Virtual Boy","Virtual Boy"],[24,"Nintendo Wii","Wii"],[25,"Xbox 360","Microsoft Xbox 360"],[26,"Microsoft Xbox","Xbox","Original Xbox"],[27,"PlayStation 4","Sony PlayStation 4","PS4"],[28,"Sony PlayStation 3","PlayStation 3","PS3"],[29,"PlayStation 5","Sony PlayStation 5","PS5"],[30,"Twin Famicom","Sharp Twin Famicom"],[31,"Nintendo Entertainment System (NES)","Nintendo Entertainment System","NES"],[32,"Nintendo Famicom"],[33,"Nintendo Super Famicom"],[34,"Nintendo AV Famicom"],[35,"NEC PC Engine Duo-R","PC Engine Duo-R"],[36,"Commodore 64C"],[37,"Commodore SX-64"],[38,"Nintendo Switch"],[39,"Nintendo Wii U","Wii U"],[40,"Nintendo 64"],[41,"Xbox One","Microsoft Xbox One"],[42,"Xbox Series X","Microsoft Xbox Series X"],[43,"iMac G3","Apple iMac G3"],[44,"Apple IIe"],[45,"Apple Bandai Pippin","Apple Pippin","Bandai Pippin"],[46,"Vectrex"],[47,"Nintendo Game Boy","Game Boy"],[48,"Game Boy 'Play It Loud!'","Nintendo Play It Loud Game Boy","Nintendo Game Boy Play It Loud","Game Boy Play It Loud"],[49,"Game Boy Light","Nintendo Game Boy Light"],[50,"Nintendo Game Boy Pocket","Game Boy Pocket"],[51,"Game Boy Color","Nintendo Game Boy Color"],[52,"Game Boy Advance","Nintendo Game Boy Advance"],[53,"Game Boy Advance SP","Nintendo Game Boy Advance SP"],[54,"Game Boy Micro","Nintendo Game Boy Micro","Nintendo Game Boy micro"],[55,"Nintendo DS"],[56,"Nintendo DSi"],[57,"Nintendo DSi XL"],[58,"Nintendo DS Lite"],[59,"Nintendo 3DS"],[60,"Nintendo 3DS XL"],[61,"Nintendo 2DS"],[62,"Nintendo 2DS XL","New Nintendo 2DS XL"],[63,"Sega Game Gear"],[64,"Sega Genesis Nomad","Sega Nomad"],[65,"Atari Lynx II"],[66,"Sega Pico"],[67,"Sony PSP-1000","Sony PSP","PSP","PSP-1000","Sony PlayStation PSP 1000"],[68,"PSP-2000 (Slim & Lite)","PSP-2000","Sony PSP-2000","PSP Slim and Lite"],[69,"PSP-3000 (Brite)","PSP-3000","Sony PSP-3000"],[70,"Sony PSP Go","PSP Go"],[71,"PSP Street","Sony PSP Street","PSP E1000"],[72,"Sony PS Vita","PlayStation Vita","Sony PlayStation Vita","PS Vita"]];
  const key = value => String(value || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
  const byName = new Map();
  const byId = new Map();
  for (const [id, name, ...aliases] of records) {
    const image = Object.freeze({id, name, full:`assets/consoles/console-${String(id).padStart(2,"0")}.webp`, thumb:`assets/consoles/console-${String(id).padStart(2,"0")}-thumb.webp`});
    byId.set(id, image);
    for (const alias of [name, ...aliases]) {
      const previous = byName.get(key(alias));
      if (previous && previous.id !== id) throw new Error(`Ambiguous console image: ${alias}`);
      byName.set(key(alias), image);
    }
  }
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const find = name => byName.get(key(name)) || null;
  function thumbnail(name) {
    const image = find(name);
    if (!image) return "";
    return `<button type="button" class="console-thumbnail" data-console-image="${image.id}" data-console-label="${esc(name)}" aria-haspopup="dialog" aria-label="View ${esc(name)} image full screen">
      <img src="${image.thumb}" alt="${esc(image.name)} information poster" width="240" height="311" loading="lazy" decoding="async">
      <span>VIEW IMAGE</span></button>`;
  }
  function renderCard(item, wiki = true) {
    const thumb = thumbnail(item.name);
    return `<article class="system-card console-card${thumb ? " has-console-image" : ""}">${thumb}<div class="console-card-copy">
      <div class="system-card-heading"><strong>${esc(item.name)}</strong>${item.year ? `<span class="system-card-year">${esc(item.year)}</span>` : ""}</div>
      ${item.desc ? `<p>${esc(item.desc)}</p>` : ""}
      ${wiki ? `<button class="system-wiki-button" type="button" data-wiki-console="${esc(item.name)}" data-wiki-year="${esc(item.year || "")}" data-font-scale-max="1.75" aria-label="Read about ${esc(item.name)} on Wikipedia inside the app">READ WIKIPEDIA</button>` : ""}
      </div></article>`;
  }
  let modal, imageNode, stage, status, zoomButton, retryButton, returnFocus, activeImage;
  let zoomed = false, wasLocked = false;
  function setZoom(value) {
    zoomed = Boolean(value);
    modal.classList.toggle("console-zoomed", zoomed);
    zoomButton.textContent = zoomed ? "FIT TO SCREEN" : "ZOOM IN";
    zoomButton.setAttribute("aria-pressed", String(zoomed));
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }
  function loadImage() {
    status.hidden = false;
    status.textContent = "Loading image...";
    imageNode.hidden = true;
    zoomButton.disabled = true;
    retryButton.hidden = true;
    imageNode.src = activeImage.full;
  }
  function ensureViewer() {
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.id = "consoleImageViewer";
    modal.className = "console-image-viewer";
    modal.setAttribute("aria-labelledby", "consoleImageTitle");
    modal.innerHTML = `<header class="console-viewer-header"><div><small>RETRO GAMING ARCADE VAULT</small><h2 id="consoleImageTitle"></h2></div><button class="console-viewer-close" type="button" aria-label="Close console image" data-font-scale="locked" autofocus><span aria-hidden="true">&#215;</span></button></header>
      <div class="console-viewer-stage" tabindex="0" aria-label="Console image, scroll to explore when zoomed"><p class="console-viewer-status" role="status" aria-live="polite"></p><img class="console-full-image" alt="" decoding="async" hidden></div>
      <footer class="console-viewer-footer"><button type="button" class="console-viewer-zoom" aria-pressed="false">ZOOM IN</button><button type="button" class="console-viewer-retry" hidden>RETRY IMAGE</button><span>Close with the X or Escape.</span></footer>`;
    document.body.append(modal);
    imageNode = modal.querySelector(".console-full-image");
    stage = modal.querySelector(".console-viewer-stage");
    status = modal.querySelector(".console-viewer-status");
    zoomButton = modal.querySelector(".console-viewer-zoom");
    retryButton = modal.querySelector(".console-viewer-retry");
    modal.querySelector(".console-viewer-close").addEventListener("click", () => modal.close());
    zoomButton.addEventListener("click", () => setZoom(!zoomed));
    retryButton.addEventListener("click", loadImage);
    imageNode.addEventListener("load", () => {
      if (!modal.open) return;
      imageNode.hidden = false;
      status.hidden = true;
      zoomButton.disabled = false;
    });
    imageNode.addEventListener("error", () => {
      if (!modal.open) return;
      imageNode.hidden = true;
      status.hidden = false;
      status.textContent = "The image could not load. Check your connection and try again.";
      retryButton.hidden = false;
      zoomButton.disabled = true;
    });
    modal.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        modal.close();
      }
    });
    modal.addEventListener("cancel", event => { event.preventDefault(); modal.close(); });
    modal.addEventListener("click", event => {
      if (event.target === modal || event.target === stage) modal.close();
    });
    modal.addEventListener("close", () => {
      if (!wasLocked) document.documentElement.classList.remove("console-viewer-open");
      imageNode.removeAttribute("src");
      imageNode.hidden = true;
      if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
      returnFocus = null;
      activeImage = null;
    });
    return modal;
  }
  function open(id, label, trigger) {
    const image = byId.get(Number(id));
    if (!image) return;
    ensureViewer();
    if (modal.open) return;
    activeImage = image;
    returnFocus = trigger || document.activeElement;
    modal.querySelector("#consoleImageTitle").textContent = label || image.name;
    imageNode.alt = `${image.name} information poster`;
    setZoom(false);
    wasLocked = document.documentElement.classList.contains("console-viewer-open");
    document.documentElement.classList.add("console-viewer-open");
    modal.showModal();
    loadImage();
    modal.querySelector(".console-viewer-close").focus({preventScroll:true});
  }
  document.addEventListener("click", event => {
    const button = event.target.closest?.("[data-console-image]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    open(button.dataset.consoleImage, button.dataset.consoleLabel, button);
  });
  window.SFVCConsoleGallery = Object.freeze({find, thumbnail, renderCard, open});
})();
