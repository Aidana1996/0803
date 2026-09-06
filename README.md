# 0803 — Women's Apparel Storefront

Marketing and catalogue site for **0803**, a women's apparel store at
**2590 Red Hill Ave, Santa Ana, CA 92705**.

The site deliberately has **no checkout**. Every piece is inventory that lives on
the store floor, so the site's job is to show what is physically in stock, in
which size and colour, and let a customer put it on hold for an in-person
fitting. Payment happens at the counter.

## What's here

| Page | Purpose |
| --- | --- |
| `index.html` | Home — hero, collections, best sellers, store block, journal |
| `shop.html` | Full catalogue with filtering, sorting and URL-synced state |
| `product.html?id=…` | Product detail: gallery, colourways, per-size floor stock |
| `reserve.html` | "Fitting room" — the hold list, printable, with a hold form |
| `visit.html` | Store hours, map, directions, services, appointments |
| `about.html` | Brand story |
| `journal.html` / `article.html?id=…` | Editorial index and entries |
| `sizing.html` | Measurement tables, inseams, fit rules |
| `help.html` | Reserving, payment, exchanges, alterations |
| `404.html` | Not found |

## Stack

Static HTML, CSS and vanilla JavaScript. **No build step and no runtime
dependencies** — open `index.html` through any web server and it runs.

```
assets/
  css/styles.css        design system (tokens → components → responsive)
  css/fonts.css         @font-face for the self-hosted fonts
  fonts/                Jost + Cormorant Garamond, latin subset (OFL, see OFL.txt)
  js/data.js            catalogue: products, collections, store, stock model
  js/journal-data.js    journal entries
  js/app.js             header, search, reserve list, product cards, reveals
  js/shop.js            filtering and sorting
  js/product.js         product detail page
  js/reserve.js         fitting-room page
  img/products/         one SVG per product colourway + a fabric detail
  img/editorial/        campaign imagery and the store map
tools/
  gen-images.mjs        regenerates everything under assets/img/products
```

### Imagery

All artwork is generated SVG — garment silhouettes on tonal grounds for
products, layered abstract compositions for editorial. Nothing is photography
and nothing is fetched from a third party, so the site is fully self-contained.
Replace the files in `assets/img/products/` with real photography (same
`<product-id>--<colour-id>.svg|jpg` naming, 4:5) when it exists.

To regenerate the artwork after editing the catalogue:

```bash
node tools/gen-images.mjs
```

### Inventory model

There is no backend, so stock is derived deterministically from a hash of
product / colour / size in `assets/js/data.js` (`stockFor`). The same counts
appear on every page and every visit. Swap `stockFor` for a fetch against a real
POS or inventory API and the rest of the UI works unchanged — it is the only
function that knows where stock comes from.

The reserve list is held in `localStorage` under `0803:reserve:v1`. Submitting a
hold is currently a client-side confirmation; wiring it to a real endpoint means
replacing the `#hold-form` submit handler in `assets/js/reserve.js`.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

A file:// open will not work, because pages read query strings and load sibling
scripts.

## Deploying

Any static host. For GitHub Pages, enable Pages on this branch and serve from
the repository root — `.nojekyll` is present so the `assets/` directory is
published as-is.

## Not built (by design)

Cart, checkout, payments, accounts, order history and any server-side code. The
brief was everything up to the point of sale, because the sale happens in the
store.
