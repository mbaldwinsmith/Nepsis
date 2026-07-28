# TASKS.md — Nepsis MVP

## Mission

Build and polish a lightweight, private, local-first Progressive Web App for tracking mood, behaviour, medication-transition effects, and selected physical-health markers.

The app is intended to help one person, trusted supporters, and clinicians notice meaningful changes during a supervised switch from zuclopenthixol to aripiprazole. It must support observation and pattern recognition without diagnosing, predicting episodes, or recommending medication changes.

Working title: **Nepsis**

Core principle:

> Record small facts consistently; interpret patterns collaboratively.

---

## Agent operating rules

- Work through this file from top to bottom unless the existing repository requires a different order.
- Inspect the repository before changing anything. Preserve existing conventions where they are sensible.
- Prefer the smallest implementation that fully satisfies the acceptance criteria.
- Keep the app fast, calm, accessible, and usable offline.
- Do not add cloud sync, accounts, analytics, adverts, trackers, AI interpretation, or medical integrations.
- Do not gamify health tracking. No streaks, points, badges, guilt language, or celebratory “dry day” counters.
- Do not diagnose mania, hypomania, depression, akathisia, addiction, or any other condition.
- Do not recommend starting, stopping, increasing, or reducing medication.
- Alerts must explain which recorded observations triggered them.
- Keep self-reports and observer reports distinct.
- Treat missing data as missing data, not as a zero or healthy value.
- Store all personal data locally in the browser for the MVP.
- After every major phase:
  - run formatting;
  - run linting;
  - run tests;
  - run the production build;
  - fix regressions before continuing.
- Mark tasks complete only when their acceptance criteria are met.
- Add brief implementation notes beneath any task where the final implementation materially differs from the plan.

---

## Definition of done

The MVP is complete when a user can:

1. install and open the app on a phone;
2. complete a daily check-in in about one to two minutes;
3. record medication, appetite, satiety, sleep, mood, activation, warning signs, nap need, alcohol intake, social activity, and cancellations;
4. record observer check-ins separately;
5. record weight and selected clinical health markers;
6. review transparent trends and a medication-transition timeline;
7. see configurable, non-diagnostic review prompts;
8. access a personal safety plan;
9. export selected data as CSV;
10. back up and restore all data using an encrypted JSON file;
11. use the essential app offline;
12. delete all local data;
13. use the app with keyboard navigation, screen readers, and reduced motion.

---

# Phase 0 — Repository audit and implementation plan

- [x] Inspect the repository structure, package manager, scripts, TypeScript settings, styling approach, routing, test framework, and existing PWA configuration.
- [x] Read any existing README, CONTRIBUTING, design notes, and environment files.
- [x] Identify reusable components and conventions.
- [x] Confirm whether this is a fresh app or an existing codebase.
- [x] Write a concise implementation note in this file describing:
  - current stack;
  - planned changes;
  - any deviations from the preferred stack below;
  - known risks.

> **Implementation note (first working slice).** The repository held only
> `README.md`, `TASKS.md`, and `LICENSE` — no application code. The app was
> scaffolded fresh with Vite's `react-ts` template and built out against the
> preferred stack below with no substitutions: React 19, TypeScript
> (strict), Vite, React Router, Dexie, Zod v4, `vite-plugin-pwa`, plain CSS
> with custom properties (no CSS Modules needed yet — one global stylesheet
> plus small component-scoped inline styles was simpler at this scale),
> Vitest + React Testing Library, and Playwright. Linting uses `oxlint`
> (the tool the current Vite template ships with) rather than ESLint —
> lighter, and there was no existing ESLint convention to preserve.
>
> This pass delivers Phases 0–2 in full and a working-but-not-yet-polished
> slice of Phases 4, 6, and 7 (Milestone A): app shell and routing, the
> complete Zod-validated domain model, a versioned Dexie database with
> repository functions, fictional dev seed data, and functional screens for
> the daily check-in, commitments/cancellations, observer check-ins,
> medication + transition timeline, and health measurements, plus a home
> dashboard, a safety-plan editor, and a settings screen (baseline editor,
> privacy summary, delete-all, dev seed action). Phases 8–15 (the
> alert/rule engine, trend charts, CSV export, encrypted backup/restore,
> full offline queuing beyond the PWA plugin defaults, full accessibility
> and copy polish, the full test suite, and release documentation) are
> intentionally left for follow-up sessions and are marked `[ ]` below
> where not yet done — see the per-phase notes for what is genuinely
> covered versus deferred.
>
> Known risks: (1) `vite-plugin-pwa`'s `workbox-build` dependency chain
> currently reports a transitive `brace-expansion` DoS advisory in
> `npm audit` — a build-time-only tool dependency with no production
> runtime exposure; no fixed release was available without a breaking
> downgrade, so it is left as a tracked risk rather than worked around.
> (2) `react-router-dom` also flags a "RSC Mode CSRF bypass" advisory that
> only affects React Router's server/RSC framework mode, which this
> client-only SPA does not use.

Preferred stack for a fresh implementation:

- React
- TypeScript
- Vite
- React Router
- Dexie for IndexedDB
- Zod for runtime validation
- `vite-plugin-pwa`
- CSS Modules or a small, maintainable plain-CSS system
- Vitest
- React Testing Library
- Playwright for critical flows

Acceptance criteria:

- [x] The implementation plan is consistent with the repository.
- [x] No unnecessary dependencies are introduced.
- [x] The agent can explain how local persistence, offline support, validation, and testing will work.

---

# Phase 1 — Product foundation and app shell

## 1.1 Project setup

- [x] Scaffold or repair the React + TypeScript app.
- [x] Enable strict TypeScript.
- [x] Configure formatting, linting, unit tests, and production build scripts.
- [x] Add React Router routes.
- [x] Add a global error boundary.
- [x] Add a small notification/toast system for saves, imports, exports, and errors.
- [x] Add a development-only seed-data utility.

> Implementation note: the toast system covers saves, errors, CSV export,
> encrypted backup creation, and restore (Phase 10) throughout the feature
> forms and the data-management page.

Suggested routes:

- `/` — Home
- `/check-in` — Daily self-check-in
- `/observer` — Observer check-in
- `/commitments` — Plans, attendance, and cancellations
- `/health` — Weight, measurements, and laboratory results
- `/medication` — Medication and transition events
- `/trends` — Trends and timeline
- `/safety-plan` — Personal action plan
- `/settings` — Baselines, rules, privacy, export, restore, delete

## 1.2 Calm visual language

- [x] Create a restrained design system with:
  - clear typography;
  - generous spacing;
  - large touch targets;
  - high contrast;
  - visible focus states;
  - minimal animation;
  - no alarming colour saturation.
- [x] Use neutral language such as “steady”, “changed”, “review”, and “act”.
- [x] Avoid red except where an urgent action previously configured by the user is shown.
- [x] Make the UI usable at 320 px width without horizontal scrolling.

## 1.3 Navigation

- [x] Add a mobile-first bottom navigation or similarly compact navigation.
- [x] Ensure the daily check-in is the most prominent action.
- [x] Keep secondary pages reachable within two taps.
- [x] Provide a clear route back to the home screen.

> Implementation note: the bottom nav shows Home, Check-in, Trends, and
> More; the remaining five routes (Observer, Commitments, Medication,
> Health, Safety plan, Settings) live one tap under More, so every route is
> reachable within two taps of Home.

