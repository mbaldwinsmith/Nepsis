import { Suspense, useEffect } from 'react'
import { HashRouter, useRoutes } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ToastProvider } from '../components/ToastProvider'
import { BottomNav } from '../components/BottomNav'
import { ensureDefaultRulesExist } from '../rules/defaultRules'
import { routes } from './routes'
import { UpdateNotice } from './UpdateNotice'
import { PrivacyCurtain } from './PrivacyCurtain'

function AppRoutes() {
  return useRoutes(routes)
}

export default function App() {
  useEffect(() => {
    ensureDefaultRulesExist()
  }, [])

  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <main style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <Suspense fallback={<p className="page">Loading…</p>}>
              <AppRoutes />
            </Suspense>
          </main>
          <BottomNav />
          <UpdateNotice />
          <PrivacyCurtain />
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}
