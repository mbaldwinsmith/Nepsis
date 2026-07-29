# Changelog

All notable changes to Nepsis are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Nepsis does not yet follow Semantic Versioning strictly (it is pre-1.0), but
version numbers still increase monotonically and are shown in
**Settings → Nepsis v_x.y.z_**.

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
