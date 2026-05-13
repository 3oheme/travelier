# Travelier

**Ambient sounds from real places, to help you focus.**

[travelier.app](https://travelier.app) — a small, photo-driven website that plays looping ambient audio from real-world locations: cafés, train stations, rainy streets. No accounts. No tracking. No nonsense.

---

## What it is

Built by someone who's a bit obsessed with background sounds. There's something about the hum of a busy café or the crackle of a fireplace that helps you get into the zone — whether you're coding, reading, writing, or just trying to quiet your head. Every audio file is a genuine field recording, not AI-generated or synthetically blended.

Browse a catalog of Places, tap one, and press play. The audio loops until you leave. That's it.

## Stack

- **Jekyll** static site — no backend, no database, no auth
- **Cloudflare Pages** hosting
- Plain HTML, CSS, and a small vanilla JS audio player
- No JS framework, no build pipeline, no dependencies beyond Jekyll

## Running locally

```sh
bundle install          # first time only
bundle exec jekyll serve --livereload
```

Open `http://localhost:4000`.

## Adding a Place

1. Pick a slug (`lowercase-letters-and-hyphens`).
2. Create `assets/places/<slug>/` and add:
   - `hero.webp` — ≥ 1600 × 1200, ≤ 400 KB
   - `thumb.webp` — ≥ 600 × 450, ≤ 80 KB
   - `track.mp3` — ≤ 24 MB, 96 kbps
3. Create `_places/<slug>.md` with this front-matter:

```yaml
---
id: your-slug
name: "Place Name"
description: "One or two atmospheric sentences, 20–200 chars."
images:
  hero: /assets/places/your-slug/hero.webp
  thumb: /assets/places/your-slug/thumb.webp
  alt: "Describe the photo."
audio: /assets/places/your-slug/track.mp3
duration: 1800
creator:
  name: creatorhandle
source: https://freesound.org/...
location:
  lat: 48.8566
  lng: 2.3522
  label: "Paris, France"
sortWeight: 500
tags: [indoor, café, urban, france]
---
```

No code changes needed. The catalog and detail pages pick it up automatically.

## Privacy

Fully static and GDPR-compliant. No cookies, no analytics, no fingerprinting. Maps are served by OpenStreetMap — no Google, no consent gate required.

## License

Code: MIT. Audio recordings retain their original licenses — see each Place's `source` field for the original file and its terms.
