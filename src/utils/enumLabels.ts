/**
 * Human-readable labels for schema enums that get rendered as plain text
 * outside a form control (e.g. rule evidence descriptions, read-only cards),
 * where the raw camelCase value would otherwise leak into the UI unchanged.
 */

export const COMMITMENT_OUTCOME_LABELS: Record<string, string> = {
  planned: 'Planned',
  attended: 'Attended',
  attendedBriefly: 'Attended briefly',
  postponed: 'Postponed',
  cancelled: 'Cancelled',
  didNotAttend: 'Did not attend',
}

export const COMMITMENT_REASON_LABELS: Record<string, string> = {
  distress: 'Distress',
  lowEnergy: 'Low energy',
  anxiety: 'Anxiety',
  overwhelmed: 'Overwhelmed',
  irritability: 'Irritability',
  physicalIllness: 'Physical illness',
  schedulingIssue: 'Scheduling issue',
  healthyBoundary: 'Healthy boundary',
  other: 'Other',
}

export const OBSERVER_CONCERN_LABELS: Record<string, string> = {
  none: 'None',
  keepWatching: 'Keep watching',
  discussSoon: 'Discuss soon',
  urgent: 'Urgent',
}

export const PERCEIVED_MOOD_LABELS: Record<string, string> = {
  low: 'Low',
  usual: 'Usual',
  elevated: 'Elevated',
  uncertain: 'Uncertain',
}

export const OBSERVED_SPEECH_LABELS: Record<string, string> = {
  usual: 'Usual',
  faster: 'Faster',
  pressured: 'Pressured',
}

export const OBSERVED_ACTIVITY_LABELS: Record<string, string> = {
  usual: 'Usual',
  withdrawn: 'Withdrawn',
  unusuallyDriven: 'Unusually driven',
}

export const MEDICATION_ENTRY_STATUS_LABELS: Record<string, string> = {
  taken: 'Taken',
  delayed: 'Delayed',
  missed: 'Missed',
  notScheduled: 'Not scheduled',
}
