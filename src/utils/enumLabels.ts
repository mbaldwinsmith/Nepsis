import type {
  CommitmentType,
  CommitmentImportance,
  CommitmentOutcome,
  CommitmentReason,
  ObserverConcern,
  PerceivedMood,
  ObservedSpeech,
  ObservedActivity,
  MedicationEntryStatus,
  HealthMeasurementType,
} from '../data/schemas'

/**
 * Human-readable labels for schema enums that get rendered as plain text
 * outside a form control (e.g. rule evidence descriptions, read-only cards),
 * where the raw camelCase value would otherwise leak into the UI unchanged.
 * Typed by each enum's exact union so indexing is total, not partial.
 */

export const COMMITMENT_TYPE_LABELS: Record<CommitmentType, string> = {
  friends: 'Friends',
  family: 'Family',
  work: 'Work',
  church: 'Church',
  appointment: 'Appointment',
  volunteering: 'Volunteering',
  other: 'Other',
}

export const COMMITMENT_IMPORTANCE_LABELS: Record<CommitmentImportance, string> = {
  routine: 'Routine',
  meaningful: 'Meaningful',
  essential: 'Essential',
}

export const COMMITMENT_OUTCOME_LABELS: Record<CommitmentOutcome, string> = {
  planned: 'Planned',
  attended: 'Attended',
  attendedBriefly: 'Attended briefly',
  postponed: 'Postponed',
  cancelled: 'Cancelled',
  didNotAttend: 'Did not attend',
}

export const COMMITMENT_REASON_LABELS: Record<CommitmentReason, string> = {
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

export const OBSERVER_CONCERN_LABELS: Record<ObserverConcern, string> = {
  none: 'None',
  keepWatching: 'Keep watching',
  discussSoon: 'Discuss soon',
  urgent: 'Urgent',
}

export const PERCEIVED_MOOD_LABELS: Record<PerceivedMood, string> = {
  low: 'Low',
  usual: 'Usual',
  elevated: 'Elevated',
  uncertain: 'Uncertain',
}

export const OBSERVED_SPEECH_LABELS: Record<ObservedSpeech, string> = {
  usual: 'Usual',
  faster: 'Faster',
  pressured: 'Pressured',
}

export const OBSERVED_ACTIVITY_LABELS: Record<ObservedActivity, string> = {
  usual: 'Usual',
  withdrawn: 'Withdrawn',
  unusuallyDriven: 'Unusually driven',
}

export const MEDICATION_ENTRY_STATUS_LABELS: Record<MedicationEntryStatus, string> = {
  taken: 'Taken',
  delayed: 'Delayed',
  missed: 'Missed',
  notScheduled: 'Not scheduled',
}

export const HEALTH_MEASUREMENT_TYPE_LABELS: Record<HealthMeasurementType, string> = {
  weight: 'Weight',
  waistCircumference: 'Waist circumference',
  restingPulse: 'Resting pulse',
  systolicBloodPressure: 'Systolic blood pressure',
  diastolicBloodPressure: 'Diastolic blood pressure',
  alt: 'ALT',
  ast: 'AST',
  alp: 'ALP',
  ggt: 'GGT',
  bilirubin: 'Bilirubin',
  hba1c: 'HbA1c',
  glucose: 'Glucose',
  totalCholesterol: 'Total cholesterol',
  hdl: 'HDL',
  ldl: 'LDL',
  triglycerides: 'Triglycerides',
}
