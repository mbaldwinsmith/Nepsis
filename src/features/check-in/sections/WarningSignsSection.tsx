import { CheckboxField } from '../../../components/CheckboxField'
import type { WarningSigns } from '../../../data/schemas'

interface Props {
  value: WarningSigns
  onChange: (value: WarningSigns) => void
}

const signs: { key: keyof WarningSigns & string; label: string }[] = [
  { key: 'headBuzz', label: 'Head buzz' },
  { key: 'tightShoulders', label: 'Tight shoulders' },
  { key: 'shallowBreathing', label: 'Shallow breathing' },
  { key: 'pressuredSpeech', label: 'Pressured or unusually rapid speech' },
  { key: 'unusualIdeas', label: 'Unusually numerous ideas or projects' },
  { key: 'unusuallyDrivenBehaviour', label: 'Unusually driven behaviour' },
]

export function WarningSignsSection({ value, onChange }: Props) {
  return (
    <section className="card stack">
      <h2>Personal warning signs</h2>
      <p className="hint">Mark any of your agreed early-warning signs noticed today.</p>
      {signs.map((sign) => (
        <CheckboxField
          key={sign.key}
          label={sign.label}
          checked={value[sign.key] === true}
          onChange={(checked) => onChange({ ...value, [sign.key]: checked || undefined })}
        />
      ))}
    </section>
  )
}
