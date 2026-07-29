# Nepsis

A lightweight, private, local-first Progressive Web App for tracking mood, behaviour, medication-transition effects, and selected physical-health markers.

Nepsis is designed to help a person, their trusted supporters, and their clinicians notice meaningful changes during a supervised medication transition. It records observations and makes patterns easier to review without diagnosing conditions, predicting episodes, or recommending medication changes.

> Record small facts consistently; interpret patterns collaboratively.

## Project status

Nepsis's MVP is complete — all 15 phases in [`TASKS.md`](./TASKS.md) are implemented, tested, and merged. `TASKS.md` remains the authoritative acceptance-criteria record and the place to check what a given feature was actually built to satisfy; [`CHANGELOG.md`](./CHANGELOG.md) tracks releases. The current version is shown in **Settings → Nepsis v_x.y.z_**.

The MVP includes:

- daily self-check-ins;
- sleep and lunchtime nap tracking;
- mood and activation markers;
- personalised early-warning signs;
- appetite and satiety tracking;
- alcohol unit tracking;
- social activity and social-drive tracking;
- plans, attendance, postponements, and cancellations;
- medication and side-effect records;
- separate observer check-ins;
- weight, metabolic, and liver-function measurements;
- a medication-transition timeline;
- transparent, configurable review rules;
- a personal safety plan;
- CSV export;
- encrypted backup and restore;
- offline PWA support;
- local-only storage by default.

## Important safety boundary

Nepsis is not a diagnostic device and is not a substitute for clinical care.

It must not:

- diagnose mania, hypomania, depression, akathisia, addiction, or any other condition;
- claim that a medication caused a recorded change;
- predict an episode;
- advise a user to start, stop, increase, reduce, or otherwise change medication;
- invent emergency contacts or crisis instructions;
- interpret laboratory results beyond comparing them with a reference range supplied by the user.

Medication changes should only be made according to a plan agreed with the prescribing clinician. Urgent concerns should follow the user’s existing clinical, emergency, or crisis plan.

## Why Nepsis exists

Subtle changes in ordinary rhythms can sometimes be easier to recognise in retrospect than in the moment.

For one person, meaningful changes may include:

- sleeping less while feeling less need for sleep;
- no longer needing a usual lunchtime nap;
- becoming unusually socially driven;
- withdrawing from friends, work, church, or appointments;
- repeatedly cancelling plans because of distress;
- increased appetite or reduced satiety;
- inner restlessness;
- increased alcohol intake;
- unusual spending, gambling, eating, sexual, or other compulsive urges;
- changes noticed by trusted family or friends.

Nepsis records these signals separately and presents them transparently. It does not collapse them into a hidden mood score.

## Design principles

### Local first

Personal records are stored in IndexedDB in the user’s browser.

Nepsis has:

- no account requirement;
- no cloud sync;
- no analytics;
- no advertising;
- no behavioural tracking;
- no remote supporter portal;
- no AI interpretation.

### Calm, not gamified

Nepsis feels watchful rather than judgmental. It avoids streaks, badges, points, guilt language, alarmist colours, and labels such as “failed”, “flaky”, or “non-compliant”.

Missing data remains missing. It is never silently treated as a healthy value.

### Transparent

Every review prompt shows:

- the rule that triggered;
- the date range;
- the observations involved;
- whether the evidence came from self-report, observer report, commitments, medication records, or health measurements;
- the action text configured by the user.

### Personalised

The app supports individual baselines and warning signs rather than assuming that more sleep, less socialising, no naps, or zero alcohol is automatically better.

### Accessible

Nepsis aims for WCAG 2.2 AA where practical: keyboard-accessible controls, visible focus states, semantic structure, screen-reader labels, reduced-motion support, non-colour indicators, and text alternatives for charts.

## Core flows

### Daily self-check-in

The daily check-in is a 12-step stepped flow, each step answerable in one or
two taps, followed by a review screen before saving. A sticky header shows
`Step n of 12`, a back control, and `Save & close`, so a partial check-in can
be saved and resumed at any point.

Steps:

1. Sleep — last night
2. Sleep — falling asleep and waking
3. Sleep — daytime rest
4. Mood — how today felt
5. Mood — pace and drive
6. Personal warning signs
7. Daily rhythm — alcohol
8. Daily rhythm — other people
9. Appetite — eating
10. Appetite — urges
11. Medication and side effects
12. Optional note

