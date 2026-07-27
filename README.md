# Nepsis

A lightweight, private, local-first Progressive Web App for tracking mood, behaviour, medication-transition effects, and selected physical-health markers.

Nepsis is designed to help a person, their trusted supporters, and their clinicians notice meaningful changes during a supervised medication transition. It records observations and makes patterns easier to review without diagnosing conditions, predicting episodes, or recommending medication changes.

> Record small facts consistently; interpret patterns collaboratively.

## Project status

Nepsis is currently an MVP project specification. The complete implementation plan and acceptance criteria are in [`TASKS.md`](./TASKS.md).

The intended MVP includes:

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

The MVP has:

- no account requirement;
- no cloud sync;
- no analytics;
- no advertising;
- no behavioural tracking;
- no remote supporter portal;
- no AI interpretation.

### Calm, not gamified

Nepsis should feel watchful rather than judgmental. It avoids streaks, badges, points, guilt language, alarmist colours, and labels such as “failed”, “flaky”, or “non-compliant”.

Missing data remains missing. It is never silently treated as a healthy value.

### Transparent

Every review prompt must show:

- the rule that triggered;
- the date range;
- the observations involved;
- whether the evidence came from self-report, observer report, commitments, medication records, or health measurements;
- the action text configured by the user.

### Personalised

The app supports individual baselines and warning signs rather than assuming that more sleep, less socialising, no naps, or zero alcohol is automatically better.

### Accessible

The MVP should aim for WCAG 2.2 AA where practical, including keyboard-accessible controls, visible focus states, semantic structure, screen-reader labels, reduced-motion support, non-colour indicators, and text alternatives for charts.

## Core flows

### Daily self-check-in

The daily check-in should take roughly one to two minutes.

Sections:

1. Sleep
2. Mood and activation
3. Personal warning signs
4. Daily rhythm
5. Appetite and satiety
6. Medication and side effects
7. Optional note

The app should allow partial entries and later editing.

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

The interface must always make clear:

> Only change medication according to the plan agreed with your prescriber.

### Health measurements

The MVP supports:

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

Reference ranges are entered from the laboratory report. When a value falls outside the supplied range, the app may say:

> Outside the supplied reference range — discuss with your clinician.

It must not interpret the result.

## Intended technical stack

For a fresh implementation:

- React
- TypeScript
- Vite
- React Router
- Dexie for IndexedDB
- Zod for runtime validation
- `vite-plugin-pwa`
- CSS Modules or a small plain-CSS design system
- Vitest
- React Testing Library
- Playwright

Use existing repository conventions where they are sensible. Do not introduce a new framework or large dependency without a clear need.

## Suggested project structure

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    AlertCard.tsx
    CheckInCard.tsx
    ScaleInput.tsx
    TrendChart.tsx
  data/
    db.ts
    migrations.ts
    repositories/
    schemas.ts
  features/
    check-in/
    commitments/
    observers/
    medication/
    health/
    trends/
    safety-plan/
    export/
    settings/
  rules/
    alertEngine.ts
    defaultRules.ts
  privacy/
    encryptedBackup.ts
  styles/
public/
  icons/
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
npm run build
```

### Preview the production build

```bash
npm run preview
```

Keep this section aligned with the actual scripts in `package.json`.

## Environment configuration

The local-first MVP should not require secrets or a backend.

Do not add environment variables for analytics, advertising, user tracking, cloud databases, remote error reporting, or AI services.

Never commit secrets or real health data.

## Data storage

### IndexedDB

Structured personal data is stored locally using Dexie over IndexedDB.

Presentation components should not call Dexie directly. Use repository or service functions so that validation remains centralised, migrations remain manageable, and persistence logic stays out of UI code.

### Schema versioning

Every persisted record and full backup should be associated with a schema version.

Database changes must include:

- a Dexie migration;
- validation updates;
- migration tests;
- backup compatibility consideration;
- release notes.

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

All persisted entities should be validated with Zod before saving.

## Review-rule engine

Review prompts are deterministic and inspectable.

A rule should include a stable identifier, label, description, enabled state, severity, lookback period, transparent conditions, action text, source, and version metadata.

Example patterns may include:

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

The MVP should store personal data locally, make no unnecessary external requests, use no remote fonts, and include no analytics or trackers.

### Device security

Local browser storage is not a replacement for device encryption or a secure screen lock.

An optional privacy curtain may hide the interface when the app resumes, but it must not be described as database encryption.

### CSV export

CSV export should allow the user to choose:

- date range;
- included data categories;
- whether free-text notes are included;
- whether observer labels are included.

Exports should use ISO dates, explicit units, separate files or clearly namespaced columns, and a data dictionary.

### Encrypted backup

Full backups should use:

- a versioned JSON envelope;
- a passphrase-derived key;
- authenticated encryption;
- the Web Crypto API;
- atomic restore;
- validation before import.

The passphrase must never be stored.

> A forgotten backup passphrase cannot be recovered.

Do not describe the encryption as “military-grade”.

### Delete all data

Deletion should remove IndexedDB records, local preferences, and cached personal data held by the app. The app cannot delete files the user has already exported to their device.

## Offline and PWA behaviour

After the first successful online visit, the core app should work offline.

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

App updates must not erase IndexedDB data, discard an unsaved form, or force an immediate reload without warning.

## Testing strategy

### Unit tests

Cover validation schemas, date calculations, weekly alcohol totals, baseline comparisons, commitment summaries, reference-range display, rule evaluation, missing-data handling, encryption and restore, and database migrations.

### Component tests

Cover scale controls, conditional nap and alcohol fields, cancellation details, medication statuses, observer forms, alert evidence, safety-plan links, export selectors, and destructive confirmation.

### End-to-end tests

Critical flows:

1. Complete onboarding.
2. Create and edit a daily check-in.
3. Record nap need and nap behaviour.
4. Record alcohol units.
5. Record social activity.
6. Record a distress-related cancellation.
7. Add an observer entry.
8. Add a medication transition event.
9. Add weight and laboratory measurements.
10. Trigger and inspect a review rule.
11. Export CSV.
12. Create an encrypted backup.
13. Delete all local data.
14. Restore the backup.
15. Reload and use the app offline.

Tests must not use real personal data.

## Accessibility checklist

Before release, verify:

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
- core flows work at 320 px width.

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

Development fixtures should be realistic but fictional.

Include examples of:

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

Before an MVP release:

- [ ] Fresh install tested
- [ ] Upgrade migration tested
- [ ] Offline operation tested
- [ ] CSV export tested
- [ ] Encrypted backup tested
- [ ] Restore tested
- [ ] Delete-all tested
- [ ] Accessibility reviewed
- [ ] Mobile layout reviewed
- [ ] No analytics or trackers present
- [ ] No diagnostic claims present
- [ ] No medication advice present
- [ ] All tests pass
- [ ] Production build succeeds
- [ ] Schema version documented
- [ ] Backup version documented
- [ ] Known limitations documented
- [ ] Release notes written

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

Until a separate contribution guide exists:

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

No licence has yet been selected.

Until a licence file is added, all rights are reserved by the project owner and the repository should not be assumed to be open source.

## Documentation

- [`TASKS.md`](./TASKS.md) — full MVP implementation and polish plan
- `README.md` — project overview and development guide
- Future:
  - `CONTRIBUTING.md`
  - `PRIVACY.md`
  - `SECURITY.md`
  - `CHANGELOG.md`

## Final principle

Nepsis should help the user and their supporters ask:

> What has changed, what evidence do we have, and who should we review it with?

It should never pretend to answer:

> What diagnosis does this prove, or how should medication be changed?
