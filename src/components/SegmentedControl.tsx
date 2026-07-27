import { useId } from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  legend: string
  name: string
  options: SegmentedOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  hint?: string
}

/**
 * A keyboard- and screen-reader-accessible single-select control built on
 * native radio inputs, styled to read as a row of tappable segments.
 */
export function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
}: SegmentedControlProps<T>) {
  const groupId = useId()

  return (
    <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600, padding: 0 }}>{legend}</legend>
      {hint && <p className="hint">{hint}</p>}
      <div className="segmented" role="radiogroup" aria-label={legend}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <span className="segmented-option" key={option.value}>
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <label htmlFor={optionId}>{option.label}</label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}
