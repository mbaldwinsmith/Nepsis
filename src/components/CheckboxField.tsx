interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  disabled?: boolean
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div className="field">
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: '20px', height: '20px' }}
        />
        {label}
      </label>
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}
