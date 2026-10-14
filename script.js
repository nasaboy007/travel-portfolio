/* script.js — the engine. You normally don't edit this file; edit data.js instead.
   1 Helpers · 2 Theme toggle · 3 Home page (stats, map, trips) · 4 Destination page · 5 Start-up */

/* ---------- 1. HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const fmt = (ym) => new Date(+ym.slice(0, 4), +ym.slice(5, 7) - 1).toLocaleDateString("en", { month: "long", year: "numeric" }); // "2025-03" -> "March 2025"
const regionsOf = () => [...new Set(DESTINATIONS.map((d) => d.region))];
const count = (region) => DESTINATIONS.filter((d) => d.region === region).length;
// A photo that degrades gracefully: if the file is missing, the box shows the destination name on a gradient.
const photo = (d, file, alt) =>
  `<figure class="ph" data-label="${d.name}"><img src="images/${d.id}/${file}" alt="${alt}" loading="lazy" onerror="this.parentNode.classList.add('none');this.remove()"></figure>`;

/* ---------- 2. DARK / LIGHT TOGGLE ---------- */
const root = document.documentElement;
const themeBtn = $("#theme");
const syncTheme = () => themeBtn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.theme = root.dataset.theme; } catch (e) {} // remember the choice
  syncTheme();
  window.dispatchEvent(new Event("themechange")); // the map listens for this to swap its tiles
});
syncTheme();

/* ---------- 3a. HOME: TRAVEL STATS ---------- */
function renderStats() {
  const total = 193; // countries recognised by the UN
  const seen = WONDERS.filter((w) => DESTINATIONS.some((d) => d.wonder === w));
  const regions = regionsOf();
  const shade = (i) => (1 - i * 0.18).toFixed(2); // each continent gets a lighter tint
  $("#statsBox").innerHTML = `
    <article class="stat">
      <p class="num">${DESTINATIONS.length}<small>/${total}</small></p>
      <h3>Countries</h3>
      <div class="dots" role="img" aria-label="${DESTINATIONS.length} of ${total} countries visited">
        ${Array.from({ length: total }, (_, i) => `<i class="${i < DESTINATIONS.length ? "on" : ""}"></i>`).join("")}
      </div>
    </article>
    <article class="stat">
      <p class="num">${seen.length}<small>/${WONDERS.length}</small></p>
      <h3>World wonders</h3>
      <ul class="wonders">${WONDERS.map((w) => `<li class="${seen.includes(w) ? "on" : ""}">${w}</li>`).join("")}</ul>
    </article>
    <article class="stat">
      <p class="num">${regions.length}</p>
      <h3>Continents</h3>
      <div class="seg" role="img" aria-label="Countries per continent">${regions.map((r, i) => `<i style="flex:${count(r)};--o:${shade(i)}"></i>`).join("")}</div>
      <ul class="regions">${regions.map((r, i) => `<li style="--o:${shade(i)}">${r}<b>${count(r)}</b></li>`).join("")}</ul>
    </article>`;
}

/* ---------- 3b. HOME: INTERACTIVE MAP (Leaflet) ---------- */
const GEO_URL = "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json"; // country outlines, keyed by 3-letter code

