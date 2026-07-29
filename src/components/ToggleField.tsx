interface ToggleFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  disabled?: boolean
}

/** A switch-style yes/no toggle for "did this happen today" questions. */
export function ToggleField({
  label,
  checked,
  onChange,
  hint,
  disabled,
}: ToggleFieldProps) {
  return (
    <div className="field">
      <label className="toggle-field" style={{ opacity: disabled ? 0.5 : 1 }}>
        <span>{label}</span>
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="toggle-field__input"
        />
        <span className="toggle-field__track" aria-hidden="true">
          <span className="toggle-field__thumb" />
        </span>
      </label>
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}
