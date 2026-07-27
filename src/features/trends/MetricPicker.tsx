import { CheckboxField } from '../../components/CheckboxField'
import { metricDefinitions, metricKeys, type MetricKey } from './metrics'

const MAX_METRICS = 3

interface Props {
  selected: MetricKey[]
  onChange: (selected: MetricKey[]) => void
}

export function MetricPicker({ selected, onChange }: Props) {
  const atLimit = selected.length >= MAX_METRICS

  function toggle(key: MetricKey, checked: boolean) {
    if (checked) {
      if (atLimit) return
      onChange([...selected, key])
    } else {
      onChange(selected.filter((k) => k !== key))
    }
  }

  return (
    <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600 }}>Metrics (up to 3)</legend>
      <p className="hint">Choose up to three metrics to compare on the same chart.</p>
      <div className="stack">
        {metricKeys.map((key) => {
          const isSelected = selected.includes(key)
          return (
            <CheckboxField
              key={key}
              label={metricDefinitions[key].label}
              checked={isSelected}
              disabled={!isSelected && atLimit}
              onChange={(checked) => toggle(key, checked)}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
