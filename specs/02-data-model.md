# Data model

This document defines how Places, audio assets, and images are structured. The Place front-matter schema is a **contract**: Claude Code must conform to it when reading or writing data. Changes to the schema require a change to this document **first**, before any code is written.

## Source of truth

Each Place is a Markdown file in the Jekyll collection `_places/`. The file's YAML front-matter is the Place's data. The body of the file is currently unused; reserved for longer descriptions in v2.

Jekyll auto-generates a detail page at `/places/<id>/` for each file in `_places/`, using the `place` layout. The catalog page iterates `site.places` to render cards.

There is no database, no API, no CMS, no `places.json`.

## Sort order

Places render in this order:

1. `sortWeight` descending (higher values appear first).
2. Then `name` ascending (alphabetical, locale-aware) as a tie-breaker.

**In MVP the catalog order is hand-curated**, not alphabetical. Each of the 18 launch Places is assigned a unique `sortWeight` value reflecting its desired position. The strongest photographs go first.

**Recommended convention:** use sparse values like `1000`, `900`, `800`, … or `180`, `170`, `160`, …, leaving gaps so a new Place can be slotted between two existing ones without renumbering everything.

The same field will later carry v2 paid-promotion logic — featured Places will simply get higher `sortWeight` values than the rest. The mechanism is identical; the intent changes.

## Place front-matter schema

Every file in `_places/` has YAML front-matter with the following fields.

### Required fields

| Field         | Type    | Description                                                                                          |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `id`          | string  | URL-safe slug. Must match `^[a-z0-9-]+$`. Unique across the collection. **Must equal the filename without `.md`.** **Never change after release.** |
| `name`        | string  | Display name, 1–60 chars (e.g. `"Tokyo café"`). UTF-8, accented characters allowed.                  |
| `description` | string  | Atmospheric one- or two-sentence description, 20–200 chars. Plain text.                              |
| `images`      | object  | Hero and thumb. See "Images object" below.                                                           |
| `audio`       | string  | Path to the audio file, e.g. `/assets/places/tokyo-cafe/track.mp3`. MP3, ≤ 24 MB, 96 kbps target.    |
| `duration`    | number  | Track length in seconds (integer). Used for display and build-time sanity check.                     |
| `creator`     | object  | See "Creator object" below.                                                                          |

### Optional fields (with defaults)

| Field         | Type     | Default | Description                                                                                  |
| ------------- | -------- | ------- | -------------------------------------------------------------------------------------------- |
| `featured`    | boolean  | `false` | Reserved for v2 paid placement. Stored but ignored by the MVP UI.                            |
| `sortWeight`  | number   | `0`     | Controls catalog order — higher appears first. In MVP, hand-curated per Place; see "Sort order" above. |
| `tags`        | string[] | `[]`    | Free-form descriptive tags (e.g. `[café, indoor, urban, japan]`). Not surfaced in MVP UI.    |
| `source`      | string   | `null`  | URL of the original recording (Freesound page, SoundCloud track, etc.). Linked from the creator name on the detail page. Omit if not applicable. |
| `location`    | object   | `null`  | Geographic coordinates for the embedded map. See "Location object" below. Omit if unknown.   |

### Location object

Drives the consent-gated Google Maps embed on the detail page. Nothing from Google loads until the user explicitly clicks "Load map".

| Field   | Type   | Required | Description                                                              |
| ------- | ------ | -------- | ------------------------------------------------------------------------ |
| `lat`   | number | yes      | Latitude in decimal degrees (e.g. `35.6627`).                            |
| `lng`   | number | yes      | Longitude in decimal degrees (e.g. `139.6681`).                          |
| `label` | string | yes      | Short human-readable name shown in the consent placeholder (e.g. `"Shimokitazawa, Tokyo"`). |

```yaml
location:
  lat: 35.6627
  lng: 139.6681
  label: "Shimokitazawa, Tokyo"
```

### Images object

| Field   | Type   | Required | Description                                                                          |
| ------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `hero`  | string | yes      | Path to the detail-page hero image. WebP, ≥ 1600 × 1200, ≤ 400 KB.                   |
| `thumb` | string | yes      | Path to the catalog-card thumbnail. WebP, ≥ 600 × 450, ≤ 80 KB.                      |
| `alt`   | string | yes      | Alt text for both images (same alt is used in both contexts). 1–150 chars, describes the photo. |

