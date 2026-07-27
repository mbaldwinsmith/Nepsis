import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ToastProvider } from '../components/ToastProvider'
import { BottomNav } from '../components/BottomNav'
import { routes } from './routes'

function AppRoutes() {
  return useRoutes(routes)
}

export default function App() {
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