The final review step lists what was recorded per step, with an `Edit` link
back to any step and an explicit `Not recorded` for anything left blank —
skipped fields are never saved as zero. Scale questions are word-labelled
(e.g. "none" to "severe") rather than shown as raw numbers; the stored value
underneath is unchanged. The app allows partial entries and later editing.

Check-ins aren't limited to today. Home's "Recent check-ins" list shows the
last six days with a recorded/not-recorded status and a direct edit link, and
a "+ Fill in an earlier day" date picker opens the same wizard for any earlier
date — useful for catching up after a missed day or two. The wizard header
names the day being edited whenever it isn't today.

### Plans and cancellations

The user can record commitments involving friends, family, work, church, appointments, volunteering, or other activities.

Possible outcomes include:

- attended;
- attended briefly;
- postponed;
- cancelled;
- did not attend.

The app distinguishes between nothing being planned, a healthy boundary, a commitment missed because of distress, and an essential commitment being missed.

### Observer check-in

Trusted supporters can record a short factual observation without their entry being merged into the user’s self-report.

> Describe what you observed, not what you think it means.

Observer entries may include perceived mood, speech, activity, irritability, restlessness, unusual behaviour, concern level, and an optional factual note.

### Medication and transition timeline

The timeline can combine medication starts and stops, dose increases and reductions, delayed or missed doses, clinician appointments, blood tests, illness, major stress, and custom events.

The interface always makes clear:

> Only change medication according to the plan agreed with your prescriber.

### Health measurements

Nepsis supports:

- weight;
- waist circumference;
- resting pulse;
- blood pressure;
- ALT;
- AST;
- ALP;
- GGT;
- bilirubin;
- HbA1c;
- glucose;
- total cholesterol;
- HDL;
- LDL;
- triglycerides.

Reference ranges are entered from the laboratory report. When a value falls outside the supplied range, the app says:

> Outside the supplied reference range — discuss with your clinician.

It must not interpret the result.

## Technical stack

- React 19 + TypeScript (strict)
- Vite 8
- React Router 7 (`HashRouter`, so GitHub Pages needs no server-side rewrite rules)
- Dexie 4 for IndexedDB
- Zod 4 for runtime validation
- `vite-plugin-pwa`
- A small plain-CSS design system (`src/styles/`) with light/dark tokens and
  a single 900px breakpoint (persistent left-rail navigation instead of the
  mobile bottom nav; the check-in flow stays single-column at every width)
- Vitest + React Testing Library
- Playwright + `@axe-core/playwright`
- oxlint + Prettier

Any new dependency should have a clear need — this stays a small, local-first app.

## Project structure

```text
src/
  app/                    App shell, routing, home page, update notice
  components/             Shared UI: AlertCard, ScaleInput, TrendChart, ToastProvider, ShowMoreList, ...
  data/
    db.ts                 Dexie database + table definitions
    migrations.ts         Migration history and process notes
    schemas/               Zod schemas + types, one file per entity
    repositories/          Validated CRUD functions — UI never calls Dexie directly
    backup/                Encrypted-backup envelope, creation, and restore
  features/
    check-in/               Daily self-check-in and its sections
    commitments/             Plans, attendance, and cancellations
    observers/                Observer check-ins
    medication/                Medication records and dose log
    health/                     Health measurements
    trends/                      Trend charts and pattern cards
    safety-plan/                  Personal safety plan
    data-management/               CSV export, backup, restore, delete-all
    settings/                       Settings, baseline editor, privacy curtain
    rules/                            Review-rule configuration screen
    install/                          Install-help screen
    privacy/                          Privacy summary screen
  rules/                  Alert-rule engine: evaluators, defaults, date-window helpers
  privacy/                Prohibited-wording list shared by the UI and its e2e check
  utils/                  Date helpers and other small shared utilities
public/
  icons/
e2e/                      Playwright specs (run across desktop and mobile viewports)
```

## Getting started

### Prerequisites

Recommended:

- Node.js 22 LTS or later
- npm 10 or later

```bash
node --version
npm --version
```

### Install dependencies

```bash
npm install
```

### Start development

```bash
npm run dev
```

### Run checks

```bash
npm run format
npm run lint
npm test
npm run test:e2e
npm run test:e2e:offline
npm run build
```