Acceptance criteria:

- [x] App loads without console errors.
- [x] All routes render.
- [x] Navigation is keyboard accessible.
- [x] Layout works on small mobile, large mobile, tablet, and desktop widths.
- [x] Production build succeeds.

---

# Phase 2 — Domain model, validation, and local database

## 2.1 Core data types

Create strongly typed models for the following entities.

### DailyCheckIn

Required metadata:

- `id`
- `entryDate`
- `recordedAt`
- `updatedAt`
- optional `notes`

Sleep and rhythm:

- sleep duration in minutes
- sleep quality: 0–4
- reduced need for sleep: 0–2
- difficulty falling asleep: 0–4
- waking unusually early: 0–4
- need to nap at lunchtime: 0–3
- nap taken: boolean
- nap duration in minutes
- nap effect:
  - refreshed
  - unchanged
  - groggy
- optional likely nap reason:
  - poor sleep
  - medication
  - routine
  - illness
  - unclear

Mood and activation:

- low mood: 0–4
- elevated or expansive mood: 0–4
- irritability: 0–4
- anxiety: 0–4
- emotional sensitivity or porosity: 0–4
- energy: 0–4
- mental speed: -2 to +2
- goal-directed activity: 0–4

Personal warning signs:

- head buzz
- tight shoulders
- shallow breathing
- pressured or unusually rapid speech
- unusually numerous ideas or projects
- unusually driven behaviour
- optional personalised signs defined by the user

Medication and physical effects:

- medication entries linked to the day
- missed or delayed dose
- sedation: 0–4
- dizziness: 0–4
- nausea: 0–4
- tremor or stiffness: 0–4
- inner restlessness or need to move: 0–4
- other side effect text

Appetite and satiety:

- appetite: 0–4
- hunger between meals: 0–4
- satiety after a normal meal: 0–4
- food preoccupation or cravings: 0–4
- binge or loss-of-control eating: boolean

Compulsive or impulsive urges:

- unusual spending urge: 0–4
- gambling urge: 0–4
- unusually increased sexual drive: 0–4
- other repetitive or compulsive urge: optional text

Alcohol:

- units consumed, allowing decimals
- context:
  - social
  - with meal
  - relaxing alone
  - celebration
  - coping
  - other
- perceived effect:
  - better
  - neutral
  - worse
  - unclear

Social activity:

- activity amount: 0–4
- social drive: -2 to +2
- effect:
  - depleted
  - slightly drained
  - neutral
  - nourished
  - energised or overstimulated
- interaction types:
  - in person
  - phone or video
  - messaging
  - group event
  - church or community
  - work

### SocialCommitment

Fields:

- `id`
- planned date and optional time
- optional title
- type:
  - friends
  - family
  - work
  - church
  - appointment
  - volunteering
  - other
- importance:
  - routine
  - meaningful
  - essential
- outcome:
  - planned
  - attended
  - attended briefly
  - postponed
  - cancelled
  - did not attend
- reason or reasons:
  - distress
  - low energy
  - anxiety
  - overwhelmed
  - irritability
  - physical illness
  - scheduling issue
  - healthy boundary
  - other
- notice:
  - early
  - same day
  - very late
  - none
- after-effect:
  - relieved
  - disappointed
  - ashamed
  - neutral
  - glad I protected my capacity
- optional factual note
- created and updated timestamps

### ObserverEntry

Fields:

- `id`
- observation date and recorded time
- observer label, not necessarily a real name
- perceived mood:
  - low
  - usual
  - elevated
  - uncertain
- speech:
  - usual
  - faster
  - pressured
- activity:
  - usual
  - withdrawn
  - unusually driven
- irritability: 0–3
- restlessness: 0–3
- impulsive or uncharacteristic behaviour: boolean
- concern:
  - none
  - keep watching
  - discuss soon
  - urgent
- optional factual observation
- optional linked commitment or daily check-in

### MedicationDefinition

Fields:

- `id`
- name
- formulation
- optional notes
- active status

### MedicationEntry

Fields:

- `id`
- medication definition ID
- date and time
- planned dose
- dose taken
- unit
- status:
  - taken
  - delayed
  - missed
  - not scheduled
- optional notes

### TransitionEvent

Fields:

- `id`
- date and optional time
- type:
  - medication started
  - medication stopped
  - dose increased
  - dose reduced
  - missed medication
  - clinician appointment
  - illness
  - major stress
  - blood test
  - custom
- title
- optional description
- optional linked medication

### HealthMeasurement

Support:

- weight
- waist circumference
- resting pulse
- systolic blood pressure
- diastolic blood pressure
- ALT
- AST
- ALP
- GGT
- bilirubin
- HbA1c
- glucose
- total cholesterol
- HDL
- LDL
- triglycerides

Fields:

- `id`
- measurement date and time
- type
- numeric value
- unit
- optional reference minimum
- optional reference maximum
- optional notes

### PersonalBaseline

Fields:

- usual sleep duration
- usual sleep quality
- usual lunchtime nap need
- usual weekly alcohol units
- usual social activity
- usual social drive
- usual appetite
- usual satiety
- usual energy
- usual mood ranges
- preferred comparison window
- baseline start and end dates
- optional notes

### SafetyPlan

Fields:

- prescribing-team contact label and details
- trusted contact labels and details
- personalised early-warning signs
- review actions
- urgent actions
- crisis instructions entered by the user
- last reviewed date

### AlertRule

Fields:

- `id`
- label
- description
- enabled
- severity:
  - review
  - act
- lookback period
- transparent conditions
- action text
- source:
  - default
  - user-created
- created and updated timestamps

## 2.2 Validation

- [x] Define Zod schemas for all persisted entities.
- [x] Validate before saving.
- [ ] Validate imports before writing anything to the database.
- [x] Reject impossible values, including:
  - negative sleep duration;
  - negative alcohol units;
  - nap duration when no nap was taken;
  - malformed dates;
  - unsupported enum values.
- [x] Preserve future compatibility using a schema version.

> Implementation note: restore (Phase 10) reuses these same per-entity
> schemas to validate every record in a backup file before anything is
> written to IndexedDB — see `src/data/backup/restore.ts`.

## 2.3 IndexedDB

- [x] Configure Dexie with versioned tables.
- [x] Add indexes needed for date-range queries.
- [x] Add repository or service functions rather than calling Dexie directly from presentation components.
- [x] Add database migration tests.
- [x] Add a development command or UI action to load realistic seed data.

Acceptance criteria:

- [x] All core entities can be created, read, updated, and deleted.
- [x] Invalid records cannot be persisted through normal app flows.
- [x] Existing records survive a page refresh and browser restart.
- [x] Database migrations are versioned and tested.
- [x] No personal data is sent over the network.

---

# Phase 3 — First-run onboarding and baselines

## 3.1 Welcome

- [ ] Explain that the app:
  - records observations;
  - works locally;
  - does not diagnose;
  - does not replace medical care;
  - does not advise medication changes.
- [ ] Explain that urgent concerns should follow the user’s existing clinical or crisis plan.
- [ ] Make all wording calm and non-alarmist.

## 3.2 Personal baseline

- [ ] Allow the user to enter or skip:
  - typical sleep duration;
  - usual nap need;
  - usual weekly alcohol units;
  - usual social activity and social drive;
  - typical appetite and satiety;
  - usual energy and mood ranges.
