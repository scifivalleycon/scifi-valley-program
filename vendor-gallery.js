/* Browse submitted vendor photos without changing any vendor/profile data. */
(() => {
  "use strict";
  const collator = new Intl.Collator("en", {numeric:true, sensitivity:"base"});
  const text = value => typeof value === "string" ? value.trim() : "";
  let items = [], index = 0, signature = "", published = false;
  let modal, stage, image, status, retry, details, opener, savedScroll;
  let loadNumber = 0, touchStart = null;
  const launcher = document.getElementById("openVendorGallery");
  const launchSection = document.getElementById("vendorGalleryLaunch");
  const summary = document.getElementById("vendorGallerySummary");

  function imageUrl(value) {
    if (!text(value)) return "";
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
    } catch { return ""; }
  }

  function tableKey(value) {
    // Sort a multi-table vendor by its earliest table, including A10-A12/A3-1.
    // Only examine endpoints, never allocate a potentially huge table range.
    const raw = text(value).replace(/[\u2013\u2014]/g, "-");
    const codes = [];
    const re = /([a-z]+)\s*(\d+)(?:\s*-\s*([a-z]+)?(\d+))?/gi;
    for (const match of raw.matchAll(re)) {
      codes.push(match[1].toUpperCase() + Number(match[2]));
      if (match[4]) codes.push((match[3] || match[1]).toUpperCase() + Number(match[4]));
    }
    return codes.sort(collator.compare)[0] || "";
  }

  function buildItems(vendors) {
    const sorted = (Array.isArray(vendors) ? vendors : []).filter(v => v && typeof v === "object")
      .map((vendor, originalIndex) => ({vendor, originalIndex, table:tableKey(vendor.location)}))
      .sort((a, b) => Number(!a.table) - Number(!b.table) || collator.compare(a.table, b.table)
        || collator.compare(text(a.vendor.name), text(b.vendor.name)) || a.originalIndex - b.originalIndex);
    const result = [];
    for (const {vendor} of sorted) {
      const name = text(vendor.name) || "Vendor";
      const table = text(vendor.location);
      const description = text(vendor.description) || text(vendor.categories);
      const vendorKey = String(vendor.id || `${name}|${table}`);
      const photos = (Array.isArray(vendor.photos) ? vendor.photos : [])
        .map(photo => ({photo, src:imageUrl(photo?.url)})).filter(photo => photo.src);
      photos.forEach(({photo, src}, photoIndex) => result.push({
        key:JSON.stringify([vendorKey, String(photo.id || src)]), vendorKey, src, name, table, description,
        photoIndex:photoIndex + 1, photoCount:photos.length
      }));
    }
    return result;
  }

  function update(vendors, options = {}) {
    published = options.published === true;
    const next = published ? buildItems(vendors) : [];
    const nextSignature = JSON.stringify(next);
    if (launchSection) launchSection.hidden = !published;
    if (launcher) launcher.disabled = !next.length;
    if (summary) {
      const count = new Set(next.map(item => item.vendorKey)).size;
      summary.textContent = next.length
        ? `${next.length} photo${next.length === 1 ? "" : "s"} from ${count} vendor${count === 1 ? "" : "s"}. Browse in table order.`
        : "No vendor photos have been submitted yet.";
    }
    if (nextSignature === signature) return;
    signature = nextSignature;
    const previous = items[index];
    items = next;
    if (!modal?.open) return;
    if (!items.length) { modal.close(); return; }
    // Live profile refreshes retain the current photo instead of jumping to A1.
    const retained = previous ? items.findIndex(item => item.key === previous.key) : -1;
    index = retained >= 0 ? retained : Math.min(index, items.length - 1);
    render(previous?.src !== items[index].src);
  }

  function loadPhoto() {
    const item = items[index];
    if (!item || !modal?.open) return;
    const currentLoad = ++loadNumber;
    image?.remove();
    status.hidden = false;
    status.textContent = "Loading vendor photo...";
    retry.hidden = true;
    image = new Image();
    image.className = "vendor-gallery-image";
    image.alt = `${item.name}${item.table ? ", table " + item.table : ""}, photo ${item.photoIndex} of ${item.photoCount}`;
    image.decoding = "async";
    image.draggable = false;
    image.hidden = true;
    const requestedImage = image;
    const fail = () => {
      if (currentLoad !== loadNumber || !modal.open) return;
      requestedImage.hidden = true;
      status.hidden = false;
      status.textContent = "This photo could not load. Try again or use the arrows to continue.";
      retry.hidden = false;
    };
    requestedImage.onload = () => {
      if (currentLoad !== loadNumber || !modal.open) return;
      if (!requestedImage.naturalWidth) { fail(); return; }
      requestedImage.hidden = false;
      status.hidden = true;
      retry.hidden = true;
    };
    requestedImage.onerror = fail;
    stage.prepend(requestedImage);
    // Only the selected image loads. No new gallery-wide image download.
    requestedImage.src = item.src;
  }

  function render(reload = true) {
    const item = items[index];
    if (!item || !modal) return;
    modal.querySelector("#vendorGalleryName").textContent = item.name;
    modal.querySelector("#vendorGalleryTable").textContent = item.table ? `TABLE / BOOTH: ${item.table}` : "TABLE NOT LISTED";
    modal.querySelector("#vendorGalleryDescription").textContent = item.description || "No description has been added to this profile.";
    modal.querySelector("#vendorGalleryVendorCount").textContent = `Photo ${item.photoIndex} of ${item.photoCount} from this vendor`;
    modal.querySelector("#vendorGalleryProgress").textContent = `${index + 1} / ${items.length}`;
    modal.querySelector("#vendorGalleryAnnouncement").textContent = `${item.name}${item.table ? ", table " + item.table : ""}. Photo ${index + 1} of ${items.length}.`;
    modal.querySelectorAll("[data-vendor-gallery-step]").forEach(button => { button.disabled = items.length < 2; });
    if (image) image.alt = `${item.name}${item.table ? ", table " + item.table : ""}, photo ${item.photoIndex} of ${item.photoCount}`;
    if (reload) { details.scrollTop = 0; loadPhoto(); }
  }

  function step(direction) {
    if (!modal?.open || items.length < 2) return;
    index = (index + direction + items.length) % items.length;
    render();
  }

  function ensureViewer() {
    if (modal) return;
    modal = document.createElement("dialog");
    modal.id = "vendorPhotoGallery";
    modal.className = "vendor-photo-gallery";
    modal.setAttribute("aria-labelledby", "vendorGalleryTitle");
    modal.innerHTML = `<header class="vendor-gallery-header">
      <div><span>EXPLORE THE EXHIBIT FLOOR</span><strong id="vendorGalleryTitle">VENDOR PHOTO GALLERY</strong></div>
      <button class="vendor-gallery-close" type="button" aria-label="Close vendor photo gallery" data-font-scale="locked" autofocus><span aria-hidden="true">&#215;</span></button>
      </header>
      <div class="vendor-gallery-stage">
        <div class="vendor-gallery-message"><p class="vendor-gallery-status" role="status"></p><button class="vendor-gallery-retry" type="button" hidden>TRY AGAIN</button></div>
        <button class="vendor-gallery-arrow vendor-gallery-previous" type="button" data-vendor-gallery-step="-1" data-font-scale="locked" aria-label="Previous vendor photo"><span aria-hidden="true">&#10094;</span></button>
        <button class="vendor-gallery-arrow vendor-gallery-next" type="button" data-vendor-gallery-step="1" data-font-scale="locked" aria-label="Next vendor photo"><span aria-hidden="true">&#10095;</span></button>
      </div>
      <section class="vendor-gallery-details" tabindex="0" aria-label="Vendor name, table and description">
        <p id="vendorGalleryTable"></p><h2 id="vendorGalleryName"></h2><p id="vendorGalleryDescription"></p><small id="vendorGalleryVendorCount"></small>
      </section>
      <footer class="vendor-gallery-footer"><span>TABLE ORDER <span aria-hidden="true">&#8226;</span> LOOPS BACK TO START</span><b id="vendorGalleryProgress"></b></footer>
      <div id="vendorGalleryAnnouncement" class="sr-only" aria-live="polite" aria-atomic="true"></div>`;
    document.body.append(modal);
    stage = modal.querySelector(".vendor-gallery-stage");
    status = modal.querySelector(".vendor-gallery-status");
    retry = modal.querySelector(".vendor-gallery-retry");
    details = modal.querySelector(".vendor-gallery-details");
    modal.querySelector(".vendor-gallery-close").addEventListener("click", () => modal.close());
    modal.querySelectorAll("[data-vendor-gallery-step]").forEach(button => {
      button.addEventListener("click", () => step(Number(button.dataset.vendorGalleryStep)));
    });
    retry.addEventListener("click", loadPhoto);
    modal.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); modal.close(); }
      if (["ArrowLeft", "ArrowRight"].includes(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault(); event.stopPropagation(); step(event.key === "ArrowLeft" ? -1 : 1);
      }
    });
    modal.addEventListener("cancel", event => { event.preventDefault(); modal.close(); });
    stage.addEventListener("touchstart", event => {
      touchStart = event.touches.length === 1 && !event.target.closest("button")
        ? {x:event.touches[0].clientX, y:event.touches[0].clientY} : null;
    }, {passive:true});
    stage.addEventListener("touchend", event => {
      const start = touchStart; touchStart = null;
      if (!start || event.touches.length || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, {passive:true});
    stage.addEventListener("touchcancel", () => { touchStart = null; }, {passive:true});
    modal.addEventListener("close", () => {
      // Ignore a queued close event if the viewer has already reopened.
      if (modal.open) return;
      ++loadNumber;
      image?.remove(); image = null; touchStart = null;
      document.documentElement.classList.remove("vendor-gallery-open");
      if (opener?.isConnected && !opener.disabled) opener.focus({preventScroll:true});
      if (savedScroll) window.scrollTo({left:savedScroll.x, top:savedScroll.y, behavior:"instant"});
      opener = null; savedScroll = null;
    });
  }

  function open(trigger = launcher) {
    if (!published || !items.length) return;
    ensureViewer();
    if (modal.open) return;
    index = 0;
    opener = trigger || document.activeElement;
    savedScroll = {x:window.scrollX, y:window.scrollY};
    document.documentElement.classList.add("vendor-gallery-open");
    modal.showModal();
    render();
    modal.querySelector(".vendor-gallery-close").focus({preventScroll:true});
  }
  launcher?.addEventListener("click", () => open(launcher));
  window.SFVCVendorGallery = Object.freeze({update, open, buildItems});
})();
