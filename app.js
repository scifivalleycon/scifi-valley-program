const state = {
  guests: [],
  schedule: [],
  vendors: [],
  guestFilter: "All",
  dayFilter: "Friday",
  favorites: new Set(JSON.parse(localStorage.getItem("sfvc-favorites") || "[]"))
};

const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll(".nav-button")];

function goTo(screenId) {
  screens.forEach(s => s.classList.toggle("active", s.id === screenId));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.screen === screenId));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach(button => button.addEventListener("click", () => goTo(button.dataset.screen)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => goTo(button.dataset.go)));

async function loadData() {
  const [guests, schedule, vendors] = await Promise.all([
    fetch("data/guests.json").then(r => r.json()),
    fetch("data/schedule.json").then(r => r.json()),
    fetch("data/vendors.json").then(r => r.json())
  ]);
  state.guests = guests;
  state.schedule = schedule;
  state.vendors = vendors;
  renderAll();
}

function initials(name) {
  return name.split(" ").map(x => x[0]).slice(0, 2).join("");
}

function renderGuestFilters() {
  const filters = ["All", ...new Set(state.guests.map(g => g.reunion))];
  const container = document.getElementById("guestFilters");
  container.innerHTML = filters.map(filter => `
    <button class="chip ${filter === state.guestFilter ? "active" : ""}" data-guest-filter="${filter}">
      ${filter}
    </button>`).join("");
  container.querySelectorAll("[data-guest-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.guestFilter = btn.dataset.guestFilter;
      renderGuestFilters();
      renderGuests();
    });
  });
}

function renderGuests() {
  const q = document.getElementById("guestSearch").value.trim().toLowerCase();
  const guests = state.guests.filter(g => {
    const matchesFilter = state.guestFilter === "All" || g.reunion === state.guestFilter;
    const haystack = `${g.name} ${g.reunion} ${g.character} ${g.credits}`.toLowerCase();
    return matchesFilter && haystack.includes(q);
  });

  document.getElementById("guestList").innerHTML = guests.map(g => `
    <article class="guest-card">
      <div class="guest-photo" aria-label="${g.name} photo placeholder">${initials(g.name)}</div>
      <div>
        <div class="guest-topline">
          <div>
            <span class="tag">${g.reunion}</span>
            <h3>${g.name}</h3>
          </div>
          <button class="favorite ${state.favorites.has(g.id) ? "saved" : ""}" data-favorite="${g.id}" aria-label="Save ${g.name}">
            ${state.favorites.has(g.id) ? "♥" : "♡"}
          </button>
        </div>
        <div class="guest-sub">${g.character}<br>${g.credits}</div>
        <div class="price-row">
          <span class="price">Auto ${g.prices.autograph}</span>
          <span class="price">Selfie ${g.prices.selfie}</span>
          <span class="price">Combo ${g.prices.combo}</span>
        </div>
      </div>
    </article>
  `).join("") || `<div class="panel muted-empty">No guests match that search.</div>`;

  document.querySelectorAll("[data-favorite]").forEach(btn => {
    btn.addEventListener("click", () => toggleFavorite(btn.dataset.favorite));
  });
}

function toggleFavorite(id) {
  state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
  localStorage.setItem("sfvc-favorites", JSON.stringify([...state.favorites]));
  renderGuests();
  renderFavorites();
}

function renderFavorites() {
  const guests = state.guests.filter(g => state.favorites.has(g.id));
  document.getElementById("favoriteCount").textContent = `${guests.length} saved`;
  const container = document.getElementById("favoritePreview");
  if (!guests.length) {
    container.className = "stack muted-empty";
    container.innerHTML = "Tap ♡ on a guest to save them here.";
    return;
  }
  container.className = "stack";
  container.innerHTML = guests.slice(0, 4).map(g => `
    <div class="status-card">
      <strong>${g.name}</strong>
      <div class="meta">${g.reunion} • ${g.table || "Table TBA"}</div>
    </div>`).join("");
}

function renderDayFilters() {
  const days = ["Friday", "Saturday", "Sunday"];
  const container = document.getElementById("dayFilters");
  container.innerHTML = days.map(day => `
    <button class="chip ${day === state.dayFilter ? "active" : ""}" data-day="${day}">${day}</button>
  `).join("");
  container.querySelectorAll("[data-day]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.dayFilter = btn.dataset.day;
      renderDayFilters();
      renderSchedule();
    });
  });
}

function renderSchedule() {
  const events = state.schedule.filter(e => e.day === state.dayFilter);
  document.getElementById("scheduleList").innerHTML = events.map(e => `
    <article class="schedule-card">
      <div class="schedule-time">${e.time}</div>
      <div>
        <strong>${e.title}</strong>
        <div class="meta">${e.location} • ${e.category}</div>
      </div>
    </article>`).join("");
}

function renderStatus() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const eventDates = {
    "2026-10-16": "Friday",
    "2026-10-17": "Saturday",
    "2026-10-18": "Sunday"
  };
  const key = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const container = document.getElementById("happeningNow");

  if (!eventDates[key]) {
    document.getElementById("nowHeading").textContent = "Coming October 16–18";
    container.innerHTML = `
      <div class="status-card">
        <strong>Fall 2026 Digital Program</strong>
        <div class="meta">This area will automatically show what is happening during the convention.</div>
      </div>`;
    return;
  }

  const today = eventDates[key];
  const items = state.schedule.filter(e => e.day === today).slice(0, 3);
  document.getElementById("nowHeading").textContent = `Today • ${today}`;
  container.innerHTML = items.map(e => `
    <div class="status-card">
      <strong>${e.time} • ${e.title}</strong>
      <div class="meta">${e.location}</div>
    </div>`).join("");
}

function renderVendors() {
  const q = document.getElementById("vendorSearch").value.trim().toLowerCase();
  const vendors = state.vendors.filter(v => `${v.name} ${v.categories} ${v.location}`.toLowerCase().includes(q));
  document.getElementById("vendorList").innerHTML = vendors.map(v => `
    <div class="vendor-card">
      <strong>${v.name}</strong>
      <div class="meta">${v.categories} • ${v.location}</div>
    </div>`).join("") || `<div class="muted-empty">No vendors match that search.</div>`;
}

function renderAll() {
  renderGuestFilters();
  renderGuests();
  renderFavorites();
  renderDayFilters();
  renderSchedule();
  renderStatus();
  renderVendors();
}

document.getElementById("guestSearch").addEventListener("input", renderGuests);
document.getElementById("vendorSearch").addEventListener("input", renderVendors);
document.getElementById("vendorButton").addEventListener("click", () => {
  document.getElementById("vendorSection").classList.toggle("hidden");
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  document.getElementById("installButton").hidden = false;
});

document.getElementById("installButton").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById("installButton").hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}

loadData().catch(err => {
  console.error(err);
  document.getElementById("happeningNow").innerHTML =
    `<div class="status-card"><strong>App data could not load.</strong><div class="meta">If you opened these files directly from your computer, publish them to a web server first.</div></div>`;
});
