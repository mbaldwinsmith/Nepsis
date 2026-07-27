import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import { CheckboxField } from '../../components/CheckboxField'
import { getRuleTypeDefinition } from '../../rules/ruleTypes'
import { resolveParams } from '../../rules/params'
import type { AlertRule } from '../../data/schemas'

interface Props {
  rule: AlertRule
  onUpdate: (rule: AlertRule) => void
  onDuplicate: (rule: AlertRule) => void
}

export function RuleCard({ rule, onUpdate, onDuplicate }: Props) {
  const def = getRuleTypeDefinition(rule.ruleType)
  const params = resolveParams(def.paramSchema, rule.params)
  const preview = def.describe(params, rule.lookbackDays)

  function setParam(key: string, value: number) {
    onUpdate({ ...rule, params: { ...rule.params, [key]: value } })
  }

  return (
    <div className="card stack">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
        }}
      >
        <div>
          <strong>{rule.label}</strong>
          <p className="hint" style={{ margin: 0 }}>
            {rule.source === 'default' ? 'Built-in rule' : 'Your copy'}
          </p>
        </div>
        <CheckboxField
          label="Enabled"
          checked={rule.enabled}
          onChange={(enabled) => onUpdate({ ...rule, enabled })}
        />
      </div>

      <TextField
        label="Label"
        value={rule.label}
        onChange={(label) => onUpdate({ ...rule, label })}
      />
      <TextField
        label="Description"
        multiline
        value={rule.description ?? ''}
        onChange={(description) =>
          onUpdate({ ...rule, description: description || undefined })
        }
      />
      <SegmentedControl
        legend="Severity"
        name={`severity-${rule.id}`}
        options={[
          { value: 'review', label: 'Review' },
          { value: 'act', label: 'Act' },
        ]}
        value={rule.severity}
        onChange={(severity) => onUpdate({ ...rule, severity })}
      />
      <TextField
        label="Lookback (days)"
        type="number"
        min={1}
        value={String(rule.lookbackDays)}
        onChange={(v) => onUpdate({ ...rule, lookbackDays: Math.max(1, Number(v) || 1) })}
      />

      {def.paramSchema.length > 0 && (
        <fieldset className="field" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600 }}>Thresholds</legend>
          <div className="stack">
            {def.paramSchema.map((spec) => (
              <TextField
                key={spec.key}
                label={spec.label}
                type="number"
                min={spec.min}
                step={spec.step}
                value={String(params[spec.key])}
                onChange={(v) => setParam(spec.key, Number(v))}
              />
            ))}
          </div>
        </fieldset>
      )}

      <TextField
        label="Action text"
        multiline
        value={rule.actionText}
        onChange={(actionText) => onUpdate({ ...rule, actionText })}
      />

      <div
        className="card"
        style={{ background: 'var(--color-surface-raised)', boxShadow: 'none' }}
      >
        <p className="hint" style={{ margin: 0 }}>
          Plain-language preview
        </p>
        <p style={{ margin: 0 }}>{preview}</p>
      </div>

      <button type="button" className="btn" onClick={() => onDuplicate(rule)}>
        Duplicate
      </button>
    </div>
  )
}
