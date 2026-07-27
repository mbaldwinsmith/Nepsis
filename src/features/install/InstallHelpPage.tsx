export function InstallHelpPage() {
  return (
    <div className="page stack">
      <h1>Install Nepsis</h1>
      <p>
        Installing adds Nepsis to your home screen and lets it work fully offline, without
        the browser's address bar or tabs around it. Nothing changes about where your data
        is stored — it's still local to this browser.
      </p>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>iPhone or iPad (Safari)</h2>
        <ol>
          <li>Tap the Share icon.</li>
          <li>Scroll down and tap "Add to Home Screen".</li>
          <li>Tap "Add".</li>
        </ol>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>Android (Chrome)</h2>
        <ol>
          <li>Tap the menu (⋮) in the top right.</li>
          <li>Tap "Install app" or "Add to Home screen".</li>
          <li>Confirm by tapping "Install".</li>
        </ol>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: '1rem' }}>Desktop (Chrome or Edge)</h2>
        <ol>
          <li>Look for the install icon at the right edge of the address bar.</li>
          <li>Click it, then click "Install".</li>
        </ol>
      </section>

      <p className="hint">
        Already installed apps keep working offline once they've been opened online at
        least once.
      </p>
    </div>
  )
}
