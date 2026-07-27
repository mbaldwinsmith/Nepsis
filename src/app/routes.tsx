import type { RouteObject } from 'react-router-dom'
import { HomePage } from './HomePage'
import { MorePage } from './MorePage'
import { CheckInPage } from '../features/check-in/CheckInPage'
import { ObserverPage } from '../features/observers/ObserverPage'
import { CommitmentsPage } from '../features/commitments/CommitmentsPage'
import { MedicationPage } from '../features/medication/MedicationPage'
import { HealthPage } from '../features/health/HealthPage'
import { TrendsPage } from '../features/trends/TrendsPage'
import { SafetyPlanPage } from '../features/safety-plan/SafetyPlanPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { RulesPage } from '../features/rules/RulesPage'
import { DataManagementPage } from '../features/data-management/DataManagementPage'

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/check-in', element: <CheckInPage /> },
  { path: '/observer', element: <ObserverPage /> },
  { path: '/commitments', element: <CommitmentsPage /> },
  { path: '/health', element: <HealthPage /> },
  { path: '/medication', element: <MedicationPage /> },
  { path: '/trends', element: <TrendsPage /> },
  { path: '/safety-plan', element: <SafetyPlanPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/settings/rules', element: <RulesPage /> },
  { path: '/settings/data', element: <DataManagementPage /> },
  { path: '/more', element: <MorePage /> },
]
