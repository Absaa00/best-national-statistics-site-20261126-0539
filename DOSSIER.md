# Dossier — Nusantara in Numbers

## What this is

A national statistics site for Indonesia ("Nusantara in Numbers"), entered in the
make.fun competition *Best National Statistics Site* (29 Nov 2026). It is a fully
static site: five HTML pages, one stylesheet, two scripts, no network requests,
no build step, no tracking.

## Pages and what a visitor can do

1. **Overview (`app/index.html`)** — six headline KPIs for the selected year
   (2020–2024 switcher updates them live), population line chart, GDP-growth
   chart, and cards linking to the other four pages.
2. **Population (`app/population.html`)** — age-structure bar chart for 2024,
   and a table of all 38 provinces (population, area, density) that sorts by
   clicking any column header and filters through the search box.
3. **Economy (`app/economy.html`)** — GDP by sector (bar chart + shares),
   inflation line chart 2020–2024, and a trade table (exports, imports, balance,
   reserves).
4. **Health & Education (`app/health-education.html`)** — tabbed panels: life
   expectancy chart and health-system facts; schooling, literacy and enrolment.
5. **Regions (`app/regions.html`)** — the same 38-province explorer plus five
   regional fact cards (Java, Sumatra, Kalimantan, Sulawesi, Maluku & Papua).

Every control does what it says: the year selector rewrites the KPIs, table
headers sort, the search box filters, and the tabs switch panels. Nothing is a
placeholder.

## Data and sources

Figures are rounded published estimates, not an official republication:

- Population 2020–2024 (270.2 → 281.6 million): BPS mid-year estimates;
  2020 from the Population Census.
- GDP 2020–2024 (Rp 15,443 → 22,139 trillion) and growth (−2.07% → 5.03%):
  BPS national accounts, current prices.
- Sector shares 2024: BPS GDP by industry (manufacturing 18.9%, trade 13.0%,
  agriculture 12.5%, construction 9.9%, mining 8.4%, rest grouped).
- Inflation 2020–2024 (1.68% → 1.57%, peak 5.51% in 2022): BPS CPI.
- Life expectancy 71.9 → 73.9 years, unemployment 7.07% → 4.82%: BPS.
- Literacy 96.5%, mean schooling 9.2 years, enrolment rates: BPS / Ministry of
  Education, Culture, Research and Technology releases.
- Trade 2024 (exports US$264.7bn, imports US$233.7bn): BPS foreign trade
  statistics, rounded.
- Province populations and areas: BPS 2024 mid-year estimates, rounded to the
  nearest 0.05 million; densities computed from those figures.

Where a figure is approximate it is labelled as such on the site ("rounded
published estimates").

## Design

- Visual language: deep navy + teal + gold, card-based, system font stack —
  an official-statistics look without copying any existing portal's brand.
- Charts are hand-drawn on `<canvas>` by `app/main.js`; no chart library and no
  external assets, so the site works offline.
- Responsive: single-column cards and a compact table layout under 640px; one
  screenshot is taken at phone size (390×844).

## Build and verification

- `node main.ts` regenerates `app/` deterministically from the embedded data.
- Screenshots in `screenshots/` are real renders of the site's own code, taken
  with headless Chromium: `1-overview.png` (1280×900), `2-population.png`,
  `3-economy.png`, `4-overview-phone.png` (390×844).
- `vendor/makefun-frontend.ts` is copied unchanged from the competition kit.
- During the build, the GDP-growth chart was revised from bars to a line after
  a screenshot review showed the negative 2020 value rendering poorly as a bar.
