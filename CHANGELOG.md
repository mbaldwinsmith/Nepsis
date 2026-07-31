# Changelog

All notable changes to Nepsis are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Nepsis does not yet follow Semantic Versioning strictly (it is pre-1.0), but
version numbers still increase monotonically and are shown in
**Settings → Nepsis v_x.y.z_**.

## [Unreleased]

### Added

- Every save now confirms itself with a toast: adding or updating a
  commitment (including marking one attended/cancelled/postponed and its
  reasons, notice, and after-effect), an observer entry, a medication, a
  logged dose, a transition event, and a health measurement. Commitment
  edits auto-save as you go, so their confirmation is debounced to one
  toast per burst of changes rather than one per click or keystroke.

### Fixed

- CSV export, encrypted backup creation, and delete-all-data now show an
  error toast if the operation itself fails, instead of failing silently
  with no feedback at all (only pre-flight validation, e.g. an empty
  category selection or a mismatched passphrase, was previously reported).

## [0.3.0] — 2026-07-29

### Added

- Past days can now be filled in or corrected: Home's new "Recent check-ins"
  list shows the last six days with a recorded/not-recorded status and a
  direct edit link, plus a "+ Fill in an earlier day" date picker for
  anything older. The check-in wizard clearly marks which day it's editing
  when it isn't today.

### Changed

- Replaced the placeholder favicon and app icons (a bright purple/violet
  mark that didn't match the app) with a new icon derived from the actual
  Nepsis mark — flat concentric arcs in the app's own slate-teal and
  off-white palette — covering the favicon, the 192/512 and maskable PWA
  icons, and the Apple touch icon.

## [0.2.0] — 2026-07-29

### Changed

- Presentation-only overhaul of the interface: word-labelled scales in place
  of raw numbers; the daily self-check-in is now a 12-step flow with a
  review screen, instead of one long form; Home is built around a single
  primary action and a "Last seven days" sparkline card; Trends adds a
  small-multiples grid covering all sixteen metrics; a persistent left-rail
  navigation appears at ≥900px alongside the existing mobile layout.
  **No data model changed**: `SCHEMA_VERSION` and `BACKUP_FORMAT_VERSION`
  are unchanged, no migration was added, every field reachable before this
  change remains reachable, and a backup taken before the overhaul restores
  cleanly after it.

## [0.1.0] — 2026-07-28

Initial MVP release. Nepsis is a local-first Progressive Web App for
tracking mood, behaviour, medication-transition effects, and selected
physical-health markers during a supervised medication transition.

### Added

- Daily self-check-in covering sleep, lunchtime nap behaviour, mood and
  activation, personalised early-warning signs, appetite and satiety,
  alcohol units, social activity and social drive, and medication and
  side-effect records.
- Plans and cancellations: recording commitments with friends, family,
  work, church, appointments, or volunteering, and distinguishing attended,
  attended briefly, postponed, cancelled, and did-not-attend outcomes,
  including healthy-boundary versus distress-related cancellation reasons.
- Separate observer check-ins, kept distinct from self-report so each
  perspective can be reviewed independently.
- Medication management and a medication-transition timeline (starts,
  stops, dose changes, delayed or missed doses, clinician appointments,
  blood tests, illness, and custom events).
- Health measurements (weight, waist circumference, resting pulse, blood
  pressure, and a set of laboratory markers) with optional laboratory
  reference ranges.
- A transparent, configurable, deterministic review-rule engine — every
  triggered review shows the rule, the date range, and the exact evidence
  records involved, and never diagnoses a condition or recommends a
  medication change.
- Trends: date-range and metric selection, charts kept visually modest,
  with plain-language pattern summaries.
- A personal safety plan (prescribing-team and trusted-contact lists,
  what "review" and "act" mean personally, and previously agreed
  instructions).
- CSV export with selectable date range, data categories, and free-text
  and observer-label inclusion.
- Encrypted backup and restore using a passphrase-derived key, AES-GCM
  authenticated encryption, and a versioned JSON envelope, validated
  record-by-record before import.
- Full delete-all-local-data action.
- Offline-capable PWA installation with an in-app update notice that never
  discards unsaved data.
- An optional privacy curtain that covers the interface when the app is
  resumed (not a substitute for device encryption or a screen lock).
- Accessibility groundwork: labelled controls, keyboard-operable scales,
  visible focus states, and an automated axe check across every route in
  both desktop and mobile viewports.
- Local-only storage throughout: no accounts, no cloud sync, no analytics,
  no advertising, and no network calls of any kind.

### Known limitations

See the README's "Known MVP limitations" section — most notably, records
are tied to the browser profile and device unless exported, and a
forgotten backup passphrase cannot be recovered.
