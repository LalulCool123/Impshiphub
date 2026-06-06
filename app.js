let ships = [];
let filtered = [];

const list = document.getElementById("shipList");
const detail = document.getElementById("detailPanel");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");

async function init() {
  const res = await fetch("ships.json");
  ships = await res.json();

  filtered = [...ships];
  render();
  stats();
}

init();

/* FILTER */
function applyFilters() {
  const s = searchInput.value.toLowerCase();
  const c = categoryFilter.value;
  const st = statusFilter.value;

  filtered = ships.filter(ship => {
    return (
      (!s || ship.name.toLowerCase().includes(s)) &&
      (!c || ship.class === c) &&
      (!st || ship.status === st)
    );
  });

  sort();
  render();
  stats();
}

/* SORT */
function sort() {
  const type = sortSelect.value;

  filtered.sort((a, b) => {
    if (type === "name") return a.name.localeCompare(b.name);
    if (type === "length") return (b.length || 0) - (a.length || 0);
    if (type === "crew") return (b.crew || 0) - (a.crew || 0);
  });
}

/* RENDER LIST */
function render() {
  list.innerHTML = "";

  filtered.forEach(ship => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>${ship.name}</b><br/>
      <small>${ship.class} • ${ship.status}</small>
    `;

    div.onclick = () => openDetail(ship);
    list.appendChild(div);
  });
}

/* DETAIL VIEW */
function openDetail(ship) {
  detail.classList.remove("hidden");

  detail.innerHTML = `
    <button onclick="closeDetail()">← Zurück</button>

    <h2>${ship.name}</h2>
    <p>${ship.class}</p>

    <hr/>

    <p><b>Hersteller:</b> ${ship.manufacturer || "-"}</p>
    <p><b>Ära:</b> ${ship.era || "-"}</p>
    <p><b>Crew:</b> ${ship.crew || "-"}</p>
    <p><b>Länge:</b> ${ship.length || "-"}</p>

    <p>${ship.description || ""}</p>
  `;
}

function closeDetail() {
  detail.classList.add("hidden");
}

/* STATS */
function stats() {
  document.getElementById("totalShips").textContent = filtered.length;
  document.getElementById("canonShips").textContent =
    filtered.filter(s => s.status === "Canon").length;
  document.getElementById("legendsShips").textContent =
    filtered.filter(s => s.status === "Legends").length;
}

/* EVENTS */
[
  searchInput,
  categoryFilter,
  statusFilter,
  sortSelect
].forEach(el => el.addEventListener("input", applyFilters));