import { ScaleInput } from '../../../components/ScaleInput'
import { SegmentedControl } from '../../../components/SegmentedControl'
import { ChipMultiSelect } from '../../../components/ChipMultiSelect'
import {
  NONE_TO_A_GREAT_DEAL,
  MUCH_LESS_TO_MUCH_MORE_DRIVEN,
} from '../../../utils/scaleWords'
import type { Social, SocialInteractionType } from '../../../data/schemas'

interface Props {
  value: Social
  onChange: (value: Social) => void
}

const interactionTypeOptions: { value: SocialInteractionType; label: string }[] = [
  { value: 'inPerson', label: 'In person' },
  { value: 'phoneOrVideo', label: 'Phone or video' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'groupEvent', label: 'Group event' },
  { value: 'churchOrCommunity', label: 'Church or community' },
  { value: 'work', label: 'Work' },
]

export function SocialActivitySection({ value, onChange }: Props) {
  return (
    <section className="card stack">
      <h2>Other people</h2>
      <ScaleInput
        legend="Activity amount"
        name="socialActivityAmount"
        min={0}
        max={4}
        value={value.activityAmount}
        onChange={(v) => onChange({ ...value, activityAmount: v })}
        minLabel="None"
        maxLabel="A great deal"
        words={NONE_TO_A_GREAT_DEAL}
        hint="How much social contact you actually had today."
      />
      <ScaleInput
        legend="Social drive"
        name="socialDrive"
        min={-2}
        max={2}
        value={value.socialDrive}
        onChange={(v) => onChange({ ...value, socialDrive: v })}
        minLabel="Much less driven"
        maxLabel="Much more driven"
        words={MUCH_LESS_TO_MUCH_MORE_DRIVEN}
        hint="How driven or pulled toward social contact you felt — this can differ from how much you actually did."
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
        value={value.effect}
        onChange={(v) => onChange({ ...value, effect: v })}
      />
      <ChipMultiSelect
        legend="Interaction types"
        name="socialInteractionTypes"
        options={interactionTypeOptions}
        values={value.interactionTypes ?? []}
        onChange={(interactionTypes) =>
          onChange({
            ...value,
            interactionTypes: interactionTypes.length ? interactionTypes : undefined,
          })
        }
      />
    </section>
  )
}