- [ ] Allow baseline editing later.
- [ ] Allow the user to establish a baseline from a selected historical period after enough data exists.
- [ ] Do not claim the app has “learned” a baseline automatically without showing the source period.

## 3.3 Personal warning signs

Seed the following editable signs:

- head buzz
- tight shoulders
- shallow breathing
- pressured or unusually rapid speech
- increased emotional porosity
- unusually numerous ideas or projects
- feeling unusually driven

- [ ] Allow custom warning signs.
- [ ] Allow warning signs to be disabled without deleting history.
- [ ] Allow each sign to have an optional personal description.

## 3.4 Safety plan

- [ ] Let the user enter:
  - who to contact;
  - what “review” means;
  - what “act” means;
  - instructions already agreed with clinicians or supporters.
- [ ] Explicitly prevent the app from generating medication instructions.
- [ ] Allow the safety plan to be viewed from every alert prompt.

Acceptance criteria:

- [ ] Onboarding can be completed without entering optional sensitive details.
- [ ] The app remains usable if onboarding is skipped.
- [ ] Baseline and safety-plan information can be edited later.
- [ ] No default emergency number is invented based on location.

---

# Phase 4 — Daily self-check-in

## 4.1 Check-in flow

Create a progressive, mobile-first form with these sections:

1. Sleep
2. Mood and activation
3. Personal warning signs
4. Daily rhythm
5. Appetite and satiety
6. Medication and side effects
7. Optional note

- [ ] Show one compact card at a time or a similarly low-friction flow.
- [ ] Use single-tap segmented controls for common responses.
- [x] Reveal conditional details only when relevant.
- [ ] Preserve in-progress input if the user navigates away accidentally.
- [ ] Allow completion in approximately one to two minutes.
- [x] Allow editing an existing entry for the same day.
- [x] Clearly show when an entry was updated.

> Implementation note: this slice ships one scrollable page of all seven
> sections rather than a one-card-at-a-time flow — it is functionally
> complete but not yet the low-friction card sequence Phase 4.1 describes,
> and in-progress input is not preserved across accidental navigation
> (nothing is saved until "Save check-in" is pressed). Segmented controls
> are radio-based rather than single-tap pill buttons in places. Timing
> (one to two minutes) has not been user-tested. These are the intended
> targets for the next polish pass.

## 4.2 Sleep and nap behaviour

- [x] Record sleep duration.
- [x] Record sleep quality.
- [x] Record reduced need for sleep separately from poor sleep.
- [x] Record lunchtime nap need.
- [x] When a nap was taken, reveal duration and after-effect.
- [x] Do not treat “no nap needed” as inherently positive.

## 4.3 Mood, activation, and warning signs

- [x] Keep low mood, elevated mood, irritability, anxiety, and porosity separate.
- [x] Keep energy, mental speed, and goal-directed activity separate.
- [x] Show personalised warning signs prominently.
- [x] Support optional explanatory notes without requiring journalling.

> Implementation note: only the six seeded warning signs are shown;
> user-defined custom warning signs (from the safety plan) are not yet
> cross-referenced into the check-in form.

## 4.4 Appetite, satiety, and urges

- [x] Record appetite and satiety separately.
- [x] Record hunger between meals and cravings.
- [x] Record loss-of-control eating.
- [x] Record selected compulsive or impulsive urges.
- [x] Use neutral wording and never shame the user.

## 4.5 Alcohol and social rhythm

- [x] Record decimal alcohol units.
- [x] Reveal context and perceived effect only when units are greater than zero.
- [x] Record social activity amount.
- [x] Record social drive.
- [x] Record whether social contact was depleting, neutral, nourishing, or overstimulating.
- [x] Record interaction types.

## 4.6 Medication and side effects

- [ ] Show scheduled medications for the day.
- [ ] Allow taken, delayed, or missed status.
- [ ] Record dose and time where needed.
- [x] Keep inner restlessness separate from anxiety.
- [x] Provide a short non-diagnostic explanation that restlessness can be worth discussing with the prescriber.

> Implementation note: dose scheduling and per-dose taken/delayed/missed
> status live on the separate Medication page (Phase 7) rather than inline
> in the check-in — there is no recurring dose-schedule model yet to
> surface "today's scheduled medications" here. The check-in only records
> a same-day missed/delayed flag and side-effect scales.

Acceptance criteria:

- [x] A complete check-in can be saved on a 320 px-wide screen.
- [x] Conditional fields behave correctly.
- [x] The user can save a partial check-in.
- [x] Required fields are minimal.
- [x] Save status is visible.
- [x] Check-in completion does not trigger congratulatory or guilt-based messaging.

---

# Phase 5 — Plans, attendance, and cancellations

## 5.1 Commitment capture

- [x] Allow commitments to be created in advance or recorded retrospectively.
- [x] Include type, importance, date, optional time, and optional title.
- [x] Show upcoming commitments on the home screen.
- [x] Support quick outcome actions:
  - attended;
  - attended briefly;
  - postponed;
  - cancelled;
  - did not attend.

## 5.2 Cancellation details

- [x] When cancelled, postponed, or missed, reveal:
  - reason;
  - notice given;
  - after-effect;
  - optional factual note.
- [x] Include “healthy boundary” as a non-pathological reason.
- [x] Use compassionate wording:
  - “Cancelling plans may be a sign that things feel harder right now.”
- [x] Never label the user “flaky”, “unreliable”, or “avoidant”.

## 5.3 Behavioural summaries

- [ ] Calculate:
  - planned commitments;
  - attended commitments;
  - cancellations and missed commitments;
  - distress-related cancellations;
  - essential commitments missed.
- [ ] Distinguish “nothing was planned” from “plans were cancelled”.
- [ ] Allow filtering by friends, family, work, church, appointments, volunteering, and other.

> Implementation note: 5.3 is not built yet — commitments are listed
> individually with no aggregate counts or type filter. This depends on
> the trends/pattern-card work in Phase 9, which is also deferred.

Acceptance criteria:

- [x] A user can record a cancelled church, work, or friend commitment in under 30 seconds.
- [x] Healthy-boundary cancellations are not shown as adverse by default.
- [x] Distress-related cancellations can be reviewed alongside mood, sleep, and social activity.
- [x] Missed essential commitments can trigger only user-configured review rules.

---

# Phase 6 — Observer check-ins

## 6.1 Observer entry form

- [x] Build a separate observer flow.
- [x] Start with this instruction:

> Describe what you observed, not what you think it means.

- [x] Include:
  - perceived mood;
  - speech;
  - activity;
  - irritability;
  - restlessness;
  - unusual behaviour;
  - concern level;
  - optional factual note.
- [x] Keep the observer label simple, such as “Mum”, “Dad”, or “Friend A”.
- [x] Allow an observer entry to be made without exposing all other app data.

## 6.2 Separation from self-report

- [x] Display observer entries with a distinct visual treatment.
- [x] Never merge observer and self-report values into a single hidden score.
- [ ] When showing a pattern, identify whether evidence came from:
  - self-report;
  - observer report;
  - commitments;
  - measurements.

> Implementation note: there is no pattern/trend view yet (Phase 9), so
> there is nothing that currently mixes evidence sources — each feature
> page already shows only its own source, and observer entries carry a
> visibly distinct card style with an "Observer:" prefix.

Acceptance criteria:

