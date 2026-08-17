(() => {
  "use strict";

  const STORE_ID = "60212851";
  const CATEGORY_ID = "118538756";
  const OFFICIAL_CATEGORY_URL = "https://www.cryptoteeology.com/shop/Sci-fi-Valley-Con-Shirts-c118538756";
  const SCRIPT_ID = "sfvc-ecwid-script";

  let initPromise = null;
  let initialized = false;

  function status(text, kind="loading") {
    const el = document.getElementById("sfvcEcwidStoreStatus");
    if (!el) return;
    el.textContent = text;
    el.dataset.kind = kind;
  }

  function showFallback(message) {
    status(message || "THE LIVE CATALOG COULD NOT LOAD.", "warning");
    document.getElementById("sfvcEcwidFallback")?.classList.remove("hidden");
  }

  function waitForEcwid(timeoutMs=15000) {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (typeof window.xProductBrowser === "function") {
          clearInterval(timer);
          resolve();
          return;
        }
        if (Date.now() - started > timeoutMs) {
          clearInterval(timer);
          reject(new Error("Ecwid storefront timed out."));
        }
      }, 100);
    });
  }

  async function loadEcwidScript() {
    if (typeof window.xProductBrowser === "function") return;
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      await waitForEcwid();
      return;
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.charset = "utf-8";
      script.type = "text/javascript";
      script.src = `https://app.ecwid.com/script.js?${STORE_ID}&data_platform=code`;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Ecwid storefront script failed to load."));
      document.body.appendChild(script);
    });

    await waitForEcwid();
  }

  async function initializeStore() {
    if (initialized) return true;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        status("CONNECTING TO THE OFFICIAL CRYPTOTEEOLOGY CATALOG…");

        // Wait one animation frame so the T-shirt screen has a real width.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await loadEcwidScript();

        const host = document.getElementById("sfvc-live-tshirt-store");
        if (!host) throw new Error("T-shirt store container is missing.");

        host.innerHTML = "";

        window.xProductBrowser(
          `id=sfvc-live-tshirt-store`,
          `defaultCategoryId=${CATEGORY_ID}`,
          "views=grid(60,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list"
        );

        // Keep cart/checkout connected to the merchant's official store.
        if (window.Ecwid && typeof window.Ecwid.setStorefrontBaseUrl === "function") {
          window.Ecwid.setStorefrontBaseUrl("https://www.cryptoteeology.com/shop");
        }

        initialized = true;
        status("LIVE OFFICIAL CATALOG • PRODUCT PHOTOS & PRICES FROM CRYPTOTEEOLOGY", "ready");
        document.getElementById("sfvcEcwidFallback")?.classList.add("hidden");
        return true;
      } catch (err) {
        console.error("SFVC live T-shirt store failed", err);
        showFallback("THE LIVE CATALOG COULD NOT LOAD INSIDE THE APP.");
        return false;
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  }

  function tshirtScreenIsVisible() {
    const screen = document.getElementById("tshirts");
    return Boolean(screen && screen.classList.contains("active"));
  }

  // Initialize when the attendee taps OFFICIAL T-SHIRTS.
  document.addEventListener("click", event => {
    const trigger = event.target.closest?.('[data-go="tshirts"]');
    if (!trigger) return;
    setTimeout(initializeStore, 40);
  }, true);

  // Also cover history/navigation changes where the screen becomes active without a click.
  const observer = new MutationObserver(() => {
    if (tshirtScreenIsVisible()) initializeStore();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("tshirts");
    if (screen) observer.observe(screen, { attributes:true, attributeFilter:["class"] });
    if (tshirtScreenIsVisible()) initializeStore();

    // If external scripts are blocked, show a useful fallback instead of a permanent loader.
    setTimeout(() => {
      if (!initialized && tshirtScreenIsVisible()) {
        const host = document.getElementById("sfvc-live-tshirt-store");
        if (!host?.children?.length) {
          showFallback("THE LIVE CATALOG IS TAKING LONGER THAN EXPECTED.");
        }
      }
    }, 18000);
  });

  // Keep a public hook for debugging/retry.
  window.SFVC_TSHIRTS = {
    load: initializeStore,
    officialStore: OFFICIAL_CATEGORY_URL,
    storeId: STORE_ID,
    categoryId: CATEGORY_ID
  };
})();
