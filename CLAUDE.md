# Travelier — Ambient focus sounds

## What this is

A static, photo-driven website that plays ambient sounds from real-world busy places (cafés, libraries, train stations) to help people focus while working from home. No accounts. No backend. Inspired by research that mild ambient noise aids concentration.

## Design philosophy

**Photos do the heavy lifting.** Travelier is a visual product as much as an audio one. Big, high-quality photographs of each Place are what make the user feel "I am there." Every UI decision should serve the photo, not compete with it. Type is restrained. Chrome is minimal. The image is the experience.

## Stack

- **Static site generator: Jekyll.** Ruby-based. Idiomatic Jekyll patterns (collections, layouts, includes) are preferred over custom logic.
- No backend, no database, no auth, no analytics.
- Hosted on **Cloudflare Pages**.
- No JS framework. Plain JavaScript only, kept minimal — used only for the audio player on the detail page.

## UX model — multi-page

- `/` — **catalog page.** Grid of Place cards, each a photograph + name. Tapping a card navigates to the detail page.
- `/places/<id>/` — **detail page.** Hero image, name, description, creator credit, and the audio player. Audio plays only here.
- **No persistent player.** Leaving the detail page (back navigation, opening another Place) stops playback. This is deliberate, not a limitation.

## Audio constraints (hard)

- Format: MP3, 96 kbps target.
- Max file size: **22 MB** per track (safety margin under Cloudflare Pages' 25 MB per-file limit).
- Tracks loop automatically when they end. **Never** auto-advance to a different Place.
- `<audio>` elements use `preload="none"`. No audio loads until the user explicitly presses play on the detail page.

## Image constraints (hard)

Two images per Place. Both WebP. Both required.

- **Hero** (detail page): minimum 1600 × 1200, **≤ 400 KB**.
- **Thumb** (catalog card): minimum 600 × 450, **≤ 80 KB**.

Thumbnails on the catalog page below the fold use `loading="lazy"`.

## Build & run

```sh
bundle install         # first time only
bundle exec jekyll serve   # local dev server at http://localhost:4000
bundle exec jekyll build   # production build into _site/
```

Cloudflare Pages build command: `bundle exec jekyll build`. Output directory: `_site`.

## Terminology — use these consistently

- **Place** — the unit of content. A real-world atmospheric location with name, description, hero photo, thumb photo, creator, and one audio track.
- **Track** — the audio file associated with a Place.
- **Player** — the audio playback UI on the detail page (only).
- **Creator** — the person who recorded or contributed the track.
- **Catalog** — the list of all Places shown on the home page.

Do not use *scene*, *soundscape*, *ambience*, *room*, *location*, or *spot* interchangeably. Pick *Place* and stick to it everywhere — code, copy, file names, commit messages.

## Rules

1. **Mobile-first.** Build and test at narrow viewport before desktop.
2. **No accounts, ever.** If a feature seems to need login, the feature is wrong for this product.
3. **No runtime third-party dependencies**, with one explicit exception: **Google Fonts CDN** is used for the typefaces defined in the design system (Zilla Slab, Merriweather, Playfair Display SC). These are loaded with `font-display=swap` so they do not block rendering and the site degrades gracefully to system serif fallbacks. No other external APIs, analytics scripts, or CDNs are permitted.
4. **No JS framework.** Plain JavaScript only. Used only for the audio player. If a feature seems to need React/Vue/Alpine, the feature is wrong.
5. **Performance budget:**
   - HTML + CSS + JS gzipped: ≤ 100 KB.
   - Above-the-fold catalog thumbs: ≤ 600 KB total.
   - Below-the-fold thumbs: lazy-loaded.
   - Hero image on detail page: ≤ 400 KB.
   - Audio: loaded only on user action.
6. **Semantic HTML and `alt` text are mandatory.** Use `<button>` for buttons, `<nav>`, `<main>`, `<article>` for landmarks. Every image has an `alt` attribute. This is not an a11y deliverable — it's basic HTML hygiene. It also helps SEO.
7. **Ask before adding any dependency.** Default to web-platform APIs and Jekyll built-ins.
8. **Read the relevant file in `specs/` before writing feature code.** If a spec is missing or ambiguous, ask — don't invent.
9. **Adding a Place must not require code changes.** New Places ship via a new `_places/<id>.md` file + assets in `assets/places/<id>/`. If a Place needs code, the data model is wrong — update `specs/02-data-model.md` first.
10. **Commit messages reference the spec** they implement (e.g. `feat(player): play/pause control per specs/features/player.md`).

## Specs

- `specs/00-vision.md` — what this product is and isn't
- `specs/01-scope.md` — MVP scope, user stories, acceptance criteria
- `specs/02-data-model.md` — Place schema (Jekyll collection front-matter) and asset layout
- `specs/features/` — per-feature specs *(TBD)*

## What's intentionally **not** in MVP

- Accessibility beyond semantic HTML + alt text (no keyboard parity, no screen-reader audit)
- Persistent player / cross-page playback
- Creator profile pages
- Featured / starred Places (paid placement)
- PWA / offline install
- Analytics of any kind

These belong in v2 or never. See `00-vision.md` § "Out of scope" for the full list.
