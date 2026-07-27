import { useAlertRules } from './useAlertRules'
import { RuleCard } from './RuleCard'

export function RulesPage() {
  const { rules, loading, update, duplicate } = useAlertRules()

  return (
    <div className="page stack">
      <h1>Review rules</h1>
      <p className="hint">
        Review prompts are deterministic and disabled by default. Enabling a rule never
        diagnoses a condition or recommends a medication change — it only points out a
        recorded pattern worth reviewing with your support plan.
      </p>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="stack">
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onUpdate={update}
              onDuplicate={duplicate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
