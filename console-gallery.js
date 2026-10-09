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
  let zoomed = false, wasLocked = false, gallery = [], galleryIndex = 0, loadNumber = 0;

  function buildNavigation(trigger) {
    const entries = [], seen = new Set();
    const add = (image, label) => {
      if (!image || seen.has(image.id)) return;
      seen.add(image.id);
      entries.push({image, label:label || image.name});
    };
    // Follow the console list that the visitor opened, across every decade.
    // Deduplicate aliases and append any posters not present in that renderer.
    const scope = trigger?.closest?.(".event-content")
      || document.querySelector("#eventModal[open] .event-content");
    scope?.querySelectorAll("[data-console-image]").forEach(button => {
      add(byId.get(Number(button.dataset.consoleImage)), button.dataset.consoleLabel);
    });
    for (const image of byId.values()) add(image);
    return entries;
  }

  function setZoom(value) {
    zoomed = Boolean(value);
    modal.classList.toggle("console-zoomed", zoomed);
    zoomButton.textContent = zoomed ? "FIT TO SCREEN" : "ZOOM IN";
    zoomButton.setAttribute("aria-pressed", String(zoomed));
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }

  function loadImage() {
    if (!activeImage || !modal?.open) return;
    const currentLoad = ++loadNumber;
    imageNode?.remove();
    status.hidden = false;
    status.textContent = "Loading image...";
    zoomButton.disabled = true;
    retryButton.hidden = true;
    // Each selection has its own image and token so rapid arrow clicks cannot
    // display an older image or error underneath the next console's title.
    const requestedImage = new Image();
    imageNode = requestedImage;
    requestedImage.className = "console-full-image";
    requestedImage.alt = `${activeImage.name} information poster`;
    requestedImage.decoding = "async";
    requestedImage.hidden = true;
    const fail = () => {
      if (currentLoad !== loadNumber || !modal.open) return;
      requestedImage.hidden = true;
      status.hidden = false;
      status.textContent = "The image could not load. Retry or use the arrows to continue.";
      retryButton.hidden = false;
      zoomButton.disabled = true;
    };
    requestedImage.onload = () => {
      if (currentLoad !== loadNumber || !modal.open) return;
      if (!requestedImage.naturalWidth) { fail(); return; }
      requestedImage.hidden = false;
      status.hidden = true;
      retryButton.hidden = true;
      zoomButton.disabled = false;
    };
    requestedImage.onerror = fail;
    stage.append(requestedImage);
    // Do not download the other full-size posters until they are selected.
    requestedImage.src = activeImage.full;
  }

  function showCurrent() {
    const entry = gallery[galleryIndex];
    if (!entry) return;
    activeImage = entry.image;
    modal.querySelector("#consoleImageTitle").textContent = entry.label;
    const progress = modal.querySelector("#consoleImageProgress");
    progress.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    progress.setAttribute("aria-label", `${entry.label}, image ${galleryIndex + 1} of ${gallery.length}`);
    modal.querySelectorAll("[data-console-step]").forEach(button => {
      const direction = Number(button.dataset.consoleStep);
      const target = gallery[(galleryIndex + direction + gallery.length) % gallery.length];
      button.disabled = gallery.length < 2;
      button.setAttribute("aria-label", `${direction < 0 ? "Previous" : "Next"} console image: ${target.label}`);
    });
    setZoom(false);
    loadImage();
  }

  function step(direction) {
    if (!modal?.open || gallery.length < 2) return;
    galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
    showCurrent();
  }

  function cleanupViewer() {
    if (modal?.open || !activeImage) return;
    ++loadNumber;
    if (!wasLocked) document.documentElement.classList.remove("console-viewer-open");
    imageNode?.remove();
    imageNode = null;
    activeImage = null;
    gallery = [];
    galleryIndex = 0;
    const trigger = returnFocus;
    returnFocus = null;
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
  }

  function closeViewer() {
    if (!modal?.open) return;
    modal.close();
    // Clean up synchronously; a queued native close event must not clear a
    // newly reopened viewer or leave its document scroll lock behind.
    cleanupViewer();
  }

  function ensureViewer() {
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.id = "consoleImageViewer";
    modal.className = "console-image-viewer";
    modal.setAttribute("aria-labelledby", "consoleImageTitle");
    modal.innerHTML = `<header class="console-viewer-header"><div><small>RETRO GAMING ARCADE VAULT</small><h2 id="consoleImageTitle"></h2></div><button class="console-viewer-close" type="button" aria-label="Close console image" data-font-scale="locked" autofocus><span aria-hidden="true">&#215;</span></button></header>
      <div class="console-viewer-body">
        <div class="console-viewer-stage" tabindex="0" aria-label="Console image, scroll to explore when zoomed"><p class="console-viewer-status" role="status" aria-live="polite"></p></div>
        <button class="console-viewer-arrow console-viewer-previous" type="button" data-console-step="-1" data-font-scale="locked" aria-label="Previous console image" aria-controls="consoleImageTitle"><span aria-hidden="true">&#10094;</span></button>
        <button class="console-viewer-arrow console-viewer-next" type="button" data-console-step="1" data-font-scale="locked" aria-label="Next console image" aria-controls="consoleImageTitle"><span aria-hidden="true">&#10095;</span></button>
      </div>
      <footer class="console-viewer-footer"><button type="button" class="console-viewer-zoom" aria-pressed="false">ZOOM IN</button><button type="button" class="console-viewer-retry" hidden>RETRY IMAGE</button><span id="consoleImageProgress" class="console-viewer-progress" role="status" aria-live="polite" aria-atomic="true" data-font-scale="locked"></span><span class="console-viewer-hint">Use side arrows to browse. X or Escape to close.</span></footer>`;
    document.body.append(modal);
    stage = modal.querySelector(".console-viewer-stage");
    status = modal.querySelector(".console-viewer-status");
    zoomButton = modal.querySelector(".console-viewer-zoom");
    retryButton = modal.querySelector(".console-viewer-retry");
    modal.querySelector(".console-viewer-close").addEventListener("click", closeViewer);
    modal.querySelectorAll("[data-console-step]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        step(Number(button.dataset.consoleStep));
      });
    });
    zoomButton.addEventListener("click", () => setZoom(!zoomed));
    retryButton.addEventListener("click", loadImage);
    modal.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeViewer();
        return;
      }
      if (["ArrowLeft", "ArrowRight"].includes(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // Preserve keyboard panning when a zoomed image's scroll area is focused.
        if (zoomed && event.target === stage) return;
        event.preventDefault();
        event.stopPropagation();
        step(event.key === "ArrowLeft" ? -1 : 1);
      }
    });
    modal.addEventListener("cancel", event => { event.preventDefault(); closeViewer(); });
    modal.addEventListener("click", event => {
      if (event.target === modal || event.target === stage) closeViewer();
    });
    modal.addEventListener("close", cleanupViewer);
    return modal;
  }

  function open(id, label, trigger) {
    const selectedImage = byId.get(Number(id));
    if (!selectedImage) return;
    ensureViewer();
    if (modal.open) return;
    // An external caller may have closed the native dialog just before reopening.
    cleanupViewer();
    gallery = buildNavigation(trigger);
    galleryIndex = gallery.findIndex(entry => entry.image.id === selectedImage.id);
    if (galleryIndex < 0) return;
    if (label) gallery[galleryIndex].label = label;
    returnFocus = trigger || document.activeElement;
    wasLocked = document.documentElement.classList.contains("console-viewer-open");
    document.documentElement.classList.add("console-viewer-open");
    modal.showModal();
    showCurrent();
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
