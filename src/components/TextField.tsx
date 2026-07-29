import { useId } from 'react'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  type?: 'text' | 'date' | 'time' | 'number' | 'datetime-local' | 'password'
  multiline?: boolean
  min?: number
  max?: string
  step?: number
  required?: boolean
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  type = 'text',
  multiline = false,
  min,
  max,
  step,
  required,
}: TextFieldProps) {
  const fieldId = useId()

  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      {hint && <p className="hint">{hint}</p>}
      {multiline ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required={required}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          required={required}
        />
      )}
    </div>
  )
}