function renderMap() {
  const box = $("#mapBox");
  if (!window.L) { box.innerHTML = '<p class="note">The map could not load. Use the trips below instead.</p>'; return; }

  const tileUrl = () => `https://{s}.basemaps.cartocdn.com/${root.dataset.theme === "dark" ? "dark" : "light"}_all/{z}/{x}/{y}{r}.png`;
  const map = L.map(box, { minZoom: 1, scrollWheelZoom: false, dragging: !L.Browser.mobile }); // on phones one finger scrolls the page
  const tiles = L.tileLayer(tileUrl(), {
    subdomains: "abcd", maxZoom: 10,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);
  window.addEventListener("themechange", () => tiles.setUrl(tileUrl())); // light/dark map follows the theme

  const open = (d) => () => (location.href = `destination.html?id=${d.id}`);

  // A pin for every destination (also covers tiny countries whose outline is too small to click)
  DESTINATIONS.forEach((d) => L.circleMarker(d.ll, { className: "pin", radius: 6 }).bindTooltip(d.name).on("click", open(d)).addTo(map));
  map.fitBounds(DESTINATIONS.map((d) => d.ll), { padding: [40, 40] });

  // Highlight the visited countries. If the outlines can't load, the pins still work.
  const byIso = Object.fromEntries(DESTINATIONS.map((d) => [d.iso, d]));
  fetch(GEO_URL)
    .then((r) => r.json())
    .then((geo) => {
      L.geoJSON(geo, {
        filter: (f) => byIso[f.id],
        style: () => ({ className: "country", weight: 1 }),
        onEachFeature: (f, layer) => layer.bindTooltip(byIso[f.id].name, { sticky: true }).on("click", open(byIso[f.id])),
      }).addTo(map).bringToBack(); // keep pins on top of the highlights
    })
    .catch(() => {});
}

/* ---------- 3c. HOME: TRIPS GRID + FILTERS ---------- */
function renderTrips() {
  const newestFirst = [...DESTINATIONS].sort((a, b) => b.date.localeCompare(a.date));
  $("#grid").innerHTML = newestFirst.map((d) => `
    <a class="trip" href="destination.html?id=${d.id}" data-region="${d.region}" data-wonder="${d.wonder ? 1 : 0}">
      ${photo(d, "cover.jpg", d.name + " cover photo")}
      <h3>${d.name}</h3>
      <p>${fmt(d.date)}${d.wonder ? `<span class="tag">${d.wonder}</span>` : ""}</p>
    </a>`).join("");

  // One button per continent (pick one) plus a World wonders toggle; the two combine.
  const filters = { region: "All", wonders: false };
  $("#filters").innerHTML =
    ["All", ...regionsOf()].map((r) => `<button class="chip" type="button" data-region="${r}" aria-pressed="${r === "All"}">${r}</button>`).join("") +
    `<button class="chip" type="button" data-wonders aria-pressed="false">World wonders</button>`;

  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    if (btn.hasAttribute("data-wonders")) filters.wonders = !filters.wonders;
    else filters.region = btn.dataset.region;
    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", c.hasAttribute("data-wonders") ? filters.wonders : c.dataset.region === filters.region));
    let shown = 0;
    $$(".trip").forEach((t) => {
      t.hidden = !((filters.region === "All" || t.dataset.region === filters.region) && (!filters.wonders || t.dataset.wonder === "1"));
      shown += !t.hidden;
    });
    $("#empty").hidden = shown > 0;
  });
}

/* ---------- 4. DESTINATION PAGE (destination.html?id=italy) ---------- */
function renderDestination() {
  const d = DESTINATIONS.find((x) => x.id === new URLSearchParams(location.search).get("id"));
  const box = $("#dest");
  if (!d) {
    box.innerHTML = `<h1>Trip not found</h1><p class="tagline">Check the link, or <a href="index.html#trips">go back to all trips</a>.</p>`;
    return;
  }
  document.title = `${d.name} – Sumanth's travels`;

  const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  const block = (title, body) => (body ? `<section class="block"><h2>${title}</h2><div>${body}</div></section>` : ""); // empty sections are skipped
  const slides = Array.from({ length: d.photos || 4 }, (_, i) =>
    `<div class="swiper-slide">${photo(d, `${i + 1}.jpg`, `${d.name} photo ${i + 1}`)}</div>`).join("");

  box.innerHTML = `
    <a class="back" href="index.html#trips">Back to travels</a>
    <h1>${d.name}</h1>
    ${d.tagline ? `<p class="tagline">${d.tagline}</p>` : ""}
    <p class="meta">${d.region}, ${fmt(d.date)}${d.wonder ? `<span class="tag">${d.wonder}</span>` : ""}</p>
    <div class="swiper" role="region" aria-label="Photos from ${d.name}">
      <div class="swiper-wrapper">${slides}</div>
      <div class="swiper-button-prev"></div><div class="swiper-button-next"></div>
      <div class="swiper-pagination"></div>
    </div>
    ${block("Highlights", d.highlights && list(d.highlights))}
    ${block("Favorite memory", d.memory && `<p class="memory">${d.memory}</p>`)}
    ${d.extra ? block(d.extra.title, list(d.extra.items)) : ""}`;

  if (window.Swiper) {
    new Swiper(".swiper", {
      slidesPerView: "auto", centeredSlides: true, spaceBetween: 12, grabCursor: true, keyboard: true, slideToClickedSlide: true,
      navigation: { prevEl: ".swiper-button-prev", nextEl: ".swiper-button-next" },
      pagination: { el: ".swiper-pagination", type: "fraction" },
    });
  }
}

/* ---------- 5. START-UP ---------- */
$("#year").textContent = new Date().getFullYear();
if (document.body.dataset.page === "home") { renderStats(); renderMap(); renderTrips(); }
else renderDestination();
