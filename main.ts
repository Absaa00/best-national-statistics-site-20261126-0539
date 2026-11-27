// Nusantara in Numbers — national statistics site generator.
// Builds the static site under app/ from embedded data (no network, deterministic).
// Run: node main.ts   (Node 22+; erasable TypeScript only)
// Output: app/index.html, app/population.html, app/economy.html,
//         app/health-education.html, app/regions.html, app/style.css,
//         app/main.js, app/data.js
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const APP = join(ROOT, "app");

type YearRow = { year: number; population: number; gdp: number; growth: number; inflation: number; life: number; unemp: number };

const YEARS: YearRow[] = [
  { year: 2020, population: 270.2, gdp: 15443, growth: -2.07, inflation: 1.68, life: 71.9, unemp: 7.07 },
  { year: 2021, population: 272.7, gdp: 16976, growth: 3.7, inflation: 1.87, life: 72.0, unemp: 6.49 },
  { year: 2022, population: 275.8, gdp: 19588, growth: 5.31, inflation: 5.51, life: 72.9, unemp: 5.86 },
  { year: 2023, population: 278.7, gdp: 20892, growth: 5.05, inflation: 2.61, life: 73.5, unemp: 5.32 },
  { year: 2024, population: 281.6, gdp: 22139, growth: 5.03, inflation: 1.57, life: 73.9, unemp: 4.82 },
];

const SECTORS: { name: string; share: number }[] = [
  { name: "Manufacturing", share: 18.9 },
  { name: "Wholesale & retail trade", share: 13.0 },
  { name: "Agriculture, forestry & fishing", share: 12.5 },
  { name: "Construction", share: 9.9 },
  { name: "Mining & quarrying", share: 8.4 },
  { name: "Transport & storage", share: 5.8 },
  { name: "Information & communication", share: 4.2 },
  { name: "Financial & insurance", share: 4.1 },
  { name: "Public administration", share: 3.6 },
  { name: "Real estate", share: 2.7 },
  { name: "Other services", share: 16.9 },
];

const AGE_GROUPS: { group: string; pct: number }[] = [
  { group: "0–4", pct: 7.6 },
  { group: "5–9", pct: 8.1 },
  { group: "10–14", pct: 8.4 },
  { group: "15–19", pct: 8.4 },
  { group: "20–24", pct: 8.3 },
  { group: "25–29", pct: 8.1 },
  { group: "30–34", pct: 7.9 },
  { group: "35–39", pct: 7.6 },
  { group: "40–44", pct: 7.1 },
  { group: "45–49", pct: 6.4 },
  { group: "50–54", pct: 5.5 },
  { group: "55–59", pct: 4.6 },
  { group: "60–64", pct: 3.6 },
  { group: "65+", pct: 6.4 },
];

type Province = { name: string; pop: number; area: number };
const PROVINCES: Province[] = [
  { name: "West Java", pop: 49.9, area: 35378 },
  { name: "East Java", pop: 41.8, area: 47803 },
  { name: "Central Java", pop: 38.1, area: 32801 },
  { name: "North Sumatra", pop: 15.9, area: 72981 },
  { name: "Banten", pop: 12.4, area: 9663 },
  { name: "Jakarta", pop: 10.6, area: 664 },
  { name: "South Sulawesi", pop: 9.2, area: 46717 },
  { name: "Lampung", pop: 9.05, area: 34624 },
  { name: "South Sumatra", pop: 9.05, area: 91592 },
  { name: "Riau", pop: 6.65, area: 87024 },
  { name: "West Sumatra", pop: 5.85, area: 42013 },
  { name: "West Kalimantan", pop: 5.75, area: 147307 },
  { name: "East Nusa Tenggara", pop: 5.6, area: 48626 },
  { name: "Aceh", pop: 5.55, area: 57957 },
  { name: "West Nusa Tenggara", pop: 5.55, area: 18572 },
  { name: "Bali", pop: 4.4, area: 5780 },
  { name: "South Kalimantan", pop: 4.2, area: 38744 },
  { name: "East Kalimantan", pop: 3.9, area: 127267 },
  { name: "Jambi", pop: 3.65, area: 50059 },
  { name: "Central Sulawesi", pop: 3.05, area: 61841 },
  { name: "Central Kalimantan", pop: 2.75, area: 153565 },
  { name: "Southeast Sulawesi", pop: 2.75, area: 38068 },
  { name: "North Sulawesi", pop: 2.7, area: 13852 },
  { name: "Riau Islands", pop: 2.15, area: 8201 },
  { name: "Bengkulu", pop: 2.05, area: 19917 },
  { name: "Maluku", pop: 1.95, area: 46914 },
  { name: "Bangka Belitung", pop: 1.55, area: 16424 },
  { name: "West Sulawesi", pop: 1.55, area: 16787 },
  { name: "Central Papua", pop: 1.35, area: 61116 },
  { name: "North Maluku", pop: 1.35, area: 31983 },
  { name: "Gorontalo", pop: 1.25, area: 11257 },
  { name: "Papua", pop: 1.1, area: 82952 },
  { name: "North Kalimantan", pop: 0.75, area: 70131 },
  { name: "Southwest Papua", pop: 0.65, area: 39167 },
  { name: "West Papua", pop: 0.6, area: 65070 },
  { name: "South Papua", pop: 0.55, area: 131381 },
  { name: "Highland Papua", pop: 1.45, area: 51393 },
  { name: "Yogyakarta", pop: 3.8, area: 3133 },
];

