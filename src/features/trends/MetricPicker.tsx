import { ChipMultiSelect } from '../../components/ChipMultiSelect'
import { metricDefinitions, metricKeys, type MetricKey } from './metrics'

const MAX_METRICS = 3

interface Props {
  selected: MetricKey[]
  onChange: (selected: MetricKey[]) => void
}

export function MetricPicker({ selected, onChange }: Props) {
  return (
    <ChipMultiSelect
      legend="Metrics (up to 3)"
      name="trendMetric"
      options={metricKeys.map((key) => ({
        value: key,
        label: metricDefinitions[key].label,
      }))}
      values={selected}
      onChange={onChange}
      hint="Choose up to three metrics to compare on the same chart."
      isOptionDisabled={() => selected.length >= MAX_METRICS}
    />
  )
}