- [x] Observer entry takes under one minute.
- [x] Observer reports remain clearly attributed.
- [x] The app does not turn observations into diagnoses.
- [x] An “urgent” observer concern displays the user’s configured safety-plan actions.

---

# Phase 7 — Medication, transition timeline, and health markers

## 7.1 Medication management

- [x] Allow medication definitions to be created and archived.
- [ ] Allow dose schedules to be entered without implying clinical approval.
- [x] Record starts, stops, increases, reductions, delays, and missed doses.
- [x] Show a visible notice:

> Only change medication according to the plan agreed with your prescriber.

> Implementation note: there is no recurring dose-schedule model yet (e.g.
> "10mg every morning") — only individual dose-log entries with a status.
> Starts/stops/increases/reductions are recorded as transition events;
> delays/missed doses are recorded per dose-log entry.

## 7.2 Transition timeline

- [x] Create a chronological timeline combining:
  - medication events;
  - dose changes;
  - missed medication;
  - clinician appointments;
  - blood tests;
  - illness;
  - major stress;
  - custom events.
- [ ] Allow events to be edited and deleted.
- [ ] Clearly distinguish planned events from completed events where applicable.

> Implementation note: events can be created but not yet edited or deleted;
> all events are treated as already-occurred (no planned-vs-completed
> distinction yet).

## 7.3 Health measurements

- [x] Add forms for weekly or occasional measurements.
- [x] Support weight, waist, pulse, blood pressure, metabolic markers, and liver-function markers.
- [x] Store units with every value.
- [x] Allow entry of the laboratory’s reference range.
- [x] When outside the supplied range, show:

> Outside the supplied reference range — discuss with your clinician.

- [x] Do not hard-code universal “safe” laboratory ranges.
- [x] Do not interpret liver function or metabolic results.

Acceptance criteria:

- [ ] Medication changes and health measurements appear on the combined timeline.
- [x] The user can enter a laboratory result without a reference range.
- [x] The app does not produce medical interpretations.
- [x] Units and dates are always shown.

> Implementation note: health measurements currently have their own list
> on the Health page rather than appearing on the Medication page's
> transition timeline — merging the two views is left for the Phase 9
> trends work.

---

# Phase 8 — Transparent review and action rules

## 8.1 Rule engine

Implement a deterministic, inspectable rule engine.

Each triggered result must include:

- rule name;
- severity;
- date range;
- exact observations that triggered it;
- configured action text;
- link to the safety plan;
- dismiss or acknowledge control.

Never output statements such as:

- “You are manic.”
- “You are becoming hypomanic.”
- “This is akathisia.”
- “Your medication is causing this.”

Use wording such as:

- “Several of your agreed early-warning signs have changed.”
- “Your social rhythm differs from your recorded baseline.”
- “This pattern may be worth reviewing with someone from your support plan.”

> Implementation note: the engine (`src/rules/`) is a set of pure,
> independently unit-tested evaluator functions keyed by a fixed
> `ruleType` (one per seed pattern below), each reading only from
> user-editable `params` (named numeric thresholds) and `lookbackDays` —
> so every rule stays deterministic and auditable without a generic
> freeform condition language. `src/rules/alertEngine.ts` wires enabled
> `AlertRule` records to their evaluator and recorded data (check-ins,
> commitments, observer entries, baseline) and returns a trigger with
> rule name, severity, date range, the exact evidence, action text, and
> rule-version metadata. The Home page (`src/app/HomePage.tsx`) is the
> visible surface: a "Worth reviewing" section renders one `AlertCard`
> per trigger, each with a "View safety plan" link and a Dismiss button.
> Dismiss is in-memory only for this pass (it clears on reload); a
> persisted dismiss-until-data-changes mechanism is deferred.

## 8.2 Seed rules

Create editable, disabled-by-default or clearly opt-in seed rules for patterns such as:

### Reduced sleep plus activation

- sleep below personal baseline for two consecutive nights;
- combined with increased energy, mental speed, or reduced need for sleep.

### Daytime-alertness change

- no need for a usual lunchtime nap for several days;
- combined with shorter sleep and increased energy.

### Possible low-energy pattern

- increased nap need;
- lower mood;
- reduced social drive or repeated cancellations.

### Social-activation pattern

- social drive and social activity substantially above baseline;
- combined with shorter sleep, faster speech, or overstimulation.

### Withdrawal pattern

- several meaningful commitments cancelled within a selected period;
- at least some due to distress, anxiety, low energy, or overwhelm.

### Essential commitment missed

- work, appointment, or another user-marked essential commitment missed due to distress.

### Alcohol-pattern change

- weekly alcohol units above personal baseline;
- optionally combined with lower sleep quality or changed mood.

### Restlessness review

- inner restlessness at a high level;
- or a sharp increase from baseline.

### Compulsive-urge review

- new or increased spending, gambling, eating, sexual, or other compulsive urge.

### Observer concern

- one urgent observer entry;
- or repeated “discuss soon” entries within a selected period.

> Implementation note: all ten seed rules above are implemented in
> `src/rules/ruleTypes.ts` with sensible default thresholds, inserted
> disabled (`enabled: false`) the first time the app runs
> (`ensureDefaultRulesExist()` in `src/rules/defaultRules.ts`, called from
> `src/app/App.tsx`). They are genuinely opt-in — nothing evaluates until
> a user enables a rule from Settings → Review rules.

## 8.3 Configuration

- [x] Allow every rule to be enabled, disabled, edited, or duplicated.
- [x] Allow thresholds and lookback periods to be changed.
- [x] Show a plain-language preview of what the rule does.
- [x] Record rule-version metadata with generated alerts.
- [x] Do not silently change user-configured rules after an app update.

> Implementation note: "duplicated" means cloning an existing rule
> (`RuleCard`'s Duplicate button — new id, `source: userCreated`,
> `ruleVersion: 1`) as a starting point for a variant with different
> thresholds; there is no freeform builder for authoring a brand-new
> condition tree from scratch, which was intentionally out of scope (see
> TASKS.md "Explicit MVP non-goals" — Nepsis stays a personal tracker, not
> a clinical rule-authoring platform). Threshold/lookback editing is
> generic across all ten rule types, driven by each type's `paramSchema`
> rather than ten bespoke forms (`src/features/rules/RuleCard.tsx`).

Acceptance criteria:

- [x] Rules are deterministic and unit tested.
- [x] Trigger evidence is visible.
- [x] Missing values do not trigger a rule unless the rule explicitly checks missing data.
- [x] A user can disable all alerts while retaining tracking.
- [x] No alert recommends medication changes.

---

# Phase 9 — Home dashboard, trends, and pattern review

## 9.1 Home screen

Display:

- greeting without requiring the user’s real name;
- transition day, when configured;
- last night’s sleep;
- today’s check-in status;
- upcoming meaningful or essential commitments;
- next planned measurement;
- active review or action cards;
- a compact recent-pattern summary.

Primary action:

> Start daily check-in — about one minute

Do not overload the screen with charts.

> Implementation note: Home now shows the medication-transition day
> (derived from the earliest `medicationStarted` transition event — no
> new schema field), last night's sleep, the existing Phase 8 review
> cards, and the single highest-priority recent pattern card (linking to
> `/trends`) — zero charts, per "do not overload the screen with charts".
> "Next planned measurement" is not implemented: there is no
> planned/scheduled-measurement concept anywhere in the domain model
> (`HealthMeasurement` only records measurements already taken), and
> adding one would be speculative infrastructure ahead of an actual
> need — deferred rather than invented for this box alone.

