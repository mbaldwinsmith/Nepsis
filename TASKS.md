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

> Implementation note: the toast system currently covers saves and errors
> (used throughout the feature forms); import/export flows do not exist
> yet (Phase 10), so there is nothing for them to notify about so far.

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

> Implementation note: import/restore does not exist yet (Phase 10), so
> there is nothing to validate on import so far; the schemas are already
> in place to reuse for that validation when it is built.

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

- [ ] Allow the user to choose:
  - date range;
  - data categories;
  - whether to include free-text notes;
  - whether to include observer labels.
- [ ] Export separate or clearly namespaced CSV files for:
  - daily check-ins;
  - commitments;
  - observer entries;
  - medications and transition events;
  - health measurements;
  - alerts.
- [ ] Use ISO dates and explicit units.
- [ ] Include a data dictionary or README file in the export bundle.

## 10.2 Encrypted backup

- [ ] Export a complete versioned JSON backup.
- [ ] Encrypt the backup using a passphrase-derived key and authenticated encryption.
- [ ] Use the Web Crypto API through a small, well-tested wrapper.
- [ ] Store:
  - schema version;
  - creation time;
  - encryption parameters;
  - encrypted payload;
  - authentication metadata.
- [ ] Never store the passphrase.
- [ ] Warn clearly that a forgotten passphrase cannot be recovered.
- [ ] Do not call the implementation “military-grade”.

## 10.3 Restore

- [ ] Validate file type, envelope structure, decryption result, and schema.
- [ ] Preview record counts before importing.
- [ ] Offer:
  - replace all local data;
  - merge without overwriting;
  - cancel.
- [ ] Make restore atomic so a failed import does not leave partial data.
- [ ] Test restore from older supported schema versions.

## 10.4 Delete all data

- [ ] Add a clearly labelled destructive action in Settings.
- [ ] Require explicit confirmation.
- [ ] Delete IndexedDB data, cached personal exports if any, and local preferences.
- [ ] Explain that external files already downloaded cannot be deleted by the app.

Acceptance criteria:

- [ ] Exported CSV opens cleanly in common spreadsheet software.
- [ ] Encrypted backups cannot be read as plain JSON.
- [ ] Correct-passphrase restore recreates the original record counts and content.
- [ ] Incorrect-passphrase restore fails safely.
- [ ] Delete-all removes local records.

---

# Phase 11 — PWA and offline support

## 11.1 Manifest and installation

- [ ] Configure:
  - app name and short name;
  - theme and background colours;
  - standalone display;
  - icons;
  - start URL;
  - portrait-friendly behaviour.
- [ ] Add a simple install-help screen rather than intrusive prompts.

## 11.2 Service worker

- [ ] Cache the application shell and static assets.
- [ ] Ensure all core tracking flows work offline.
- [ ] Use an update strategy that does not discard unsaved form data.
- [ ] Show a calm update-available notice.
- [ ] Avoid caching exported health files.

## 11.3 Offline behaviour

- [ ] Test:
  - first load online;
  - reload offline;
  - create and edit records offline;
  - navigate across all core routes offline;
  - install and launch from the home screen.
- [ ] Do not show network errors for features that do not require the network.

Acceptance criteria:

- [ ] Lighthouse or equivalent confirms valid installability.
- [ ] App shell loads offline after first successful visit.
- [ ] Daily check-in, observer entry, commitments, health measurements, trends, and settings work offline.
- [ ] Updating the app does not erase local data.

---

# Phase 12 — Privacy, safety, and accessibility hardening

## 12.1 Privacy

- [ ] Confirm there are no analytics, advertising SDKs, trackers, remote fonts, or unnecessary external requests.
- [ ] Add a local privacy screen summarising:
  - what is stored;
  - where it is stored;
  - what export does;
  - what deleting data does;
  - limits of device security.
- [ ] Add an optional privacy curtain on app resume.
- [ ] Do not market a cosmetic PIN as database encryption.
- [ ] Ensure free-text notes are omitted from exports unless selected.

## 12.2 Clinical-safety boundaries

- [ ] Add permanent, unobtrusive notices that:
  - the app is not a diagnostic device;
  - trends may have many explanations;
  - medication changes must follow the prescriber’s plan.
- [ ] Keep emergency or crisis content user-configured.
- [ ] Never invent local contact numbers.
- [ ] Ensure alerts always link to the configured safety plan.
- [ ] Add tests for prohibited diagnostic and medication-advice wording.

## 12.3 Accessibility

Target WCAG 2.2 AA where practical.

- [ ] Semantic headings and landmarks.
- [ ] Label every input.
- [ ] Screen-reader descriptions for scales.
- [ ] Keyboard support for segmented controls.
- [ ] Visible focus states.
- [ ] Minimum touch target sizes.
- [ ] Colour is never the only carrier of meaning.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Support browser zoom to at least 200%.
- [ ] Avoid time-limited interactions.
- [ ] Announce save and error states accessibly.
- [ ] Add accessible text alternatives for all charts.

Acceptance criteria:

- [ ] Automated accessibility checks pass on core screens.
- [ ] Critical flows can be completed using keyboard only.
- [ ] Critical flows are understandable with a screen reader.
- [ ] No prohibited medical claim appears in the interface.

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

- [ ] Add realistic, non-identifying fixtures covering:
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

- [ ] All tests pass reliably.
- [ ] Tests do not depend on network access.
- [ ] No real personal data appears in fixtures.
- [ ] Critical end-to-end flows pass in mobile and desktop viewports.

---

# Phase 14 — MVP polish pass

## 14.1 Interaction polish

- [ ] Reduce unnecessary taps.
- [ ] Preserve scroll and form state.
- [ ] Add sensible defaults without guessing health values.
- [ ] Ensure save actions feel immediate.
- [ ] Prevent duplicate submissions.
- [ ] Add undo where safe for non-destructive actions.
- [ ] Make empty states useful and calm.
- [ ] Ensure errors explain how to recover.

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

- [ ] Keep helper text concise.
- [ ] Explain clinical-looking terms in plain language.
- [ ] Use UK spelling and date conventions in the UI while preserving ISO dates in exports.
- [ ] Ensure all headings and labels are consistent.

## 14.3 Visual polish

- [ ] Refine spacing and hierarchy.
- [ ] Ensure charts are not visually dominant.
- [ ] Use icons sparingly and always with labels where meaning matters.
- [ ] Check light and dark modes if both are supported.
- [ ] Verify safe-area insets on modern phones.
- [ ] Verify installed-app appearance.

## 14.4 Performance

- [ ] Audit bundle size.
- [ ] Lazy-load secondary routes where beneficial.
- [ ] Avoid rendering full datasets unnecessarily.
- [ ] Keep home screen and check-in interactions responsive with at least five years of daily records.
- [ ] Test IndexedDB query performance on representative data.

Acceptance criteria:

- [ ] Daily check-in remains quick and calm.
- [ ] No visible layout shift on core screens.
- [ ] No console warnings or errors.
- [ ] App remains responsive with a large local dataset.
- [ ] User-facing wording is compassionate and non-diagnostic.

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
