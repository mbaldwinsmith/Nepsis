import { SegmentedControl } from '../../components/SegmentedControl'
import { ChipMultiSelect } from '../../components/ChipMultiSelect'
import { TextField } from '../../components/TextField'
import type {
  SocialCommitment,
  CommitmentOutcome,
  CommitmentReason,
} from '../../data/schemas'
import { formatIsoDateForDisplay } from '../../utils/date'
import {
  COMMITMENT_TYPE_LABELS,
  COMMITMENT_IMPORTANCE_LABELS,
} from '../../utils/enumLabels'

interface Props {
  commitment: SocialCommitment
  onUpdate: (commitment: SocialCommitment) => void
}

const outcomeOptions: { value: CommitmentOutcome; label: string }[] = [
  { value: 'attended', label: 'Attended' },
  { value: 'attendedBriefly', label: 'Attended briefly' },
  { value: 'postponed', label: 'Postponed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'didNotAttend', label: 'Did not attend' },
]

const reasonOptions: { value: CommitmentReason; label: string }[] = [
  { value: 'distress', label: 'Distress' },
  { value: 'lowEnergy', label: 'Low energy' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'overwhelmed', label: 'Overwhelmed' },
  { value: 'irritability', label: 'Irritability' },
  { value: 'physicalIllness', label: 'Physical illness' },
  { value: 'schedulingIssue', label: 'Scheduling issue' },
  { value: 'healthyBoundary', label: 'Healthy boundary' },
  { value: 'other', label: 'Other' },
]

const detailOutcomes: CommitmentOutcome[] = ['postponed', 'cancelled', 'didNotAttend']

export function CommitmentCard({ commitment, onUpdate }: Props) {
  const needsDetail = detailOutcomes.includes(commitment.outcome)

  function setOutcome(outcome: CommitmentOutcome) {
    onUpdate({
      ...commitment,
      outcome,
      reasons: detailOutcomes.includes(outcome) ? commitment.reasons : undefined,
      notice: detailOutcomes.includes(outcome) ? commitment.notice : undefined,
      afterEffect: detailOutcomes.includes(outcome) ? commitment.afterEffect : undefined,
    })
  }

  return (
    <div className="card stack">
      <div>
        <strong>{commitment.title || COMMITMENT_TYPE_LABELS[commitment.type]}</strong>
        <p className="hint" style={{ margin: 0 }}>
          {formatIsoDateForDisplay(commitment.plannedDate)} ·{' '}
          {COMMITMENT_TYPE_LABELS[commitment.type]} ·{' '}
          {COMMITMENT_IMPORTANCE_LABELS[commitment.importance]}
        </p>
      </div>

      <SegmentedControl
        legend="Outcome"
        name={`outcome-${commitment.id}`}
        options={outcomeOptions}
        value={commitment.outcome}
        onChange={setOutcome}
        hint={`"Postponed", "Cancelled", and "Did not attend" ask for an optional reason; "Attended" and "Attended briefly" don't.`}
      />

      {needsDetail && (
        <div className="stack">
          {commitment.reasons?.includes('healthyBoundary') && (
            <p className="hint">
              A healthy boundary — this is not shown as an adverse pattern.
            </p>
          )}
          <p className="hint">
            Cancelling plans may be a sign that things feel harder right now.
          </p>
          <ChipMultiSelect
            legend="Reason (select any that apply)"
            name={`reasons-${commitment.id}`}
            options={reasonOptions}
            values={commitment.reasons ?? []}
            onChange={(reasons) =>
              onUpdate({ ...commitment, reasons: reasons.length ? reasons : undefined })
            }
            hint={`Choosing "Healthy boundary" tells Nepsis this wasn't distress-related, so it isn't grouped with the other reasons when looking for patterns.`}
          />
          <SegmentedControl
            legend="Notice given"
            name={`notice-${commitment.id}`}
            options={[
              { value: 'early', label: 'Early' },
              { value: 'sameDay', label: 'Same day' },
              { value: 'veryLate', label: 'Very late' },
              { value: 'none', label: 'None' },
            ]}
            value={commitment.notice}
            onChange={(notice) => onUpdate({ ...commitment, notice })}
          />
          <SegmentedControl
            legend="After-effect"
            name={`aftereffect-${commitment.id}`}
            options={[
              { value: 'relieved', label: 'Relieved' },
              { value: 'disappointed', label: 'Disappointed' },
              { value: 'ashamed', label: 'Ashamed' },
              { value: 'neutral', label: 'Neutral' },
              {
                value: 'gladIProtectedMyCapacity',
                label: 'Glad I protected my capacity',
              },
            ]}
            value={commitment.afterEffect}
            onChange={(afterEffect) => onUpdate({ ...commitment, afterEffect })}
          />
          <TextField
            label="Optional factual note"
            value={commitment.note ?? ''}
            onChange={(note) => onUpdate({ ...commitment, note: note || undefined })}
          />
        </div>
      )}
    </div>
  )
}