const SITE = {
  name: "Nusantara in Numbers",
  country: "Indonesia",
  year: 2024,
  note: "Figures are rounded published estimates (Statistics Indonesia / BPS and ministry releases). Values are indicative for illustration of the site, not an official republication.",
};

function fmt(n: number, d = 1): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function nav(active: string): string {
  const links: [string, string, string][] = [
    ["index.html", "Overview", "overview"],
    ["population.html", "Population", "population"],
    ["economy.html", "Economy", "economy"],
    ["health-education.html", "Health & Education", "health"],
    ["regions.html", "Regions", "regions"],
  ];
  const items = links
    .map(([href, label, key]) => `<a href="${href}"${key === active ? ' class="active" aria-current="page"' : ""}>${label}</a>`)
    .join("\n      ");
  return `<header class="topbar">
  <div class="brand"><span class="logo">◈</span><div><strong>${SITE.name}</strong><small>National statistics · ${SITE.country}</small></div></div>
  <nav>${items}</nav>
</header>`;
}

function page(active: string, title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — ${SITE.name}</title>
<meta name="description" content="${title} of ${SITE.country}: official-style national statistics with charts, tables and real figures.">
<link rel="stylesheet" href="style.css">
</head>
<body>
${nav(active)}
<main>
${body}
</main>
<footer>
  <p>${SITE.name} · ${SITE.country} · Data year ${SITE.year}. ${SITE.note}</p>
  <p><a href="index.html">Overview</a> · <a href="population.html">Population</a> · <a href="economy.html">Economy</a> · <a href="health-education.html">Health &amp; Education</a> · <a href="regions.html">Regions</a></p>
</footer>
<script src="data.js"></script>
<script src="main.js"></script>
</body>
</html>
`;
}

const CSS = `:root{--navy:#0b2545;--teal:#0e7c7b;--gold:#d9a441;--ink:#17202a;--muted:#5b6b7a;--line:#dbe3ea;--bg:#f4f7f9;--card:#fff}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.55}
.topbar{background:var(--navy);color:#fff;padding:14px 22px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;position:sticky;top:0;z-index:10}
.brand{display:flex;gap:10px;align-items:center}.logo{font-size:26px;color:var(--gold)}
.brand strong{display:block;font-size:18px;line-height:1.1}.brand small{color:#b9c8d8;font-size:12px}
nav{display:flex;gap:4px;flex-wrap:wrap}nav a{color:#dbe7f2;text-decoration:none;padding:8px 12px;border-radius:8px;font-size:14px}
nav a:hover{background:#14355e}nav a.active{background:var(--teal);color:#fff}
main{max-width:1080px;margin:0 auto;padding:24px 18px 40px}
h1{font-size:30px;margin:6px 0 4px;color:var(--navy)}h2{font-size:21px;color:var(--navy);margin:26px 0 8px}
.lede{color:var(--muted);max-width:760px;margin:0 0 18px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}
.kpi b{font-size:24px;color:var(--navy);display:block}.kpi span{font-size:13px;color:var(--muted)}
.kpi small{color:var(--teal);font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.card h3{margin:0 0 6px;color:var(--navy);font-size:17px}.card p{margin:0 0 10px;color:var(--muted);font-size:14px}
.card a{color:var(--teal);font-weight:600;text-decoration:none}
canvas.chart{width:100%;height:260px;display:block}
canvas.chart.tall{height:320px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden}
th,td{padding:9px 12px;text-align:left;font-size:14px;border-bottom:1px solid var(--line)}
th{background:var(--navy);color:#fff;cursor:pointer;user-select:none}th:hover{background:#14355e}
tr:last-child td{border-bottom:0}td.num,th.num{text-align:right}
.controls{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}
.controls label{font-size:14px;color:var(--muted)}
select,input[type=search]{padding:8px 10px;border:1px solid var(--line);border-radius:8px;font-size:14px;background:#fff}
.bar-row{display:grid;grid-template-columns:170px 1fr 52px;gap:8px;align-items:center;font-size:13px;margin:5px 0}
.bar-track{background:#e6edf2;border-radius:6px;height:16px;overflow:hidden}
.bar-fill{background:linear-gradient(90deg,var(--teal),#19a3a2);height:100%}
.note{font-size:13px;color:var(--muted);background:#eef4f6;border:1px solid var(--line);border-radius:10px;padding:10px 14px}
footer{max-width:1080px;margin:0 auto;padding:0 18px 30px;color:var(--muted);font-size:13px}
footer a{color:var(--teal)}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}
.tabs button{padding:8px 14px;border:1px solid var(--line);background:#fff;border-radius:999px;cursor:pointer;font-size:14px}
.tabs button.on{background:var(--navy);color:#fff;border-color:var(--navy)}
@media(max-width:640px){h1{font-size:24px}.bar-row{grid-template-columns:110px 1fr 44px}}
`;

const DATA_JS = `window.NUSANTARA_DATA = ${JSON.stringify({ years: YEARS, sectors: SECTORS, ageGroups: AGE_GROUPS, provinces: PROVINCES }, null, 2)};
`;

const MAIN_JS = `// Nusantara in Numbers — client logic: charts, sortable tables, search, year switcher.
(function () {
  var D = window.NUSANTARA_DATA;
  function $(id) { return document.getElementById(id); }
  function drawLine(canvas, labels, values, color) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = canvas.clientWidth * 2, h = canvas.height = canvas.clientHeight * 2;
    ctx.clearRect(0, 0, w, h);
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var pad = (max - min) * 0.15 || 1; min -= pad; max += pad;
    var x0 = 70, x1 = w - 30, y0 = 20, y1 = h - 50;
    ctx.strokeStyle = "#dbe3ea"; ctx.fillStyle = "#5b6b7a"; ctx.font = "22px system-ui";
    ctx.textAlign = "right";
    for (var g = 0; g <= 4; g++) {
      var v = min + ((max - min) * g) / 4, y = y1 - ((v - min) / (max - min)) * (y1 - y0);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.fillText(v.toFixed(1), x0 - 10, y + 8);
    }
    ctx.textAlign = "center";
    var px = labels.map(function (_, i) { return x0 + ((x1 - x0) * i) / (labels.length - 1); });
    var py = values.map(function (v) { return y1 - ((v - min) / (max - min)) * (y1 - y0); });
    labels.forEach(function (l, i) { ctx.fillText(String(l), px[i], h - 14); });
    ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.beginPath();
    py.forEach(function (y, i) { i ? ctx.lineTo(px[i], y) : ctx.moveTo(px[i], y); });
    ctx.stroke();
    ctx.fillStyle = color;
    py.forEach(function (y, i) { ctx.beginPath(); ctx.arc(px[i], y, 8, 0, 7); ctx.fill(); });
  }
  function drawBars(canvas, labels, values, color) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = canvas.clientWidth * 2, h = canvas.height = canvas.clientHeight * 2;
    ctx.clearRect(0, 0, w, h);
    var max = Math.max.apply(null, values) * 1.1;
    var bw = (w - 40) / labels.length;
    ctx.font = "20px system-ui"; ctx.fillStyle = "#5b6b7a"; ctx.textAlign = "center";
    labels.forEach(function (l, i) {
      var bh = ((h - 70) * values[i]) / max, x = 20 + bw * i, y = h - 40 - bh;
      ctx.fillStyle = color; ctx.fillRect(x + 8, y, bw - 16, bh);
      ctx.fillStyle = "#17202a"; ctx.fillText(values[i].toFixed(1), x + bw / 2, y - 8);
      ctx.fillStyle = "#5b6b7a"; ctx.fillText(String(l), x + bw / 2, h - 12);
    });
  }
  // Overview charts
  drawLine($("popChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.population; }), "#0e7c7b");
  drawLine($("growthChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.growth; }), "#0b2545");
  drawBars($("sectorChart"), D.sectors.slice(0, 8).map(function (s) { return s.name.split(" ")[0]; }), D.sectors.slice(0, 8).map(function (s) { return s.share; }), "#d9a441");
  drawLine($("lifeChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.life; }), "#0e7c7b");
  drawLine($("inflChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.inflation; }), "#0b2545");
  drawBars($("ageChart"), D.ageGroups.map(function (a) { return a.group; }), D.ageGroups.map(function (a) { return a.pct; }), "#0e7c7b");
  // Year switcher on overview
  var ys = $("yearSelect");
  if (ys) {
    ys.addEventListener("change", function () {
      var row = D.years.find(function (r) { return r.year === +ys.value; });
      if (!row) return;
      ["kPop", "kGdp", "kGrowth", "kLife", "kUnemp", "kInfl"].forEach(function (id) {
        var el = $(id); if (el) el.textContent = { kPop: row.population.toFixed(1) + " jt", kGdp: "Rp " + row.gdp.toLocaleString("en-US") + " T", kGrowth: row.growth.toFixed(2) + "%", kLife: row.life.toFixed(1) + " thn", kUnemp: row.unemp.toFixed(2) + "%", kInfl: row.inflation.toFixed(2) + "%" }[id];
      });
    });
  }
  // Sortable tables
  document.querySelectorAll("table.sortable").forEach(function (table) {
    var dir = 1;
    table.querySelectorAll("th").forEach(function (th, idx) {
      th.addEventListener("click", function () {
        var tb = table.tBodies[0];
        var rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, b) {
          var av = a.cells[idx].textContent.trim(), bv = b.cells[idx].textContent.trim();
          var an = parseFloat(av.replace(/[^0-9.]/g, "")), bn = parseFloat(bv.replace(/[^0-9.]/g, ""));
          var cmp = !isNaN(an) && !isNaN(bn) && av !== "" ? an - bn : av.localeCompare(bv);
          return cmp * dir;
        });
        dir *= -1;
        rows.forEach(function (r) { tb.appendChild(r); });
      });
    });
  });
  // Province search
  var q = $("provSearch"), body = $("provBody");
  if (q && body) {
    q.addEventListener("input", function () {
      var needle = q.value.toLowerCase();
      Array.prototype.forEach.call(body.rows, function (r) {
        r.style.display = r.textContent.toLowerCase().indexOf(needle) === -1 ? "none" : "";
      });
      var n = $("provCount");
      if (n) n.textContent = Array.prototype.filter.call(body.rows, function (r) { return r.style.display !== "none"; }).length + " of 38 provinces shown";
    });
  }
  // Tabs on health page
  document.querySelectorAll(".tabs").forEach(function (tabs) {
    tabs.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        document.querySelectorAll("[data-panel]").forEach(function (p) { p.style.display = "none"; });
        var panel = document.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if (panel) panel.style.display = "";
      });
    });
  });
})();
`;

function kpiCards(row: YearRow): string {
  return `<section class="kpis">
  <div class="kpi"><span>Population</span><b id="kPop">${fmt(row.population)} jt</b><small>mid-year estimate</small></div>
  <div class="kpi"><span>GDP</span><b id="kGdp">Rp ${row.gdp.toLocaleString("en-US")} T</b><small>current prices</small></div>
  <div class="kpi"><span>GDP growth</span><b id="kGrowth">${row.growth.toFixed(2)}%</b><small>year on year</small></div>
  <div class="kpi"><span>Life expectancy</span><b id="kLife">${row.life.toFixed(1)} thn</b><small>at birth</small></div>
  <div class="kpi"><span>Unemployment</span><b id="kUnemp">${row.unemp.toFixed(2)}%</b><small>open unemployment</small></div>
  <div class="kpi"><span>Inflation</span><b id="kInfl">${row.inflation.toFixed(2)}%</b><small>year on year</small></div>
</section>`;
}

function yearSelect(): string {
  const opts = YEARS.map((r) => `<option value="${r.year}"${r.year === 2024 ? " selected" : ""}>${r.year}</option>`).join("");
  return `<div class="controls"><label>Data year <select id="yearSelect">${opts}</select></label><span class="note">Switching the year updates the headline figures above.</span></div>`;
}

function provinceRows(): string {
  return PROVINCES.map(
    (p) => `<tr><td>${p.name}</td><td class="num">${fmt(p.pop, 2)}</td><td class="num">${p.area.toLocaleString("en-US")}</td><td class="num">${fmt((p.pop * 1e6) / p.area, 0)}</td></tr>`,
  ).join("\n");
}

function sectorBars(): string {
  return SECTORS.map(
    (s) => `<div class="bar-row"><span>${s.name}</span><div class="bar-track"><div class="bar-fill" style="width:${s.share * 4.4}%"></div></div><b>${s.share.toFixed(1)}%</b></div>`,
  ).join("\n");
}

const PAGES: { file: string; active: string; title: string; body: string }[] = [
  {
    file: "index.html", active: "overview", title: "Overview",
    body: `<h1>${SITE.country} in Numbers</h1>
<p class="lede">The national statistics of ${SITE.country} in one place: population, economy, health, education and regions — with real figures, working charts and tables you can sort, search and explore.</p>
${yearSelect()}
${kpiCards(YEARS[4])}
<div class="cards">
  <div class="card"><h3>Population 2020–2024</h3><canvas id="popChart" class="chart" aria-label="Population line chart, millions"></canvas><p>Population rose from 270.2 to 281.6 million in four years.</p></div>
  <div class="card"><h3>GDP growth (%)</h3><canvas id="growthChart" class="chart" aria-label="GDP growth line chart"></canvas><p>Growth stayed above 5% for three straight years after the 2020 contraction.</p></div>
</div>
<h2>Explore the statistics</h2>
<div class="cards">
  <div class="card"><h3>Population</h3><p>Age structure, growth and all 38 provinces with density.</p><a href="population.html">Open Population →</a></div>
  <div class="card"><h3>Economy</h3><p>GDP by sector, trade, inflation and growth since 2020.</p><a href="economy.html">Open Economy →</a></div>
  <div class="card"><h3>Health &amp; Education</h3><p>Life expectancy, literacy, schooling and health facilities.</p><a href="health-education.html">Open Health &amp; Education →</a></div>
  <div class="card"><h3>Regions</h3><p>Compare every province: population, area and density.</p><a href="regions.html">Open Regions →</a></div>
</div>
<p class="note" style="margin-top:18px">Source: Statistics Indonesia (BPS) releases 2020–2024, rounded for this site. ${SITE.note}</p>`,
  },
  {
    file: "population.html", active: "population", title: "Population",
    body: `<h1>Population</h1>
<p class="lede">281.6 million people in 2024, spread across 38 provinces and more than 17,000 islands. The median age is 30.3 years; 68.9% of people are of working age.</p>
<div class="cards">
  <div class="card"><h3>Age structure, 2024 (% of population)</h3><canvas id="ageChart" class="chart tall" aria-label="Age group bar chart"></canvas><p>The largest cohorts are 10–19 years old — a young, working-age nation.</p></div>
  <div class="card"><h3>Population by province</h3><p>Java holds 55.9% of the population on 6.6% of the land.</p>
  <div class="controls"><input type="search" id="provSearch" placeholder="Search a province…" aria-label="Search provinces"></div>
  <p id="provCount">38 of 38 provinces shown</p></div>
</div>
<h2>All provinces — click a column header to sort</h2>
<table class="sortable"><thead><tr><th>Province</th><th class="num">Population (millions)</th><th class="num">Area (km²)</th><th class="num">Density (/km²)</th></tr></thead>
<tbody id="provBody">${provinceRows()}</tbody></table>
<p class="note">Density is population divided by land area. Jakarta is the densest province at about 16,000 people per km²; South Papua the sparsest at about 4 per km².</p>`,
  },
  {
    file: "economy.html", active: "economy", title: "Economy",
    body: `<h1>Economy</h1>
<p class="lede">GDP reached Rp 22,139 trillion in 2024 (about US$1.40 trillion), growing 5.03%. Manufacturing is the largest sector at 18.9% of GDP.</p>
<div class="cards">
  <div class="card"><h3>GDP by sector, 2024</h3><canvas id="sectorChart" class="chart" aria-label="GDP by sector bar chart"></canvas></div>
  <div class="card"><h3>Inflation, year on year (%)</h3><canvas id="inflChart" class="chart" aria-label="Inflation line chart"></canvas><p>Inflation fell to 1.57% in 2024 after the 5.51% spike of 2022.</p></div>
</div>
<h2>Sector shares of GDP, 2024</h2>
${sectorBars()}
<p class="note">Shares sum to 100% including "Other services". Manufacturing has been the largest sector every year since 2015.</p>
<h2>Trade, 2024</h2>
<table class="sortable"><thead><tr><th>Flow</th><th class="num">Value (US$ bn)</th><th>Main partners</th></tr></thead>
<tbody>
<tr><td>Exports</td><td class="num">264.7</td><td>China, United States, Japan</td></tr>
<tr><td>Imports</td><td class="num">233.7</td><td>China, Singapore, Japan</td></tr>
<tr><td>Trade balance</td><td class="num">+31.0</td><td>Surplus for the fifth straight year</td></tr>
<tr><td>Foreign reserves</td><td class="num">155.7</td><td>About 6.5 months of imports</td></tr>
</tbody></table>`,
  },
  {
    file: "health-education.html", active: "health", title: "Health & Education",
    body: `<h1>Health &amp; Education</h1>
<p class="lede">Life expectancy reached 73.9 years in 2024. Literacy among people aged 15 and over is 96.5%, and mean years of schooling is 9.2 years.</p>
<div class="tabs"><button class="on" data-tab="health">Health</button><button data-tab="edu">Education</button></div>
<div data-panel="health">
<div class="cards">
  <div class="card"><h3>Life expectancy at birth (years)</h3><canvas id="lifeChart" class="chart" aria-label="Life expectancy line chart"></canvas><p>Up from 71.9 years in 2020 to 73.9 in 2024.</p></div>
  <div class="card"><h3>Health system, 2024</h3><p>Hospitals: 3,168 · Community health centres (puskesmas): 10,416 · National health insurance (JKN) members: 271 million, about 96% of the population.</p><p>Infant mortality: 15.9 per 1,000 live births. Stunting among children under five: 19.8%.</p></div>
</div></div>
<div data-panel="edu" style="display:none">
<div class="cards">
  <div class="card"><h3>Schooling, 2024</h3><p>Mean years of schooling: 9.2 · Expected years: 13.2 · Adult literacy (15+): 96.5% · Net enrolment, primary: 97.8% · junior secondary: 81.4% · senior secondary: 65.9%.</p></div>
  <div class="card"><h3>Students &amp; teachers</h3><p>About 53 million students from primary to senior secondary, taught by 3.4 million teachers. Higher education: 4,400 institutions, 9.3 million students.</p></div>
</div></div>`,
  },
  {
    file: "regions.html", active: "regions", title: "Regions",
    body: `<h1>Regions</h1>
<p class="lede">Compare all 38 provinces. West Java is the most populous (49.9 million); Jakarta the densest; Central Kalimantan the largest by land among the big-five islands' provinces.</p>
<div class="controls"><input type="search" id="provSearch" placeholder="Search a province…" aria-label="Search provinces"></div>
<p id="provCount">38 of 38 provinces shown</p>
<table class="sortable"><thead><tr><th>Province</th><th class="num">Population (millions)</th><th class="num">Area (km²)</th><th class="num">Density (/km²)</th></tr></thead>
<tbody id="provBody">${provinceRows()}</tbody></table>
<h2>Five facts by region</h2>
<div class="cards">
  <div class="card"><h3>Java</h3><p>55.9% of people, 6.6% of land. Six provinces, including the capital Jakarta.</p></div>
  <div class="card"><h3>Sumatra</h3><p>21.7% of people. Largest island economy after Java; palm oil and coal heartland.</p></div>
  <div class="card"><h3>Kalimantan</h3><p>6.1% of people on 28% of the land — home of the new capital, Nusantara.</p></div>
  <div class="card"><h3>Sulawesi</h3><p>7.4% of people. Nickel processing is reshaping its economy.</p></div>
  <div class="card"><h3>Maluku &amp; Papua</h3><p>3.9% of people on 25% of the land — the lowest densities in the country.</p></div>
</div>`,
  },
];

function main(): void {
  mkdirSync(APP, { recursive: true });
  mkdirSync(join(ROOT, "screenshots"), { recursive: true });
  for (const p of PAGES) writeFileSync(join(APP, p.file), page(p.active, p.title, p.body));
  writeFileSync(join(APP, "style.css"), CSS);
  writeFileSync(join(APP, "main.js"), MAIN_JS);
  writeFileSync(join(APP, "data.js"), DATA_JS);
  const count = PAGES.length + 3;
  console.log("wrote " + count + " files to app/");
}

main();
