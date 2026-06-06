// ===============================
// STAR WARS SHIP DATABASE APP
// ===============================

let ships = [];
let filteredShips = [];
let currentShip = null;

// DOM
const listContainer = document.getElementById("shipList");
const detailPanel = document.getElementById("detailPanel");

// Inputs
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");
const eraFilter = document.getElementById("eraFilter");
const manufacturerFilter = document.getElementById("manufacturerFilter");
const affiliationFilter = document.getElementById("affiliationFilter");

// ===============================
// INIT
// ===============================
async function init() {
  const res = await fetch("./data/ships.json");
  ships = await res.json();

  filteredShips = [...ships];

  renderList();
  updateStats();
}

init();

// ===============================
// FILTER + SEARCH
// ===============================
function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const status = statusFilter.value;
  const era = eraFilter.value;
  const manufacturer = manufacturerFilter.value;
  const affiliation = affiliationFilter.value;

  filteredShips = ships.filter(ship => {
    return (
      (!search || ship.name.toLowerCase().includes(search)) &&
      (!category || ship.class === category) &&
      (!status || ship.continuity === status) &&
      (!era || ship.era === era) &&
      (!manufacturer || ship.manufacturer === manufacturer) &&
      (!affiliation || ship.affiliation === affiliation)
    );
  });

  sortShips();
  renderList();
  updateStats();
}

// ===============================
// SORTING
// ===============================
function sortShips() {
  const sort = sortSelect.value;

  filteredShips.sort((a, b) => {
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "length":
        return (b.length || 0) - (a.length || 0);
      case "crew":
        return (b.crew || 0) - (a.crew || 0);
      case "category":
        return (a.class || "").localeCompare(b.class || "");
      default:
        return 0;
    }
  });
}

// ===============================
// RENDER LIST
// ===============================
function renderList() {
  listContainer.innerHTML = "";

  filteredShips.forEach(ship => {
    const div = document.createElement("div");
    div.className = "ship-card";

    div.innerHTML = `
      <div class="ship-name">${ship.name}</div>
      <div class="ship-class">${ship.class} • ${ship.continuity}</div>
    `;

    div.onclick = () => showDetails(ship);

    listContainer.appendChild(div);
  });
}

// ===============================
// DETAIL VIEW
// ===============================
function showDetails(ship) {
  currentShip = ship;

  detailPanel.innerHTML = `
    <div class="detail-header">
      <button class="back-button" onclick="closeDetails()">← Zurück</button>
      <h2>${ship.name}</h2>
      <p>${ship.class}</p>
      <span class="status-pill ${ship.continuity.toLowerCase()}">
        ${ship.continuity}
      </span>
    </div>

    <div class="detail-grid">
      <div class="detail-main">

        <div class="section-card">
          <h3>Technische Daten</h3>
          <div class="data-grid">
            <div class="data-item"><span class="label">Länge</span><span class="value">${ship.length || "-"} m</span></div>
            <div class="data-item"><span class="label">Crew</span><span class="value">${ship.crew || "-"}</span></div>
            <div class="data-item"><span class="label">Passagiere</span><span class="value">${ship.passengers || "-"}</span></div>
            <div class="data-item"><span class="label">Hyperantrieb</span><span class="value">${ship.hyperdrive || "-"}</span></div>
          </div>
        </div>

        <div class="section-card">
          <h3>Beschreibung</h3>
          <div class="detail-body">
            <p>${ship.description || "Keine Beschreibung verfügbar."}</p>
          </div>
        </div>

      </div>

      <div class="detail-side">

        <div class="section-card">
          <h3>Fakten</h3>
          <div class="data-grid">
            <div class="data-item"><span class="label">Hersteller</span><span class="value">${ship.manufacturer}</span></div>
            <div class="data-item"><span class="label">Fraktion</span><span class="value">${ship.affiliation}</span></div>
            <div class="data-item"><span class="label">Ära</span><span class="value">${ship.era}</span></div>
          </div>
        </div>

      </div>
    </div>
  `;

  detailPanel.classList.remove("hidden");
}

// ===============================
// CLOSE DETAIL
// ===============================
function closeDetails() {
  detailPanel.classList.add("hidden");
}

// ===============================
// STATS
// ===============================
function updateStats() {
  document.getElementById("totalShipsCount").textContent = filteredShips.length;
  document.getElementById("canonShipsCount").textContent =
    filteredShips.filter(s => s.continuity === "Canon").length;
  document.getElementById("legendsShipsCount").textContent =
    filteredShips.filter(s => s.continuity === "Legends").length;
}

// ===============================
// EVENTS
// ===============================
[
  searchInput,
  categoryFilter,
  statusFilter,
  sortSelect,
  eraFilter,
  manufacturerFilter,
  affiliationFilter
].forEach(el => el.addEventListener("input", applyFilters));

// ===============================
// MOBILE NAV HELPERS
// ===============================
function scrollToCategory(category) {
  categoryFilter.value = category;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}