import type { RouteObject } from 'react-router-dom'
import { HomePage } from './HomePage'
import { CheckInPage } from '../features/check-in/CheckInPage'
import {
  MorePage,
  ObserverPage,
  CommitmentsPage,
  MedicationPage,
  HealthPage,
  TrendsPage,
  SafetyPlanPage,
  SettingsPage,
  RulesPage,
  DataManagementPage,
  InstallHelpPage,
  PrivacyPage,
} from './lazyPages'

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/check-in', element: <CheckInPage /> },
  { path: '/check-in/:date', element: <CheckInPage /> },
  { path: '/observer', element: <ObserverPage /> },
  { path: '/commitments', element: <CommitmentsPage /> },
  { path: '/health', element: <HealthPage /> },
  { path: '/medication', element: <MedicationPage /> },
  { path: '/trends', element: <TrendsPage /> },
  { path: '/safety-plan', element: <SafetyPlanPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/settings/rules', element: <RulesPage /> },
  { path: '/settings/data', element: <DataManagementPage /> },
  { path: '/settings/install', element: <InstallHelpPage /> },
  { path: '/settings/privacy', element: <PrivacyPage /> },
  { path: '/more', element: <MorePage /> },
]
