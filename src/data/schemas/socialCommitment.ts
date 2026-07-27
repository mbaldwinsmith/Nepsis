import { z } from 'zod'
import { id, isoDate, isoDateTime, optionalText, SCHEMA_VERSION } from './shared'

export const commitmentTypeSchema = z.enum([
  'friends',
  'family',
  'work',
  'church',
  'appointment',
  'volunteering',
  'other',
])

export const commitmentImportanceSchema = z.enum(['routine', 'meaningful', 'essential'])

export const commitmentOutcomeSchema = z.enum([
  'planned',
  'attended',
  'attendedBriefly',
  'postponed',
  'cancelled',
  'didNotAttend',
])

export const commitmentReasonSchema = z.enum([
  'distress',
  'lowEnergy',
  'anxiety',
  'overwhelmed',
  'irritability',
  'physicalIllness',
  'schedulingIssue',
  'healthyBoundary',
  'other',
])

export const commitmentNoticeSchema = z.enum(['early', 'sameDay', 'veryLate', 'none'])

export const commitmentAfterEffectSchema = z.enum([
  'relieved',
  'disappointed',
  'ashamed',
  'neutral',
  'gladIProtectedMyCapacity',
])

const outcomesRequiringDetail: string[] = ['postponed', 'cancelled', 'didNotAttend']

export const socialCommitmentSchema = z
  .object({
    id: id(),
    schemaVersion: z.literal(SCHEMA_VERSION),
    plannedDate: isoDate(),
    plannedTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(),
    title: optionalText(200),
    type: commitmentTypeSchema,
    importance: commitmentImportanceSchema,
    outcome: commitmentOutcomeSchema,
    reasons: z.array(commitmentReasonSchema).optional(),
    notice: commitmentNoticeSchema.optional(),
    afterEffect: commitmentAfterEffectSchema.optional(),
    note: optionalText(),
    createdAt: isoDateTime(),
    updatedAt: isoDateTime(),
  })
  .refine(
    (v) =>
      outcomesRequiringDetail.includes(v.outcome) ||
      (v.reasons === undefined && v.notice === undefined && v.afterEffect === undefined),
    {
      message:
        'Reason, notice, and after-effect only apply to postponed, cancelled, or missed commitments',
      path: ['reasons'],
    },
  )

export type SocialCommitment = z.infer<typeof socialCommitmentSchema>
export type CommitmentType = z.infer<typeof commitmentTypeSchema>
export type CommitmentImportance = z.infer<typeof commitmentImportanceSchema>
export type CommitmentOutcome = z.infer<typeof commitmentOutcomeSchema>
export type CommitmentReason = z.infer<typeof commitmentReasonSchema>
export type CommitmentNotice = z.infer<typeof commitmentNoticeSchema>
export type CommitmentAfterEffect = z.infer<typeof commitmentAfterEffectSchema>
