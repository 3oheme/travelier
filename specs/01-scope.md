# MVP scope

This document defines exactly what ships in v1 and the acceptance criteria for each user-facing capability. It does not override `00-vision.md` § "Out of scope".

## UX model — multi-page

Travelier is a **two-template site**:

- **Catalog page** at `/` — a responsive grid of Place cards. **Each card is the thumbnail photo with a caption beneath**: Place name (primary), creator name (secondary, smaller). Tapping anywhere on the card navigates to that Place's detail page. No audio plays on this page.
- **Detail page** at `/places/<id>/` — **full-bleed hero photo at the top of the viewport**, with the Place name, description, attribution (if required), and audio player stacked beneath it. This is the only page where audio plays.

**No persistent player. No cross-page playback.** Navigating away (back, opening another Place, closing the tab) stops audio. The user chose to be in *this* Place; leaving the page is leaving the Place. This is a deliberate product decision, not a technical limitation.

## End-of-track behaviour

Each track **loops automatically** when it ends. The user does not need to interact for ambient sound to continue indefinitely. Travelier **never** auto-advances to a different Place.

## Catalog sort order

**Hand-curated, not alphabetical.** Places appear in an order chosen by the maintainer to lead with the strongest photographs. Order is controlled per-Place via the `sortWeight` field in the front-matter (higher value = earlier in the catalog). See `02-data-model.md` § "Sort order" for the mechanics.

## Responsive breakpoints

| Breakpoint     | Viewport width    | Catalog columns | Notes                                              |
| -------------- | ----------------- | --------------- | -------------------------------------------------- |
| **Phone**      | ≤ 600 px          | 1 column        | Cards span full width. Hero on detail is full bleed. |
| **Tablet**     | 601 – 1024 px     | 2 columns       | Hero on detail page fills viewport width.          |
| **Desktop**    | ≥ 1025 px         | 3 columns       | Hero on detail page fills viewport width; text content has a max width for readability. |

## User stories

### US-01 — Browse the catalog

**Given** I open Travelier
**When** the page loads
**Then** I see every Place rendered as a card with its thumbnail photo, with the Place name and creator name in a caption beneath the photo
**And** Places appear in the order defined by `sortWeight` descending
**And** initial HTML + CSS + JS gzipped is under 100 KB
**And** above-the-fold thumbnails sum to under 600 KB
**And** below-the-fold thumbnails use `loading="lazy"`
**And** no audio file has been requested

### US-02 — Open a Place

**Given** the catalog is visible
**When** I tap a Place card
**Then** the browser navigates to that Place's detail page at `/places/<id>/`
**And** the detail page renders the hero image full-bleed at the top of the viewport
**And** the Place name, description, attribution (if any), and audio player are stacked beneath the hero
**And** the audio player is visible but not yet playing
**And** the hero image is under 400 KB
**And** no audio file has been requested yet

### US-03 — Start playback

**Given** I'm on a Place's detail page
**When** I tap the player's play control
**Then** that Place's audio begins streaming
**And** the play control changes to a pause control
**And** the audio file is fetched only at this moment (not on page load)

### US-04 — Pause and resume

**Given** a Place is playing
**When** I tap the pause control
**Then** audio pauses immediately
**When** I tap play again
**Then** audio resumes from where it stopped

### US-05 — Adjust volume

**Given** a Place is playing
**When** I move the volume control
**Then** audio volume changes immediately
(Volume does **not** need to persist across reloads or page navigations in MVP — that would require storage and is deferred.)

### US-06 — Continuous playback (loop)

**Given** a Place has been playing
**When** the track reaches its end
**Then** it loops back to the beginning and continues playing seamlessly
**And** no user action is required

### US-07 — Leave a Place

**Given** a Place is playing
**When** I navigate away (back button, link to another Place, close tab)
**Then** audio stops
**And** if I return to that Place later, the player starts at the beginning of the track, paused

### US-08 — Responsive layout

**Given** I'm on a phone, tablet, or desktop (any viewport width)
**When** I open the catalog or a detail page
**Then** the layout matches the breakpoints table above without horizontal scroll
**And** every interactive element has a tap target of at least 44 × 44 px on phone and tablet
**And** the hero image on the detail page fills the viewport width elegantly at every breakpoint

### US-09 — Source credit

**Given** a Place has a `source` URL in its front-matter
**When** I view the detail page
**Then** the creator name is a clickable link to that source URL
**And** the link opens in a new tab

## Non-functional requirements

- **Browser support:** current and previous stable versions of Chrome, Firefox, Safari, Edge on desktop; iOS Safari and Chrome on Android.
- **Audio format:** MP3 at 96 kbps, each file ≤ 24 MB.
- **Image format:** WebP for both hero and thumb. Hero ≤ 400 KB, ≥ 1600 × 1200. Thumb ≤ 80 KB, ≥ 600 × 450.
- **Initial page weight (HTML + CSS + JS, gzipped):** ≤ 100 KB.
- **Above-the-fold catalog images:** ≤ 600 KB total. Below-the-fold uses `loading="lazy"`.
- **Audio load behaviour:** no audio file is fetched until the user presses play. `<audio>` elements use `preload="none"`.
- **Time-to-interactive on the catalog page:** ≤ 2 seconds on a simulated 4G connection.
- **Lighthouse mobile profile (catalog page):** Performance ≥ 90, Best Practices ≥ 90, SEO ≥ 90. Accessibility score is explicitly **not gated** in MVP (see Definition of Done).
- **Semantic HTML and alt text:** mandatory. Not as an a11y deliverable — as basic HTML hygiene and for SEO. Use `<button>`, `<nav>`, `<main>`, `<article>` correctly. Every image has a meaningful `alt`.

## Definition of Done

The MVP is "done" when all of these are true:

1. All nine user stories above pass their acceptance criteria.
2. All launch Places are added to the `_places/` collection with valid hero + thumb + audio assets and a hand-curated `sortWeight` value.
3. The site is deployed to a public URL on Cloudflare Pages.
4. Lighthouse mobile scores meet the thresholds in Non-functional requirements (a11y excluded).
5. Manual smoke test passes on at least one real iOS device and one real Android device.
6. `README.md` documents how to add a new Place (steps mirror `specs/02-data-model.md`).
7. Every Place with a `source` URL has a linked creator credit on its detail page.
