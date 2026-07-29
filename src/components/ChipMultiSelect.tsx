import { useId } from 'react'

export interface ChipOption<T extends string> {
  value: T
  label: string
}

interface ChipMultiSelectProps<T extends string> {
  legend: string
  name: string
  options: ChipOption<T>[]
  values: T[]
  onChange: (values: T[]) => void
  hint?: string
}

/** A multi-select control built on native checkboxes, styled as a row of tappable chips. */
export function ChipMultiSelect<T extends string>({
  legend,
  name,
  options,
  values,
  onChange,
  hint,
}: ChipMultiSelectProps<T>) {
  const groupId = useId()

  function toggle(option: T) {
    const next = values.includes(option)
      ? values.filter((v) => v !== option)
      : [...values, option]
    onChange(next)
  }

  return (
    <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600, padding: 0 }}>{legend}</legend>
      {hint && <p className="hint">{hint}</p>}
      <div className="segmented">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <span className="segmented-option chip-option" key={option.value}>
              <input
                type="checkbox"
                id={optionId}
                name={name}
                checked={values.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <label htmlFor={optionId}>{option.label}</label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}
