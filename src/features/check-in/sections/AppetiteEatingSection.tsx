import { ScaleInput } from '../../../components/ScaleInput'
import { ToggleField } from '../../../components/ToggleField'
import {
  VERY_LOW_TO_VERY_HIGH,
  NONE_TO_CONSTANT,
  NOT_SATISFIED_TO_FULLY_SATISFIED,
} from '../../../utils/scaleWords'
import type { Appetite } from '../../../data/schemas'

interface Props {
  value: Appetite
  onChange: (value: Appetite) => void
}

export function AppetiteEatingSection({ value, onChange }: Props) {
  return (
    <section className="card stack">
      <h2>Eating</h2>
      <ScaleInput
        legend="Appetite"
        name="appetite"
        min={0}
        max={4}
        value={value.appetite}
        onChange={(v) => onChange({ ...value, appetite: v })}
        minLabel="Very low"
        maxLabel="Very high"
        words={VERY_LOW_TO_VERY_HIGH}
      />
      <ScaleInput
        legend="Hunger between meals"
        name="hungerBetweenMeals"
        min={0}
        max={4}
        value={value.hungerBetweenMeals}
        onChange={(v) => onChange({ ...value, hungerBetweenMeals: v })}
        minLabel="None"
        maxLabel="Constant"
        words={NONE_TO_CONSTANT}
      />
      <ScaleInput
        legend="Satiety after a normal meal"
        name="satietyAfterNormalMeal"
        min={0}
        max={4}
        value={value.satietyAfterNormalMeal}
        onChange={(v) => onChange({ ...value, satietyAfterNormalMeal: v })}
        minLabel="Not satisfied"
        maxLabel="Fully satisfied"
        words={NOT_SATISFIED_TO_FULLY_SATISFIED}
      />
      <ScaleInput
        legend="Food preoccupation or cravings"
        name="foodPreoccupationOrCravings"
        min={0}
        max={4}
        value={value.foodPreoccupationOrCravings}
        onChange={(v) => onChange({ ...value, foodPreoccupationOrCravings: v })}
        minLabel="None"
        maxLabel="Constant"
        words={NONE_TO_CONSTANT}
      />
      <ToggleField
        label="Binge or loss-of-control eating"
        checked={value.bingeOrLossOfControlEating ?? false}
        onChange={(checked) =>
          onChange({ ...value, bingeOrLossOfControlEating: checked || undefined })
        }
      />
    </section>
  )
}
