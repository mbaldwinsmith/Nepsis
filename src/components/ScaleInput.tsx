import { useId } from 'react'

interface ScaleInputProps {
  legend: string
  name: string
  min: number
  max: number
  value: number | undefined
  onChange: (value: number) => void
  minLabel: string
  maxLabel: string
  hint?: string
}

/** An accessible integer-scale picker, e.g. 0 (none) to 4 (severe), or -2 to +2. */
export function ScaleInput({
  legend,
  name,
  min,
  max,
  value,
  onChange,
  minLabel,
  maxLabel,
  hint,
}: ScaleInputProps) {
  const groupId = useId()
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600, padding: 0 }}>{legend}</legend>
      {hint && <p className="hint">{hint}</p>}
      <div className="segmented" role="radiogroup" aria-label={legend}>
        {values.map((n) => {
          const optionId = `${groupId}-${n}`
          return (
            <span className="segmented-option" key={n}>
              <input
                type="radio"
                id={optionId}
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
              />
              <label htmlFor={optionId} aria-label={`${legend}: ${n}`}>
                {n}
              </label>
            </span>
          )
        })}
      </div>
      <div className="segmented-endpoints">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </fieldset>
  )
}
