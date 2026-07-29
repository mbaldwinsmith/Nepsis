export interface QuickValue {
  value: string
  label: string
}

interface QuickValuesProps {
  label: string
  values: QuickValue[]
  onSelect: (value: string) => void
}

/** A row of shortcut buttons that prefill a nearby text/number field, e.g. common sleep durations. */
export function QuickValues({ label, values, onSelect }: QuickValuesProps) {
  return (
    <div className="quick-values" role="group" aria-label={label}>
      {values.map((v) => (
        <button
          key={v.value}
          type="button"
          className="quick-values__btn"
          onClick={() => onSelect(v.value)}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
