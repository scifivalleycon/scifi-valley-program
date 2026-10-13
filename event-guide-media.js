/* Shared, escaped image/link blocks for the Event Guide modal and search results. */
(() => {
  "use strict";
  const escape = value => String(value ?? "").replace(/[&<>"']/g,
    char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  function safeUrl(value) {
    if (!String(value || "").trim()) return "";
    try {
      const url = new URL(String(value), location.href);
      if (url.username || url.password) return "";
      if (url.protocol !== "https:" && !(url.origin === location.origin && url.protocol === "http:")) return "";
      return url.href;
    } catch { return ""; }
  }
  function dimension(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 && number <= 12000 ? number : null;
  }
  function renderBlock(block) {
    if (!block || !["image", "link"].includes(block.type)) return null;
    if (block.type === "link") {
      const url = safeUrl(block.url);
      return url ? `<p class="event-guide-action-row"><a class="event-guide-action" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(block.text || "Open link")}</a></p>` : "";
    }
    const url = safeUrl(block.src);
    if (!url) return "";
    const width = dimension(block.width), height = dimension(block.height);
    const size = width && height ? ` width="${width}" height="${height}"` : "";
    const label = block.alt || "Event information banner";
    const image = `<img src="${escape(url)}" alt="${escape(label)}"${size} loading="lazy" decoding="async">`;
    const content = block.clickable === false ? image : `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(`Open ${label} in a new tab`)}">${image}</a>`;
    return `<figure class="event-guide-banner">${content}${block.caption ? `<figcaption>${escape(block.caption)}</figcaption>` : ""}</figure>`;
  }
  window.SFVCEventMedia = Object.freeze({renderBlock});
})();
