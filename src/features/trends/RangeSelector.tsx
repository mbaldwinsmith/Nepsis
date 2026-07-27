import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'

export type RangePreset = '7' | '30' | 'custom'

interface Props {
  preset: RangePreset
  customStart: string
  customEnd: string
  onPresetChange: (preset: RangePreset) => void
  onCustomStartChange: (date: string) => void
  onCustomEndChange: (date: string) => void
}

export function RangeSelector({
  preset,
  customStart,
  customEnd,
  onPresetChange,
  onCustomStartChange,
  onCustomEndChange,
}: Props) {
  return (
    <div className="stack">
      <SegmentedControl
        legend="Date range"
        name="trendRangePreset"
        options={[
          { value: '7', label: 'Last 7 days' },
          { value: '30', label: 'Last 30 days' },
          { value: 'custom', label: 'Custom' },
        ]}
        value={preset}
        onChange={onPresetChange}
      />
      {preset === 'custom' && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <TextField
            label="Start"
            type="date"
            value={customStart}
            onChange={onCustomStartChange}
          />
          <TextField
            label="End"
            type="date"
            value={customEnd}
            onChange={onCustomEndChange}
          />
        </div>
      )}
    </div>
  )
}
