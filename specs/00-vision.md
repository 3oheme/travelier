# Vision

## Problem

People working from home — and anyone struggling to focus on tedious or low-motivation tasks — often lack the mild environmental stimulation that aids concentration. Research suggests moderate ambient noise, like the buzz of a coffee shop, improves focus and creative performance. Silence and full isolation can be counterproductive for many.

## Who it's for

**Primary user.** Remote workers and freelancers who work from home and feel under-stimulated, distracted, or unmotivated.

**Secondary user.** Anyone who needs a nudge to start a boring task — students, writers, anyone with a deadline and a wandering mind.

The user does **not** need to:
- Create an account
- Install anything
- Pay
- Choose between dozens of options

## What the product does

A simple, photo-driven website. The user lands on a catalog of Places — each presented as a beautiful photograph. They tap one, arrive at that Place's detail page, see a large hero image, read a one-sentence description, and press play. The audio loops until they leave the page.

Travelier is as much a visual product as an audio one. The photo is what makes the user feel they're sitting in that Parisian bistro or that Tokyo café. Without the photo, it's just a sound file.

## What success looks like (MVP)

Success is qualitative, not metric-driven:

- The maintainer (and one or two friends) reach for Travelier during their own work sessions instead of Spotify or YouTube.
- It works on phone, laptop, and tablet without thinking about it.
- The photographs feel cared-for, not stock.
- Adding a new Place takes ten minutes: create one markdown file, drop three assets in a folder, commit.

## Why this exists (and why now)

Existing apps in this space — Coffitivity (dead), Noisli (mixer-heavy, paywalled), A Soft Murmur, Endel — are either gone, bloated with subscription paywalls, or over-designed with features the maintainer doesn't want. They also treat sound as the only signal and ignore the visual side entirely. The opportunity is a tiny, fast, free-forever static site that does two things well: a beautiful photo and the sound that goes with it.

## Out of scope for the MVP

Explicitly **not** building any of these in v1, no matter how tempting:

- Accounts, profiles, sync, favourites that persist across devices
- Mixing multiple tracks (rain + café + keyboard). One track at a time.
- Continuing audio playback across pages (a persistent / mini player)
- Timers, pomodoro, productivity tracking
- A native mobile app
- User-submitted Places or voting
- Comments, social features, sharing
- Video backgrounds, parallax, motion-heavy hero treatments
- Spatial / binaural audio
- Offline install (PWA)
- Monetization of any kind
- **Accessibility beyond semantic HTML and alt text** (full keyboard parity and screen-reader work are explicitly deferred — see `01-scope.md`)
- Creator profile pages (planned for v2 — see below)
- Featured / starred Places (planned for v2 — see below)
- Analytics

If any of these come up later, they go in a separate `v2-ideas.md` — not the MVP scope.

## Long-term direction (informational — not v1)

This section exists so v1 architectural decisions don't paint us into a corner. **Nothing here is built in MVP.**

- **Creator profiles.** Once the catalog has external contributors, each Creator gets a small profile page (avatar, bio, list of their Places, optional links). The Place detail page surfaces the Creator more prominently. *Implication for MVP:* the `creator` field in the Place schema is already an object, not a string. Adding a Creator profile later is additive, not a migration.
- **Featured Places (paid).** Businesses that want their venue represented in the catalog can pay to appear, and possibly with visual prominence ("starred"). *Implication for MVP:* the Place schema already includes `featured` (boolean) and `sortWeight` (number) fields, defaulting to `false` and `0`. The UI ignores them in v1.
- **Full accessibility.** Keyboard parity, ARIA labelling of the player, screen-reader audit. The semantic HTML + alt-text baseline in v1 keeps this cheap to add later.

These directions are why the data model in `specs/02-data-model.md` looks slightly over-specified for the MVP. That's deliberate. Static front-matter is cheap to extend; schema migrations are not.

## Initial catalog

18 audio tracks are sourced and licensed, ready to populate the `_places/` collection. Each will become one Place at launch.
