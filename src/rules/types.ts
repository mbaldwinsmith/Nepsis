import type {
  DailyCheckIn,
  ObserverEntry,
  PersonalBaseline,
  RuleType,
  SocialCommitment,
} from '../data/schemas'

export type EvidenceSource = 'self-report' | 'observer-report' | 'commitments'

export interface Evidence {
  date: string
  source: EvidenceSource
  description: string
}

export interface RuleEvaluation {
  triggered: boolean
  summary: string
  evidence: Evidence[]
}

export interface RuleContext {
  windowStart: string
  windowEnd: string
  checkIns: DailyCheckIn[]
  commitments: SocialCommitment[]
  observerEntries: ObserverEntry[]
  baseline: PersonalBaseline | undefined
  params: Record<string, number>
}

export interface RuleParamSpec {
  key: string
  label: string
  min: number
  max: number
  step: number
  default: number
  unit?: string
}

export interface RuleTypeDefinition {
  ruleType: RuleType
  defaultLabel: string
  defaultDescription: string
  defaultSeverity: 'review' | 'act'
  defaultLookbackDays: number
  defaultActionText: string
  paramSchema: RuleParamSpec[]
  evaluate: (context: RuleContext) => RuleEvaluation
  describe: (params: Record<string, number>, lookbackDays: number) => string
}
