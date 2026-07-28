export function PrivacyPage() {
  return (
    <div className="page stack">
      <h1>Privacy</h1>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>What is stored</h2>
        <p>
          Daily check-ins, observer entries, plans and commitments, medications and
          transition events, health measurements, your personal baseline, safety plan, and
          review rule settings.
        </p>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>Where it is stored</h2>
        <p>
          Everything is stored locally in this browser's IndexedDB, on this device. There
          is no account, no cloud sync, and no server Nepsis sends data to.
        </p>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>What export does</h2>
        <p>
          CSV export and encrypted backup both create a file that downloads to this device
          — you choose where it goes from there. Free-text notes and observer labels are
          only included if you choose to include them.
        </p>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>What deleting data does</h2>
        <p>
          Deleting all data clears everything stored in this browser's IndexedDB. It
          cannot delete files you have already exported or backed up — those are already
          on your device, outside Nepsis's control.
        </p>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>Limits of device security</h2>
        <p>
          Nepsis does not add its own encryption on top of browser storage. Anyone with
          access to this unlocked device or browser profile can read this data. Use your
          device's own screen lock and encryption for real protection.
        </p>
        <p className="hint">
          The privacy curtain (in Settings) only deters a casual glance — it is not a
          password and does not encrypt anything.
        </p>
      </section>
    </div>
  )
}
