import { useEffect, useState } from 'react'
import { TextField } from '../../components/TextField'
import { useToast } from '../../components/toastContext'
import { useSafetyPlan } from './useSafetyPlan'
import type { Contact } from '../../data/schemas'
import { todayIsoDate } from '../../utils/date'

function ContactList({
  label,
  contacts,
  onChange,
}: {
  label: string
  contacts: Contact[]
  onChange: (contacts: Contact[]) => void
}) {
  const [newLabel, setNewLabel] = useState('')
  const [newDetails, setNewDetails] = useState('')

  function add() {
    if (!newLabel.trim() || !newDetails.trim()) return
    onChange([
      ...contacts,
      { id: crypto.randomUUID(), label: newLabel.trim(), details: newDetails.trim() },
    ])
    setNewLabel('')
    setNewDetails('')
  }

  return (
    <div className="stack">
      <h2 style={{ fontSize: '1rem' }}>{label}</h2>
      {contacts.length === 0 && <p className="hint">None added yet.</p>}
      {contacts.map((c) => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'var(--space-2)',
          }}
        >
          <span>
            <strong>{c.label}</strong> — {c.details}
          </span>
          <button
            type="button"
            className="btn"
            onClick={() => onChange(contacts.filter((x) => x.id !== c.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <TextField label="Label" value={newLabel} onChange={setNewLabel} />
        <TextField label="Details" value={newDetails} onChange={setNewDetails} />
      </div>
      <button type="button" className="btn" onClick={add}>
        Add contact
      </button>
    </div>
  )
}

export function SafetyPlanPage() {
  const { plan, loading, save } = useSafetyPlan()
  const { showToast } = useToast()
  const [draft, setDraft] = useState(plan)

  useEffect(() => setDraft(plan), [plan])

  async function handleSave() {
    await save(draft)
    showToast('Safety plan saved', 'success')
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="page stack">
      <h1>Safety plan</h1>
      <p className="hint">
        Urgent concerns should follow your existing clinical, emergency, or crisis plan.
        Nepsis cannot generate emergency instructions or contact numbers for you.
      </p>

      <section className="card stack">
        <ContactList
          label="Prescribing team contacts"
          contacts={draft.prescribingTeamContacts ?? []}
          onChange={(prescribingTeamContacts) =>
            setDraft({ ...draft, prescribingTeamContacts })
          }
        />
        <ContactList
          label="Trusted contacts"
          contacts={draft.trustedContacts ?? []}
          onChange={(trustedContacts) => setDraft({ ...draft, trustedContacts })}
        />
      </section>

      <section className="card stack">
        <TextField
          label="What 'review' means for me"
          multiline
          value={draft.reviewActions ?? ''}
          onChange={(reviewActions) =>
            setDraft({ ...draft, reviewActions: reviewActions || undefined })
          }
        />
        <TextField
          label="What 'act' means for me"
          multiline
          value={draft.urgentActions ?? ''}
          onChange={(urgentActions) =>
            setDraft({ ...draft, urgentActions: urgentActions || undefined })
          }
        />
        <TextField
          label="Instructions already agreed with clinicians or supporters"
          multiline
          value={draft.crisisInstructions ?? ''}
          onChange={(crisisInstructions) =>
            setDraft({ ...draft, crisisInstructions: crisisInstructions || undefined })
          }
        />
        <TextField
          label="Last reviewed"
          type="date"
          value={draft.lastReviewedDate ?? todayIsoDate()}
          onChange={(lastReviewedDate) => setDraft({ ...draft, lastReviewedDate })}
        />
      </section>

      <button type="button" className="btn btn-primary" onClick={handleSave}>
        Save safety plan
      </button>
    </div>
  )
}