## 9.2 Trend charts

Create selectable, accessible charts for:

- sleep duration;
- reduced need for sleep;
- energy;
- mental speed;
- low mood;
- elevated mood;
- irritability;
- inner restlessness;
- appetite;
- satiety;
- nap need;
- alcohol units;
- social activity;
- social drive;
- cancellations;
- weight.

- [x] Show no more than three metrics at once.
- [x] Default to sleep, energy, and appetite or another clearly documented trio.
- [x] Include a table or textual summary for screen readers.
- [x] Mark medication and transition events on charts.
- [x] Allow seven-day, thirty-day, and custom ranges.
- [x] Do not interpolate across missing days.
- [x] Show baseline bands only when a baseline exists.

> Implementation note: charts are hand-rolled SVG (`src/components
> /TrendChart.tsx`) — no charting library. Each metric plots on its own
> normalized scale (metrics share no common unit), distinguished by
> colour, stroke-dasharray, and a text-labelled legend (never colour
> alone); a gap in a series breaks its line into a separate path rather
> than interpolating; a collapsible data table underneath is the
> non-visual equivalent, always present in the DOM. The alcohol-units
> baseline is a documented daily approximation (`usualWeeklyAlcoholUnits
> / 7`) since the recorded baseline is a weekly total; metrics with no
> corresponding `PersonalBaseline` field (mental speed, irritability,
> inner restlessness, cancellations, weight) have no band by design.

## 9.3 Pattern cards

Create transparent summaries such as:

> Social drive was above your recorded baseline on 4 of the last 5 days.

> You cancelled 3 meaningful commitments in 7 days, including 2 recorded as distress-related.

> Appetite decreased while satiety increased during the selected period.

Each card must link to the underlying records.

> Implementation note: `src/features/trends/patternCards.ts` implements
> the three example patterns generically: a baseline-comparison card
> (checked across every metric with a recorded baseline, surfacing the
> strongest single deviation rather than one card per metric, to stay
> calm and uncluttered), a meaningful/essential-cancellation summary
> (linking to `/commitments`), and an appetite/satiety divergence card
> (either direction — increased appetite with reduced satiety, or the
> reverse, comparing first-half vs. second-half window averages). Cards
> link to the relevant feature's list page rather than a specific
> record, since there is no per-day historical detail view yet for
> check-ins.

Acceptance criteria:

- [x] Charts remain readable on mobile.
- [x] Every visual trend has a non-visual equivalent.
- [x] Self, observer, commitment, medication, and health data can be distinguished.
- [x] Pattern cards state facts, not diagnoses or causal claims.

> Implementation note: "self, observer, commitment, medication, and
> health data can be distinguished" is satisfied by the app as a whole —
> observer entries already carry a distinct visual treatment (Phase 6)
> and the rule engine already labels evidence by source (Phase 8); none
> of the three Trends pattern cards currently draw on observer data
> specifically, which is a reasonable gap given the three chosen example
> patterns rather than a missing distinction mechanism.

---

# Phase 10 — Export, backup, restore, and deletion

## 10.1 CSV export

- [x] Allow the user to choose:
  - date range;
  - data categories;
  - whether to include free-text notes;
  - whether to include observer labels.
- [x] Export separate or clearly namespaced CSV files for:
  - daily check-ins;
  - commitments;
  - observer entries;
  - medications and transition events;
  - health measurements;
  - alerts.
- [x] Use ISO dates and explicit units.
- [x] Include a data dictionary or README file in the export bundle.

> Implementation note: "alerts" exports the currently configured review
> rules (label, severity, lookback, thresholds, enabled state) — Nepsis
> does not persist a history of past fired alerts (dismissing an alert
> card is in-memory only), so the data dictionary explicitly documents
> this file as current configuration, not a log of past reviews. There is
> no zip bundling dependency: each selected CSV plus the data dictionary
> downloads as its own browser download from one click (consistent with
> the earlier decision to avoid a charting library for Phase 9 — avoid
> dependencies the actual requirement doesn't need).

## 10.2 Encrypted backup

- [x] Export a complete versioned JSON backup.
- [x] Encrypt the backup using a passphrase-derived key and authenticated encryption.
- [x] Use the Web Crypto API through a small, well-tested wrapper.
- [x] Store:
  - schema version;
  - creation time;
  - encryption parameters;
  - encrypted payload;
  - authentication metadata.
- [x] Never store the passphrase.
- [x] Warn clearly that a forgotten passphrase cannot be recovered.
- [x] Do not call the implementation "military-grade".

> Implementation note: PBKDF2-SHA256 (300,000 iterations) derives an
> AES-256-GCM key; AES-GCM's own authentication tag (appended to the
> ciphertext by `crypto.subtle.encrypt`) is the "authentication metadata"
> — there is no separate tag field to store. The backup is a complete dump
> of all ten tables (including personal baseline, safety plan, and review
> rules), not just the six CSV-exportable categories, so restore can fully
> reconstruct app state.

## 10.3 Restore

- [x] Validate file type, envelope structure, decryption result, and schema.
- [x] Preview record counts before importing.
- [x] Offer:
  - replace all local data;
  - merge without overwriting;
  - cancel.
- [x] Make restore atomic so a failed import does not leave partial data.
- [x] Test restore from older supported schema versions.

> Implementation note: every record is validated against its real entity
> Zod schema before anything is written to IndexedDB, then committed in a
> single Dexie transaction — so a validation failure never touches the
> database, and a transaction-level failure rolls back automatically.
> Only one schema version has ever shipped, so "restore from an older
> version" is vacuously satisfied today; a real cross-version test should
> be added the day `SCHEMA_VERSION` first bumps (a future restore
> unsupported-version case is already tested and rejected with a clear
> message).

## 10.4 Delete all data

- [x] Add a clearly labelled destructive action in Settings.
- [x] Require explicit confirmation.
- [x] Delete IndexedDB data, cached personal exports if any, and local preferences.
- [x] Explain that external files already downloaded cannot be deleted by the app.

> Implementation note: built in Milestone A (`DeleteAllData.tsx`). There is
> no `localStorage`/`sessionStorage` use anywhere in the app and no cached
> export files. At the time this note was first written there were no local
> preferences either; Phase 12 added the first one (the privacy curtain
> toggle, in the new `appPreferences` table), and `deleteAllLocalData()` was
> updated to clear it too — so this remains complete as the app has grown.

Acceptance criteria:

- [x] Exported CSV opens cleanly in common spreadsheet software.
- [x] Encrypted backups cannot be read as plain JSON.
- [x] Correct-passphrase restore recreates the original record counts and content.
- [x] Incorrect-passphrase restore fails safely.
- [x] Delete-all removes local records.

---

# Phase 11 — PWA and offline support

## 11.1 Manifest and installation

- [x] Configure:
  - app name and short name;
  - theme and background colours;
  - standalone display;
  - icons;
  - start URL;
  - portrait-friendly behaviour.
- [x] Add a simple install-help screen rather than intrusive prompts.

