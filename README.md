# Nusantara in Numbers — Best National Statistics Site

[![Built with make.fun](https://img.shields.io/badge/built%20with-make.fun-0e7c7b)](https://make.fun)
[Competition: Best National Statistics Site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for **Indonesia**, built as static files with zero network
requests. Five pages, real figures, working charts, sortable tables and search —
all of it runs from `app/` in any desktop or phone browser.

## Pages

| Page | What it shows |
| --- | --- |
| `app/index.html` | Overview: headline KPIs, year switcher (2020–2024), population & GDP-growth charts |
| `app/population.html` | Age structure, growth, all 38 provinces (sortable, searchable) |
| `app/economy.html` | GDP by sector, inflation, trade balance |
| `app/health-education.html` | Life expectancy, health system, schooling (tabbed) |
| `app/regions.html` | Province explorer: population, area, density, regional facts |

## Run it

```sh
node main.ts        # regenerates app/ from the embedded data (deterministic)
```

Then open `app/index.html` in a browser, or serve the folder:

```sh
npx serve app      # any static server works; no build step
```

## How it works

- `main.ts` (Node 22+) is the program: it holds the dataset and generates every
  page, the stylesheet, the client script and the data file under `app/`.
- `app/main.js` draws the charts on `<canvas>`, powers the year switcher, sortable
  tables, province search and tabs — all client-side, no network.
- `vendor/makefun-frontend.ts` is copied unchanged from the competition kit.
- `screenshots/` holds real renders of the site's own code (desktop + phone).

## Data

Figures are rounded published estimates from Statistics Indonesia (BPS) releases
2020–2024 and ministry publications — see `DOSSIER.md` for the full source
notes and the decisions behind each figure.

## License

MIT — see `LICENSE`.
