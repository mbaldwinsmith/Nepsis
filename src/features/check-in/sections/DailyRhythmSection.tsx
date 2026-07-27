import { ScaleInput } from '../../../components/ScaleInput'
import { SegmentedControl } from '../../../components/SegmentedControl'
import { TextField } from '../../../components/TextField'
import type { Alcohol, Social, SocialInteractionType } from '../../../data/schemas'

interface Props {
  alcohol: Alcohol
  social: Social
  onChangeAlcohol: (value: Alcohol) => void
  onChangeSocial: (value: Social) => void
}

const interactionTypes: { value: SocialInteractionType; label: string }[] = [
  { value: 'inPerson', label: 'In person' },
  { value: 'phoneOrVideo', label: 'Phone or video' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'groupEvent', label: 'Group event' },
  { value: 'churchOrCommunity', label: 'Church or community' },
  { value: 'work', label: 'Work' },
]

export function DailyRhythmSection({
  alcohol,
  social,
  onChangeAlcohol,
  onChangeSocial,
}: Props) {
  const units = alcohol.unitsConsumed ?? 0

  function toggleInteractionType(type: SocialInteractionType) {
    const current = social.interactionTypes ?? []
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    onChangeSocial({ ...social, interactionTypes: next.length ? next : undefined })
  }

  return (
    <section className="card stack">
      <h2>Daily rhythm</h2>

      <h3>Alcohol</h3>
      <TextField
        label="Units consumed"
        type="number"
        min={0}
        step={0.5}
        value={alcohol.unitsConsumed?.toString() ?? ''}
        onChange={(v) =>
          onChangeAlcohol({
            ...alcohol,
            unitsConsumed: v === '' ? undefined : Number(v),
            context: v === '' || Number(v) <= 0 ? undefined : alcohol.context,
            perceivedEffect:
              v === '' || Number(v) <= 0 ? undefined : alcohol.perceivedEffect,
          })
        }
      />
      {units > 0 && (
        <>
          <SegmentedControl
            legend="Context"
            name="alcoholContext"
            options={[
              { value: 'social', label: 'Social' },
              { value: 'withMeal', label: 'With meal' },
              { value: 'relaxingAlone', label: 'Relaxing alone' },
              { value: 'celebration', label: 'Celebration' },
              { value: 'coping', label: 'Coping' },
              { value: 'other', label: 'Other' },
            ]}
            value={alcohol.context}
            onChange={(v) => onChangeAlcohol({ ...alcohol, context: v })}
          />
          <SegmentedControl
            legend="Perceived effect"
            name="alcoholEffect"
            options={[
              { value: 'better', label: 'Better' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'worse', label: 'Worse' },
              { value: 'unclear', label: 'Unclear' },
            ]}
            value={alcohol.perceivedEffect}
            onChange={(v) => onChangeAlcohol({ ...alcohol, perceivedEffect: v })}
          />
        </>
      )}

      <h3>Social activity</h3>
      <ScaleInput
        legend="Activity amount"
        name="socialActivityAmount"
        min={0}
        max={4}
        value={social.activityAmount}
        onChange={(v) => onChangeSocial({ ...social, activityAmount: v })}
        minLabel="None"
        maxLabel="A great deal"
      />
      <ScaleInput
        legend="Social drive"
        name="socialDrive"
        min={-2}
        max={2}
        value={social.socialDrive}
        onChange={(v) => onChangeSocial({ ...social, socialDrive: v })}
        minLabel="Much less driven"
        maxLabel="Much more driven"
      />
      <SegmentedControl
        legend="Effect of social contact"
        name="socialEffect"
        options={[
          { value: 'depleted', label: 'Depleted' },
          { value: 'slightlyDrained', label: 'Slightly drained' },
          { value: 'neutral', label: 'Neutral' },
          { value: 'nourished', label: 'Nourished' },
          { value: 'energisedOrOverstimulated', label: 'Energised or overstimulated' },
        ]}
        value={social.effect}
        onChange={(v) => onChangeSocial({ ...social, effect: v })}
      />
      <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 600 }}>Interaction types</legend>
        <div className="stack">
          {interactionTypes.map((t) => (
            <label
              key={t.value}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <input
                type="checkbox"
                checked={(social.interactionTypes ?? []).includes(t.value)}
                onChange={() => toggleInteractionType(t.value)}
                style={{ width: '20px', height: '20px' }}
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