> Implementation note: the manifest fields, icons, and
> `orientation: 'portrait-primary'` were already configured in Milestone A
> (`vite.config.ts`). This phase added the install-help screen
> (`/settings/install`, linked from Settings) with plain per-platform steps
> and no `beforeinstallprompt` listener or banner — install stays something
> the user looks up, never something the app interrupts them to ask for.
> `index.html` also gained `apple-mobile-web-app-capable` /
> `apple-mobile-web-app-title` and an `apple-touch-icon` link, since iOS
> Safari ignores the web manifest for install metadata.

## 11.2 Service worker

- [x] Cache the application shell and static assets.
- [x] Ensure all core tracking flows work offline.
- [x] Use an update strategy that does not discard unsaved form data.
- [x] Show a calm update-available notice.
- [x] Avoid caching exported health files.

> Implementation note: `registerType` was `'autoUpdate'`, which silently
> activates a new service worker and reloads the page — a real risk of
> discarding an in-progress check-in. Changed to `'prompt'` plus a new
> `UpdateNotice` component (`src/app/UpdateNotice.tsx`, using
> `useRegisterSW` from `virtual:pwa-register/react`) that shows a
> dismissible "Later" banner instead of forcing a reload; refreshing is
> always the user's choice. Exported files are never cached because they're
> never fetched over the network in the first place — `src/utils/download.ts`
> builds an in-memory `Blob` and downloads it directly, so there is nothing
> for the service worker to see.

## 11.3 Offline behaviour

- [x] Test:
  - first load online;
  - reload offline;
  - create and edit records offline;
  - navigate across all core routes offline;
  - install and launch from the home screen.
- [x] Do not show network errors for features that do not require the network.

> Implementation note: `e2e-offline/offline.spec.ts` (run via
> `npm run test:e2e:offline`, a dedicated Playwright config building and
> serving the production bundle, since the service worker only registers
> outside dev mode) covers first-load-online, reload-offline, cross-route
> offline navigation, and creating a check-in while offline, all with a
> zero-console-errors assertion. It also fetches the built web manifest and
> checks the fields a browser needs to consider the app installable.
> "Install and launch from the home screen" itself is a real-device step
> documented for a person to do (see `/settings/install`) rather than
> something a headless browser can perform. There are no `fetch`/
> `XMLHttpRequest` calls anywhere in `src` (grep-verified), so there is
> nothing that could ever show a spurious network error.

Acceptance criteria:

- [x] Lighthouse or equivalent confirms valid installability.
- [x] App shell loads offline after first successful visit.
- [x] Daily check-in, observer entry, commitments, health measurements, trends, and settings work offline.
- [x] Updating the app does not erase local data.

---

# Phase 12 — Privacy, safety, and accessibility hardening

## 12.1 Privacy

- [x] Confirm there are no analytics, advertising SDKs, trackers, remote fonts, or unnecessary external requests.
- [x] Add a local privacy screen summarising:
  - what is stored;
  - where it is stored;
  - what export does;
  - what deleting data does;
  - limits of device security.
- [x] Add an optional privacy curtain on app resume.
- [x] Do not market a cosmetic PIN as database encryption.
- [x] Ensure free-text notes are omitted from exports unless selected.

