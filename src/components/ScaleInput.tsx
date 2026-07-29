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
  /** Word for each value from min to max, e.g. ['none', 'slight', 'mild', 'marked', 'severe']. */
  words: string[]
  hint?: string
}

/** An accessible word-labelled scale picker, e.g. none to severe, or much slower to much faster. */
export function ScaleInput({
  legend,
  name,
  min,
  max,
  value,
  onChange,
  minLabel,
  maxLabel,
  words,
  hint,
}: ScaleInputProps) {
  const groupId = useId()
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <fieldset
      className="field scale-input"
      style={{ border: 'none', padding: 0, margin: 0 }}
    >
      <legend style={{ fontWeight: 600, padding: 0 }}>
        {legend}
        {value === undefined && <span className="scale-input__status">not yet</span>}
      </legend>
      {hint && <p className="hint">{hint}</p>}
      <div className="segmented" role="radiogroup" aria-label={legend}>
        {values.map((n, i) => {
          const optionId = `${groupId}-${n}`
          const word = words[i]
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
              <label htmlFor={optionId} aria-label={`${legend}: ${word}`}>
                {word}
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
