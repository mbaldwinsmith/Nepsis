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
  const [editingId, setEditingId] = useState<string | undefined>()
  const [editLabel, setEditLabel] = useState('')
  const [editDetails, setEditDetails] = useState('')

  function add() {
    if (!newLabel.trim() || !newDetails.trim()) return
    onChange([
      ...contacts,
      { id: crypto.randomUUID(), label: newLabel.trim(), details: newDetails.trim() },
    ])
    setNewLabel('')
    setNewDetails('')
  }

  function startEdit(contact: Contact) {
    setEditingId(contact.id)
    setEditLabel(contact.label)
    setEditDetails(contact.details)
  }

  function saveEdit() {
    if (!editingId || !editLabel.trim() || !editDetails.trim()) return
    onChange(
      contacts.map((c) =>
        c.id === editingId
          ? { ...c, label: editLabel.trim(), details: editDetails.trim() }
          : c,
      ),
    )
    setEditingId(undefined)
  }

  return (
    <div className="stack">
      <h2 style={{ fontSize: 'var(--text-title)' }}>{label}</h2>
      {contacts.length === 0 && <p className="hint">None added yet.</p>}
      {contacts.map((c) =>
        editingId === c.id ? (
          <div key={c.id} className="stack" style={{ gap: 'var(--space-2)' }}>
            <TextField label="Edit label" value={editLabel} onChange={setEditLabel} />
            <TextField
              label="Edit details"
              value={editDetails}
              onChange={setEditDetails}
            />
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button type="button" className="btn btn-primary" onClick={saveEdit}>
                Save
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setEditingId(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            key={c.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span>
              <strong>{c.label}</strong> — {c.details}
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
              <button type="button" className="btn" onClick={() => startEdit(c)}>
                Edit
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onChange(contacts.filter((x) => x.id !== c.id))}
              >
                Remove
              </button>
            </div>
          </div>
        ),
      )}
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
  const [saving, setSaving] = useState(false)

  useEffect(() => setDraft(plan), [plan])

  async function handleSave() {
    setSaving(true)
    try {
      await save(draft)
      showToast('Safety plan saved', 'success')
    } catch {
      showToast('Could not save your safety plan. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
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

      <section
        className="card stack"
        style={{ borderLeft: '3px solid var(--color-review)' }}
      >
        <h2 style={{ fontSize: 'var(--text-title)' }}>Review</h2>
        <TextField
          label="What 'review' means for me"
          multiline
          value={draft.reviewActions ?? ''}
          onChange={(reviewActions) =>
            setDraft({ ...draft, reviewActions: reviewActions || undefined })
          }
        />
      </section>

      <section
        className="card stack"
        style={{
          borderLeft: '3px solid var(--color-urgent)',
          background: 'var(--color-urgent-bg)',
        }}
      >
        <h2 style={{ fontSize: 'var(--text-title)' }}>Act</h2>
        <TextField
          label="What 'act' means for me"
          multiline
          value={draft.urgentActions ?? ''}
          onChange={(urgentActions) =>
            setDraft({ ...draft, urgentActions: urgentActions || undefined })
          }
        />
      </section>

      <section className="card stack">
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

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save safety plan'}
      </button>
    </div>
  )
}