### Creator object

| Field  | Type   | Required | Description              |
| ------ | ------ | -------- | ------------------------ |
| `name` | string | yes      | Display name or handle.  |

**Do not add `bio`, `avatar`, or `profilePath` in MVP.** Those belong in v2.

## Example Place file

`_places/tokyo-cafe.md`:

```yaml
---
id: tokyo-cafe
name: "Tokyo café"
description: "A small espresso bar in Shimokitazawa during the morning rush, with milk steamers and quiet conversation."
images:
  hero: /assets/places/tokyo-cafe/hero.webp
  thumb: /assets/places/tokyo-cafe/thumb.webp
  alt: "Wood-clad espresso bar with a barista pouring milk, soft morning light through the window"
audio: /assets/places/tokyo-cafe/track.mp3
duration: 1620
creator:
  name: fieldrecorder42
source: https://freesound.org/people/fieldrecorder42/sounds/12345/
location:
  lat: 35.6627
  lng: 139.6681
  label: "Shimokitazawa, Tokyo"
featured: false
sortWeight: 950
tags: [café, indoor, urban, japan]
---
```

The body of the file is empty in MVP.

## Project layout

```
travelier/
├── _config.yml
├── _includes/
├── _layouts/
│   ├── default.html
│   ├── catalog.html
│   └── place.html
├── _places/                      ← Jekyll collection: one .md per Place
│   ├── tokyo-cafe.md
│   ├── parisian-bistro.md
│   └── ...
├── assets/
│   ├── css/
│   ├── js/
│   └── places/                   ← media files per Place
│       ├── tokyo-cafe/
│       │   ├── hero.webp
│       │   ├── thumb.webp
│       │   └── track.mp3
│       └── ...
├── index.html                    ← catalog page (uses `catalog` layout)
├── scripts/
│   └── validate-places.js        ← see "Validation" below
├── CLAUDE.md
└── specs/
```

### `_config.yml` essentials

```yaml
collections:
  places:
    output: true
    permalink: /places/:name/
```

This makes each `_places/<id>.md` render at `/places/<id>/` and use the `place` layout (declared via `defaults` in `_config.yml` or per-file).

## How to add a new Place

1. Pick a slug for `id`. Lowercase letters, numbers, hyphens — no spaces, no punctuation.
2. Create `assets/places/<id>/` and add three files:
   - `hero.webp` (≥ 1600 × 1200, ≤ 400 KB)
   - `thumb.webp` (≥ 600 × 450, ≤ 80 KB)
   - `track.mp3` (≤ 24 MB, 96 kbps)
3. Create `_places/<id>.md` with the YAML front-matter from the example above. The file name must equal `id` + `.md`.
4. Run the validation script (see below) before committing.

**Claude Code must not modify layouts, the catalog template, or the player to support a new Place.** If adding a Place requires code changes, the schema is wrong and `02-data-model.md` needs revision first.

## What's intentionally not in the schema (and why)

- **No `slug` separate from `id`.** Same concept; two fields invite drift. The filename is also the same value — three places for one identifier would be three opportunities to drift.
- **No `category` or `mood`.** Use `tags` — flatter, more flexible, no taxonomy committee needed.
- **No `popularity` or `playCount`.** Would require analytics, which violates the no-tracking rule.
- **No `image` array with multiple sizes per device.** MVP uses exactly two sizes (hero, thumb). If we ever need 3+ responsive variants per Place, the schema gets a properly-structured `srcset` field — but not before.
- **No `createdAt` / `updatedAt` timestamps.** Git history is the source of truth for that.

## Schema versioning

The schema is currently **unversioned**. If a breaking change is needed post-launch:

1. Update this document with the new shape.
2. Migrate every file in `_places/` in the same commit.
3. Update `scripts/validate-places.js`.
4. Tag the commit clearly (e.g. `schema-v2`).

If breaking changes become frequent, add a `schemaVersion` field to each Place file and version the validator.