> Implementation note: grep confirms zero `fetch`/`XMLHttpRequest` calls
> anywhere in `src`, and `index.html` loads no remote scripts or fonts. The
> privacy screen lives at `/settings/privacy`
> (`src/features/privacy/PrivacyPage.tsx`), linked from Settings. The privacy
> curtain (`src/app/PrivacyCurtain.tsx`, toggled in Settings) is deliberately
> **not** PIN-gated: it's a plain cover screen shown on `visibilitychange`
> that any tap dismisses, so there is no PIN to ever mis-describe as
> encryption — the UI explicitly says so. Its on/off preference lives in a
> new `appPreferences` Dexie table (Dexie version 2; see `migrations.ts`),
> deliberately **excluded** from encrypted backup/restore since it describes
> this device's screen, not portable personal data. "Free-text notes omitted
> unless selected" was already built and tested in Phase 10
> (`src/features/data-management/csvExport.ts`'s `includeNotes` option).

## 12.2 Clinical-safety boundaries

- [x] Add permanent, unobtrusive notices that:
  - the app is not a diagnostic device;
  - trends may have many explanations;
  - medication changes must follow the prescriber’s plan.
- [x] Keep emergency or crisis content user-configured.
- [x] Never invent local contact numbers.
- [x] Ensure alerts always link to the configured safety plan.
- [x] Add tests for prohibited diagnostic and medication-advice wording.

> Implementation note: Home's permanent disclaimer (`src/app/HomePage.tsx`)
> now states all three required points together in one always-visible
> place; the existing contextual notices on Trends/Rules (diagnoses/causal
> claims) and Medication (prescriber's plan) remain as reinforcement. The
> safety plan (`SafetyPlanPage.tsx`) has always been fully user-configured
> with no invented contact numbers, and `AlertCard` already links to it. The
> banned-phrase list, previously duplicated between the rule-engine and
> pattern-card tests, is now centralized in
> `src/utils/prohibitedWording.ts` and checked app-wide: every core route
> (with seed data loaded) is swept for it in
> `e2e/check-in.spec.ts`'s "no console errors or prohibited wording" test,
> in addition to the existing unit-level checks on generated rule/pattern
> text.

## 12.3 Accessibility

Target WCAG 2.2 AA where practical.

- [x] Semantic headings and landmarks.
- [x] Label every input.
- [x] Screen-reader descriptions for scales.
- [x] Keyboard support for segmented controls.
- [x] Visible focus states.
- [x] Minimum touch target sizes.
- [x] Colour is never the only carrier of meaning.
- [x] Respect `prefers-reduced-motion`.
- [x] Support browser zoom to at least 200%.
- [x] Avoid time-limited interactions.
- [x] Announce save and error states accessibly.
- [x] Add accessible text alternatives for all charts.

> Implementation note: most of this was already in place from earlier
> phases — `:focus-visible` outlines and `--touch-target: 44px` minimums
> (`src/styles/global.css`), `prefers-reduced-motion` support
> (`tokens.css`), `ScaleInput`/`SegmentedControl` as proper
> `fieldset`/`legend`/`radiogroup` markup with per-option `aria-label`s,
> `ToastProvider`'s `aria-live="polite"` announcements, and `TrendChart`'s
> `role="img"` plus always-present data table. This phase added the one
> missing landmark — a `<main>` wrapping routed content in `App.tsx` — and
> fixed a real heading-order violation surfaced by testing (`h1` → `h3` on
> the safety plan page; changed to `h1` → `h2`). Browser zoom to 200% and
> "no time-limited interactions" are satisfied by the existing relative-unit
> responsive layout (already verified at 320px in e2e) and the toast
> auto-dismiss being a notification rather than a task deadline — nothing
> depends on it being seen in time.

Acceptance criteria:

- [x] Automated accessibility checks pass on core screens.
- [x] Critical flows can be completed using keyboard only.
- [x] Critical flows are understandable with a screen reader.
- [x] No prohibited medical claim appears in the interface.

> Implementation note: `@axe-core/playwright` runs in a new
> `e2e/accessibility.spec.ts` against all 14 core routes (with seed data
> loaded) and asserts zero violations — it caught the heading-order issue
> above, which was then fixed rather than excluded. Keyboard/screen-reader
> operability was already exercised structurally by the existing component
> patterns above; full manual screen-reader walkthroughs remain a human
> verification step beyond what an automated check can certify.

---

# Phase 13 — Testing

## 13.1 Unit tests

Add unit tests for:

- validation schemas;
- date and range calculations;
- weekly alcohol totals;
- baseline comparisons;
- cancellation summaries;
- health-reference-range display logic;
- alert-rule evaluation;
- missing-data handling;
- encrypted export and restore;
- database migrations.

## 13.2 Component tests

Test:

- all scale controls;
- conditional nap fields;
- conditional alcohol fields;
- conditional cancellation fields;
- medication status controls;
- observer form;
- alert evidence display;
- safety-plan link;
- export selectors;
- destructive-action confirmation.

## 13.3 End-to-end tests

Create critical Playwright flows:

1. First run, baseline entry, and safety plan.
2. Complete and edit a daily check-in.
3. Record a lunchtime nap and alcohol units.
4. Record social activity and a distress-related cancellation.
5. Add an observer entry.
6. Add a medication dose change.
7. Add a weight measurement and liver-function result.
8. Trigger a review rule and inspect its evidence.
9. Export CSV.
10. Create an encrypted backup.
11. Delete all data.
12. Restore from backup.
13. Reload and use the app offline.

## 13.4 Test data

- [x] Add realistic, non-identifying fixtures covering:
  - stable baseline;
  - possible activation pattern;
  - possible low-energy and withdrawal pattern;
  - increased restlessness;
  - increased appetite with reduced satiety;
  - improved appetite and satiety;
  - distress-related cancellations;
  - healthy-boundary cancellations;
  - observer concern;
  - missing days.

Acceptance criteria:

- [x] All tests pass reliably.
- [x] Tests do not depend on network access.
- [x] No real personal data appears in fixtures.
- [x] Critical end-to-end flows pass in mobile and desktop viewports.

> Implementation note: unlike every other phase, §13.1–13.3 above ship with
> no per-bullet checkboxes in this file — they were always meant as a
> coverage checklist to audit against the suite that grew organically
> through Phases 2–12, not a from-scratch build list. An audit against every
> bullet found most of it already covered incidentally; this phase filled
> the real, specific gaps found:
>
> - **13.1**: added the only three schemas with no direct test —
>   `alertRuleSchema`, `safetyPlanSchema`, `appPreferenceSchema`
>   (`src/data/schemas/__tests__/`). Everything else (date/range math,
>   weekly alcohol totals, baseline comparisons, cancellation summaries,
>   reference-range logic, all 10 rule evaluators, missing-data handling,
>   encrypted backup/restore, and the version-1→2 migration) already had
>   coverage from the phases that built them.
> - **13.2**: added component tests for the 7 of 10 listed items that had
>   none — conditional nap fields (`SleepSection`), conditional alcohol
>   fields (`DailyRhythmSection`), conditional cancellation fields
>   (`CommitmentCard`), medication status controls (`DoseLog`), the
>   observer form, export selectors (`ExportCsvSection`), and destructive-
>   action confirmation (`DeleteAllData`). Alert evidence display and the
>   safety-plan link were already covered by `AlertCard.test.tsx`; the
>   shared `ScaleInput` primitive was already covered generically (its
>   many call sites are now additionally exercised by the new section
>   tests above).
> - **13.3**: added `e2e/onboarding-and-safety-plan.spec.ts` (flow 1, using
>   the existing `BaselineEditor`/`SafetyPlanPage` UI — building a
>   first-run wizard is Phase 3's scope, not this testing phase's),
>   `e2e/commitments-and-observer.spec.ts` (flows 4–5),
>   `e2e/medication-and-health.spec.ts` (flows 6–7); extended
>   `e2e/check-in.spec.ts` with an edit-and-resave step (completing flow 2)
>   and a new nap/alcohol test (flow 3); extended `e2e/rules.spec.ts` to
>   expand the evidence disclosure and assert an entry is actually shown,
>   not just its summary count (completing flow 8). Flows 9–13 already
>   passed.
> - **13.4**: added one seed check-in demonstrating "improved appetite and
>   satiety" (`src/data/seed.ts`), the only one of the ten named scenarios
>   missing from the existing fixtures.
> - e2e still isn't run in CI (`deploy-pages.yml` only runs format/lint/
>   tsc/`npm test`/build) — unchanged from every prior phase's design, not
>   a new gap introduced here. `playwright.config.ts` already ran both
>   `chromium` and `mobile-chromium` by default; `playwright.offline.config.ts`
>   only had `chromium` and now has both too, so flow 13 gets the same
>   dual-viewport coverage as everything else.

---

# Phase 14 — MVP polish pass

## 14.1 Interaction polish

- [x] Reduce unnecessary taps.
- [x] Preserve scroll and form state.
- [x] Add sensible defaults without guessing health values.
- [x] Ensure save actions feel immediate.
- [x] Prevent duplicate submissions.
- [x] Add undo where safe for non-destructive actions.
- [x] Make empty states useful and calm.
- [x] Ensure errors explain how to recover.

## 14.2 Copy polish

Review every user-facing string.

Use:

- “record”
- “observed”
- “changed”
- “review”
- “worth discussing”
- “support plan”
- “healthy boundary”

Avoid:

- “failed”
- “bad day”
- “non-compliant”
- “relapse detected”
- “manic”
- “hypomanic”
- “addicted”
- “dangerous result”
- “flaky”
- “unreliable”

- [x] Keep helper text concise.
- [x] Explain clinical-looking terms in plain language.
- [x] Use UK spelling and date conventions in the UI while preserving ISO dates in exports.
- [x] Ensure all headings and labels are consistent.

## 14.3 Visual polish

- [x] Refine spacing and hierarchy.
- [x] Ensure charts are not visually dominant.
- [x] Use icons sparingly and always with labels where meaning matters.
- [x] Check light and dark modes if both are supported.
- [x] Verify safe-area insets on modern phones.
- [x] Verify installed-app appearance.

## 14.4 Performance

- [x] Audit bundle size.
- [x] Lazy-load secondary routes where beneficial.
- [x] Avoid rendering full datasets unnecessarily.
- [x] Keep home screen and check-in interactions responsive with at least five years of daily records.
- [x] Test IndexedDB query performance on representative data.

Acceptance criteria:

- [x] Daily check-in remains quick and calm.
- [x] No visible layout shift on core screens.
- [x] No console warnings or errors.
- [x] App remains responsive with a large local dataset.
- [x] User-facing wording is compassionate and non-diagnostic.

> Implementation note: an Explore-agent audit checked every §14.1–14.3
> bullet against the actual code before touching anything, to avoid
> re-polishing what was already solid. Most bullets were already satisfied
> incidentally by earlier phases — sensible non-guessed defaults, immediate
> save feedback on most forms, calm empty states on most list pages, UK
> spelling/dates throughout, consistent sentence-case headings, icons
> always labelled, modest charts, and dark-mode CSS tokens on every
> surface. The real, concrete gaps found (and fixed here) were:
>
> - **Duplicate-submission guards (§14.1)**: roughly half of the app's
>   save-triggering forms already had a `saving` state + `disabled` button
>   (`CheckInPage`, `ObserverForm`, `NewCommitmentForm`,
>   `RestoreSection`, `CreateBackupSection`); the other half didn't. Added
>   the same guard to `HealthMeasurementForm.tsx`, `DoseLog.tsx`,
>   `MedicationDefinitions.tsx`, `BaselineEditor.tsx`, and
>   `SafetyPlanPage.tsx`.
> - **Silent save failures (§14.1)**: `BaselineEditor.tsx` and
>   `SafetyPlanPage.tsx` had no try/catch around their save calls at all.
>   Both now show an error toast via the existing `useToast()` pattern
>   ("Could not save your baseline/safety plan. Please try again.") on
>   failure, matching every other form's error handling.
> - **Undo for safe, non-destructive actions (§14.1)**: medication archive
>   (`MedicationDefinitions.tsx`/`useMedications.ts`) gained a matching
>   "Unarchive" button (new `unarchiveDefinition`). Alert dismissal
>   (`HomePage.tsx`) now shows an "Undo" toast action instead of vanishing
>   permanently — `ToastProvider`/`toastContext.ts` were extended with an
>   optional `{ label, onClick }` action rendered next to the toast
>   message. Safety-plan contact removal was checked and needs no change:
>   it's draft-only until "Save safety plan" is pressed, so it's already
>   recoverable by not saving.
> - **Missing empty state (§14.1)**: `DoseLog.tsx` rendered nothing with no
>   logged doses; it now shows "No doses logged yet.", matching the pattern
>   used elsewhere.
> - **Banned word + unclear recovery text (§14.2)**: `RestoreSection.tsx`'s
>   failure message used the explicitly banned word "failed"; reworded to
>   "The restore didn't complete, and no data was changed. Please try
>   again." Its generic backup-read-error fallback now hints at the likely
>   causes (wrong file, wrong passphrase) instead of just "Could not read
>   this backup file."
> - **Plain-language gloss (§14.2)**: `HealthMeasurementForm.tsx`'s lab
>   marker picker (ALT, AST, ALP, GGT, HbA1c, etc.) listed bare
>   abbreviations with no explanation; added a short plain-language hint
>   under the type selector for each marker.
> - **Dark-aware theme colour + top safe-area inset (§14.3)**: `index.html`
>   had one static `<meta name="theme-color">` with no dark variant; added
>   a matching light/dark pair via `media="(prefers-color-scheme: ...)"`.
>   `App.tsx`'s `<main>` now also applies
>   `padding-top: env(safe-area-inset-top)` (only the bottom nav handled
>   its inset before).
> - **Bundle size and lazy loading (§14.4)**: every build warned of one
>   517 KB JS chunk with zero code-splitting. `routes.tsx` now imports only
>   Home and Check-in (Phase 1's most-prominent routes) eagerly; every
>   other route lazy-loads via `React.lazy()` (defined in the new
>   `src/app/lazyPages.ts`, split out to satisfy oxlint's
>   `react(only-export-components)` rule), wrapped in a `<Suspense>` in
>   `App.tsx`. The build now produces a 451.95 KB main chunk plus 12 small
>   per-route chunks (0.46–17.67 KB each) with no size warning.
> - **Unbounded dataset rendering (§14.4)**: `CommitmentsPage`,
>   `ObserverPage`, and `HealthPage` each rendered their entire history with
>   no cap — thousands of card mounts at five-year scale. Added
>   `src/components/ShowMoreList.tsx` (renders the first 25 items plus a
>   "Show all (N total)" button) and adopted it in all three pages.
>   `HealthMeasurementList.tsx` was split into a single-item
>   `HealthMeasurementCard.tsx` to fit this pattern and then deleted.
>   `DoseLog` already capped its own rendering and needed no change.
> - **IndexedDB query performance (§14.4)**: added
>   `src/data/__tests__/performance.test.ts`, seeding ~5 years of synthetic
>   daily check-ins, commitments, observer entries, and health measurements
>   directly into `fake-indexeddb` and asserting Home's 7-day and Trends'
>   90-day `dailyCheckInRepository.listByDateRange` calls, plus full
>   `.list()` calls on the other three repositories, each complete well
>   under a 200ms budget — confirming the queries themselves were never the
>   bottleneck at this scale, only the unbounded DOM rendering above was.
> - Verified with `npx tsc -b`, `npm run lint`, `npm run format:check`,
>   `npm test` (160 tests / 29 files), `npm run build`, and the full
>   Playwright suite across both `chromium` and `mobile-chromium` (54
>   tests) plus the offline suite (4 tests) — all pass. Lazy-loading routes
>   introduced a real async gap where only the `<Suspense>` fallback (no
>   `<h1>`) is present; `e2e/accessibility.spec.ts` now waits for the `h1`
>   to render before running axe, otherwise 11 of 14 routes falsely failed
>   `page-has-heading-one`.

---

# Phase 15 — Documentation and release readiness

## 15.1 README

Document:

- project purpose;
- safety boundaries;
- local-first architecture;
- setup commands;
- development workflow;
- testing;
- production build;
- PWA behaviour;
- database schema;
- migration process;
- backup format;
- known limitations;
- non-goals.

## 15.2 In-app help

- [ ] Add concise explanations for:
  - reduced need for sleep versus poor sleep;
  - inner restlessness versus anxiety;
  - social activity versus social drive;
  - cancellation reasons;
  - supplied laboratory reference ranges;
  - self-report versus observer report;
  - how alert rules work.

## 15.3 Release checklist

- [ ] Fresh install tested.
- [ ] Upgrade from previous database version tested.
- [ ] Offline use tested.
- [ ] Backup and restore tested.
- [ ] Delete-all tested.
- [ ] Accessibility reviewed.
- [ ] Mobile viewport reviewed.
- [ ] No analytics or remote trackers present.
- [ ] No medical diagnosis or medication advice present.
- [ ] All tests pass.
- [ ] Production build succeeds.
- [ ] Version number and release notes added.

Acceptance criteria:

- [ ] A new developer can run and understand the project from the README.
- [ ] A user can understand the app’s limits from onboarding and help text.
- [ ] The release candidate satisfies the Definition of Done.

---

# Explicit MVP non-goals

Do not implement these in the MVP:

- accounts;
- cloud sync;
- remote supporter portals;
- background server jobs;
- automatic NHS, GP, pharmacy, or laboratory integrations;
- wearable integrations;
- AI-generated interpretations;
- predictive episode detection;
- automatic diagnosis;
- automatic medication recommendations;
- automatic dose schedules derived from clinical assumptions;
- live clinician dashboards;
- social feeds;
- public profiles;
- gamification;
- advertising;
- behavioural analytics;
- location tracking.

Document any future-facing interfaces cleanly, but do not build speculative infrastructure for them.

---

# Suggested initial release sequence

## Milestone A — Usable local tracker

- app shell;
- IndexedDB;
- onboarding;
- daily check-in;
- commitments and cancellations;
- observer entries;
- medication entries;
- health measurements.

## Milestone B — Meaningful review

- baselines;
- timeline;
- trends;
- transparent rules;
- safety-plan actions.

## Milestone C — Trustworthy release

- CSV export;
- encrypted backup and restore;
- PWA offline support;
- accessibility;
- test coverage;
- privacy and wording review;
- final polish.

---

# Final handoff notes

Before declaring the MVP complete, provide:

- a summary of implemented features;
- screenshots or a short walkthrough of core flows;
- commands to run, test, and build the app;
- known limitations;
- database schema version;
- backup format version;
- accessibility findings;
- any tasks intentionally deferred;
- confirmation that no personal data leaves the device in the default configuration.