`test:e2e:offline` builds and serves the production bundle (the service
worker only registers outside dev mode) to verify installability and
offline behaviour — see Phase 11 in `TASKS.md`.

### Preview the production build

```bash
npm run preview
```

Keep this section aligned with the actual scripts in `package.json`.

### Deploying to GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys the app to GitHub
Pages automatically on every push to `main` (and via manual dispatch).

One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**. After that, pushes to `main` publish to
`https://<owner>.github.io/Nepsis/`.

GitHub Pages serves the app from that `/Nepsis/` subpath rather than the
domain root, which affects two things already handled for you:

- `vite.config.ts` sets `base: '/Nepsis/'` only when the workflow sets
  `GITHUB_PAGES=true` before building — local `dev`/`build`/`preview` and
  tests are unaffected and keep using `/`.
- The router runs in hash mode (`HashRouter`, so URLs look like
  `/#/check-in`) because a static host with no server-side rewrite rules
  can't route arbitrary paths like `/check-in` back to `index.html` on a
  hard refresh or direct link; the hash portion never leaves the browser,
  so no server configuration is needed.

To deploy elsewhere (a different static host, a custom domain, or a path
other than `/Nepsis/`), adjust the `base` value and the `GITHUB_PAGES` env
var name in `vite.config.ts` and the workflow accordingly.

## Environment configuration

Nepsis does not require secrets or a backend.

Do not add environment variables for analytics, advertising, user tracking, cloud databases, remote error reporting, or AI services.

Never commit secrets or real health data.

## Data storage

### IndexedDB

Structured personal data is stored locally using Dexie over IndexedDB.

Presentation components never call Dexie directly — they go through repository functions (`src/data/repositories/`), which keep validation centralised, migrations manageable, and persistence logic out of UI code.

### Schema versioning

