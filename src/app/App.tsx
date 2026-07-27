import { useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ToastProvider } from '../components/ToastProvider'
import { BottomNav } from '../components/BottomNav'
import { ensureDefaultRulesExist } from '../rules/defaultRules'
import { routes } from './routes'

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
        <BrowserRouter>
          <AppRoutes />
          <BottomNav />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}
