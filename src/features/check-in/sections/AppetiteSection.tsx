import { ScaleInput } from '../../../components/ScaleInput'
import { CheckboxField } from '../../../components/CheckboxField'
import { TextField } from '../../../components/TextField'
import type { Appetite, Urges } from '../../../data/schemas'

interface Props {
  appetite: Appetite
  urges: Urges
  onChangeAppetite: (value: Appetite) => void
  onChangeUrges: (value: Urges) => void
}

export function AppetiteSection({
  appetite,
  urges,
  onChangeAppetite,
  onChangeUrges,
}: Props) {
  return (
    <section className="card stack">
      <h2>Appetite and satiety</h2>
      <ScaleInput
        legend="Appetite"
        name="appetite"
        min={0}
        max={4}
        value={appetite.appetite}
        onChange={(v) => onChangeAppetite({ ...appetite, appetite: v })}
        minLabel="Very low"
        maxLabel="Very high"
      />
      <ScaleInput
        legend="Hunger between meals"
        name="hungerBetweenMeals"
        min={0}
        max={4}
        value={appetite.hungerBetweenMeals}
        onChange={(v) => onChangeAppetite({ ...appetite, hungerBetweenMeals: v })}
        minLabel="None"
        maxLabel="Constant"
      />
      <ScaleInput
        legend="Satiety after a normal meal"
        name="satietyAfterNormalMeal"
        min={0}
        max={4}
        value={appetite.satietyAfterNormalMeal}
        onChange={(v) => onChangeAppetite({ ...appetite, satietyAfterNormalMeal: v })}
        minLabel="Not satisfied"
        maxLabel="Fully satisfied"
      />
      <ScaleInput
        legend="Food preoccupation or cravings"
        name="foodPreoccupationOrCravings"
        min={0}
        max={4}
        value={appetite.foodPreoccupationOrCravings}
        onChange={(v) =>
          onChangeAppetite({ ...appetite, foodPreoccupationOrCravings: v })
        }
        minLabel="None"
        maxLabel="Constant"
      />
      <CheckboxField
        label="Binge or loss-of-control eating"
        checked={appetite.bingeOrLossOfControlEating ?? false}
        onChange={(checked) =>
          onChangeAppetite({
            ...appetite,
            bingeOrLossOfControlEating: checked || undefined,
          })
        }
      />

      <h3>Compulsive or impulsive urges</h3>
      <ScaleInput
        legend="Unusual spending urge"
        name="spendingUrge"
        min={0}
        max={4}
        value={urges.spendingUrge}
        onChange={(v) => onChangeUrges({ ...urges, spendingUrge: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Gambling urge"
        name="gamblingUrge"
        min={0}
        max={4}
        value={urges.gamblingUrge}
        onChange={(v) => onChangeUrges({ ...urges, gamblingUrge: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <ScaleInput
        legend="Unusually increased sexual drive"
        name="sexualDriveIncrease"
        min={0}
        max={4}
        value={urges.sexualDriveIncrease}
        onChange={(v) => onChangeUrges({ ...urges, sexualDriveIncrease: v })}
        minLabel="None"
        maxLabel="Severe"
      />
      <TextField
        label="Other repetitive or compulsive urge (optional)"
        value={urges.otherCompulsiveUrgeText ?? ''}
        onChange={(v) =>
          onChangeUrges({ ...urges, otherCompulsiveUrgeText: v || undefined })
        }
      />
    </section>
  )
}