The database (`src/data/db.ts`) currently holds 11 tables across two Dexie
`version()` blocks: version 1 shipped the 10 core entity tables, and
version 2 added `appPreferences` (device-local UI preferences, such as the
privacy curtain toggle — deliberately excluded from backup/restore since
it isn't portable personal data). Every persisted record also carries a
`schemaVersion` field from `SCHEMA_VERSION` (`src/data/schemas/shared.ts`),
currently `1` — this tracks the shape of individual records, independent of
the Dexie table-level version number above.

Database changes must include:

- a new Dexie `version()` block in `db.ts` (never edit a previously shipped
  block);
- an entry in `migrationHistory` (`src/data/migrations.ts`);
- a bump to `SCHEMA_VERSION` if the persisted record shape itself changed;
- a migration test in `src/data/__tests__/migrations.test.ts` covering
  upgrade from the previous version (see the existing
  "upgrades an existing version-1 database to version 2" test for the
  pattern);
- backup/restore compatibility consideration;
- a `CHANGELOG.md` entry.

### Missing data

Missing values must remain absent or `undefined`.

Do not:

- convert missing values to zero;
- include missing values in averages;
- interpolate over unrecorded days;
- assume no recorded symptom means no symptom.

## Main data domains

The complete field specification is in `TASKS.md`.

Primary entities include:

- `DailyCheckIn`
- `SocialCommitment`
- `ObserverEntry`
- `MedicationDefinition`
- `MedicationEntry`
- `TransitionEvent`
- `HealthMeasurement`
- `PersonalBaseline`
- `SafetyPlan`
- `AlertRule`

All persisted entities are validated with Zod before saving.

## Review-rule engine

Review prompts are deterministic and inspectable.

Each rule includes a stable identifier, label, description, enabled state, severity, lookback period, transparent conditions, action text, source, and version metadata.

The shipped default rules include patterns such as:

- reduced sleep plus increased activation;
- a change in normal lunchtime nap need;
- increased nap need plus low mood and social withdrawal;
- increased social drive plus faster speech or shorter sleep;
- repeated distress-related cancellations;
- an essential commitment missed because of distress;
- increased alcohol intake relative to baseline;
- increased inner restlessness;
- new or increased compulsive urges;
- repeated observer concern.

Allowed wording:

> Several of your agreed early-warning signs have changed.

> Your social rhythm differs from your recorded baseline.

> This pattern may be worth reviewing with someone from your support plan.

Prohibited wording:

> You are manic.

> You are becoming hypomanic.

> This is akathisia.

> Your medication is causing this.

## Privacy and security

### Default privacy model

Nepsis stores personal data locally, makes no unnecessary external requests, uses no remote fonts, and includes no analytics or trackers.

### Device security

Local browser storage is not a replacement for device encryption or a secure screen lock.

An optional privacy curtain hides the interface when the app resumes, if enabled, but it must not be described as database encryption.

### CSV export

CSV export lets the user choose:

- date range;
- included data categories;
- whether free-text notes are included;
- whether observer labels are included.

Exports use ISO dates, explicit units, separate files per category, and an accompanying data dictionary.

### Encrypted backup

Full backups (`src/data/backup/`) use:

- a versioned JSON envelope (`BACKUP_FORMAT_VERSION`, currently `1`) —
  versioned independently of the data `schemaVersion`, since the envelope
  shape and the record shapes inside it can change on different schedules;
- a PBKDF2 (SHA-256) passphrase-derived key;
- AES-GCM authenticated encryption;
- the Web Crypto API (no third-party crypto library);
- atomic restore — nothing is written to IndexedDB until every record has
  been parsed and validated;
- per-record Zod validation against each entity's real schema before
  import, so a corrupted or hand-edited backup is rejected with a precise
  error rather than partially imported.

The passphrase must never be stored.

> A forgotten backup passphrase cannot be recovered.

Do not describe the encryption as “military-grade”.

### Delete all data

Deletion removes IndexedDB records, local preferences, and cached personal data held by the app. The app cannot delete files the user has already exported to their device.

## Offline and PWA behaviour

After the first successful online visit, the core app works offline.

Offline-capable flows include:

- daily check-ins;
- commitments and cancellations;
- observer entries;
- medication records;
- health measurements;
- trends;
- safety plan;
- settings;
- export and backup generation.

App updates must not erase IndexedDB data, discard an unsaved form, or force an immediate reload without warning: the service worker registers in `registerType: 'prompt'` mode, and `src/app/UpdateNotice.tsx` shows a dismissible "A new version of Nepsis is ready" banner with an explicit "Refresh now" action — updates only apply when the user chooses to, never silently.

## Testing strategy

### Unit and component tests

`npm test` runs 160 Vitest tests across 29 files, covering validation
schemas, date calculations, weekly alcohol totals, baseline comparisons,
commitment summaries, reference-range display, rule evaluation,
missing-data handling, encryption and restore, database migrations
(including an upgrade test from a version-1 to version-2 database), scale
controls, conditional nap/alcohol/cancellation fields, medication statuses,
observer forms, alert evidence, safety-plan links, export selectors,
destructive-action confirmation, and IndexedDB query performance against
~5 years of synthetic data (`src/data/__tests__/performance.test.ts`).

### End-to-end tests

`npm run test:e2e` runs the Playwright suite in `e2e/` across both a
desktop (`chromium`) and a mobile (`mobile-chromium`, Pixel 7) project —
54 tests in total, covering:

1. Onboarding, baseline entry, and safety plan.
2. Completing and editing a daily check-in, including a nap/alcohol case.
3. Recording social activity and a distress-related cancellation.
4. Adding an observer entry.
5. Adding a medication dose change.
6. Adding a weight measurement and a liver-function result.
7. Triggering a review rule and inspecting its evidence.
8. Exporting CSV, creating an encrypted backup, deleting all data, and
   restoring from that backup.
9. An automated accessibility (axe) check across every route.

`npm run test:e2e:offline` runs a separate 4-test suite
(`playwright.offline.config.ts`) against the production build (the service
worker only registers outside dev mode) to verify installability and
offline behaviour.

e2e is not run in CI (`.github/workflows/deploy-pages.yml` runs format,
lint, `tsc`, `npm test`, and the production build only) — a deliberate
scoping decision, not an oversight.

Tests must not use real personal data.

## Accessibility checklist

Verified across the app (automated where noted, otherwise by manual review — see `e2e/accessibility.spec.ts` and `TASKS.md` §12/§15/§16):

- all form controls have labels;
- all scale controls work with a keyboard;
- focus order is logical;
- focus indicators are visible;
- touch targets are sufficiently large;
- colour is not the only source of meaning;
- charts have tables or textual equivalents;
- save and error states are announced;
- the app works with reduced motion;
- the app remains usable at 200% zoom;
- core flows work with a screen reader;
- core flows work at 320 px width;
- every route passes an automated axe check with zero violations, across both desktop and mobile viewports.

Re-verified after the Phase 16 presentation overhaul (12-step check-in,
word-labelled scales, trends small multiples, 900px desktop layout): the
axe sweep in `e2e/accessibility.spec.ts` now also visits all 12 check-in
steps, the review screen, and the trends compare card with metrics
selected, with zero violations on every one.

## Language and tone

Use UK spelling.

Preferred words:

- record
- observed
- changed
- review
- worth discussing
- support plan
- healthy boundary
- inner restlessness
- reduced need for sleep

Avoid:

- failed
- bad day
- non-compliant
- relapse detected
- manic
- hypomanic
- addicted
- dangerous result
- flaky
- unreliable

The app should be compassionate without becoming vague.

## Development workflow

1. Read `TASKS.md`.
2. Inspect the repository before editing.
3. Implement the smallest complete vertical slice.
4. Validate all persisted data.
5. Add or update tests with each feature.
6. Run formatting, linting, tests, and the production build.
7. Update documentation when behaviour changes.
8. Record meaningful deviations from the plan.
9. Never use real health data in fixtures, screenshots, or commits.

## Seed data

Development fixtures (`src/data/seed.ts`) are realistic but fictional.

They include examples of:

- a stable baseline;
- a possible activation pattern;
- a possible low-energy and withdrawal pattern;
- increased inner restlessness;
- increased appetite with reduced satiety;
- improved appetite and satiety;
- distress-related cancellations;
- healthy-boundary cancellations;
- observer concern;
- missing days.

Do not use the project owner’s real history, names, contacts, medication doses, or laboratory values.

## MVP non-goals

Do not implement these in the MVP:

- accounts;
- cloud sync;
- remote supporter logins;
- server-side background jobs;
- NHS, GP, pharmacy, or laboratory integrations;
- wearable integrations;
- AI-generated interpretations;
- predictive episode detection;
- automated diagnosis;
- automated medication advice;
- clinician dashboards;
- social feeds;
- public profiles;
- gamification;
- advertising;
- behavioural analytics;
- location tracking.

Do not build speculative infrastructure for these features.

## Release readiness

Verified for the 0.1.0 MVP release (see `TASKS.md` §15.3 for how each item
was checked):

- [x] Fresh install tested
- [x] Upgrade migration tested
- [x] Offline operation tested
- [x] CSV export tested
- [x] Encrypted backup tested
- [x] Restore tested
- [x] Delete-all tested
- [x] Accessibility reviewed
- [x] Mobile layout reviewed
- [x] No analytics or trackers present
- [x] No diagnostic claims present
- [x] No medication advice present
- [x] All tests pass
- [x] Production build succeeds
- [x] Schema version documented
- [x] Backup version documented
- [x] Known limitations documented
- [x] Release notes written

## Known MVP limitations

The local-first design means:

- data is tied to the browser profile and device unless exported;
- clearing browser storage may delete records;
- supporters cannot submit entries remotely;
- clinicians do not receive live updates;
- device compromise may expose locally stored records;
- a forgotten encrypted-backup passphrase cannot be recovered;
- the app cannot determine whether a recorded pattern is clinically significant;
- the app cannot provide emergency assistance.

These are intentional MVP boundaries rather than hidden shortcomings.

## Contributing

- open an issue before large architectural changes;
- keep pull requests focused;
- include tests;
- preserve local-first privacy;
- do not add telemetry;
- document schema changes;
- use fictional test data;
- explain any new medical-looking language;
- keep alerts deterministic and inspectable.

Any proposed feature that could change the app from a personal tracker into a clinical decision system requires explicit review before implementation.

## Licence

Nepsis is licensed under the GNU General Public License v3.0, or (at your option) any later version — see [`LICENSE`](./LICENSE) for the full text.

This means anyone may use, study, share, and modify Nepsis, provided that modified or redistributed versions remain under the same licence and make their source available.

## Documentation

- [`TASKS.md`](./TASKS.md) — full MVP implementation and polish plan
- [`CHANGELOG.md`](./CHANGELOG.md) — release history
- [`LICENSE`](./LICENSE) — GNU General Public License v3.0
- `README.md` — project overview and development guide

## Final principle

Nepsis should help the user and their supporters ask:

> What has changed, what evidence do we have, and who should we review it with?

It should never pretend to answer:

> What diagnosis does this prove, or how should medication be changed?
