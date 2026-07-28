import { lazy } from 'react'

// Home and check-in are the two most prominent, most-visited routes (see
// TASKS.md Phase 1), so they stay in the initial bundle for instant first
// interaction (imported eagerly in routes.tsx). Every other route is loaded
// on demand to keep that initial bundle small.
export const MorePage = lazy(() =>
  import('./MorePage').then((m) => ({ default: m.MorePage })),
)
export const ObserverPage = lazy(() =>
  import('../features/observers/ObserverPage').then((m) => ({ default: m.ObserverPage })),
)
export const CommitmentsPage = lazy(() =>
  import('../features/commitments/CommitmentsPage').then((m) => ({
    default: m.CommitmentsPage,
  })),
)
export const MedicationPage = lazy(() =>
  import('../features/medication/MedicationPage').then((m) => ({
    default: m.MedicationPage,
  })),
)
export const HealthPage = lazy(() =>
  import('../features/health/HealthPage').then((m) => ({ default: m.HealthPage })),
)
export const TrendsPage = lazy(() =>
  import('../features/trends/TrendsPage').then((m) => ({ default: m.TrendsPage })),
)
export const SafetyPlanPage = lazy(() =>
  import('../features/safety-plan/SafetyPlanPage').then((m) => ({
    default: m.SafetyPlanPage,
  })),
)
export const SettingsPage = lazy(() =>
  import('../features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
export const RulesPage = lazy(() =>
  import('../features/rules/RulesPage').then((m) => ({ default: m.RulesPage })),
)
export const DataManagementPage = lazy(() =>
  import('../features/data-management/DataManagementPage').then((m) => ({
    default: m.DataManagementPage,
  })),
)
export const InstallHelpPage = lazy(() =>
  import('../features/install/InstallHelpPage').then((m) => ({
    default: m.InstallHelpPage,
  })),
)
export const PrivacyPage = lazy(() =>
  import('../features/privacy/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
)
