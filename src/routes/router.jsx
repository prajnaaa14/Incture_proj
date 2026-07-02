import { Box, Skeleton, Stack } from '@mui/material'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import RouteGuard from '../components/auth/RouteGuard'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'))
const SessionExpiredPage = lazy(() => import('../pages/auth/SessionExpiredPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const ProcurementPage = lazy(() => import('../pages/procurement/ProcurementPage'))
const ProcurementDetailPage = lazy(() => import('../pages/procurement/ProcurementDetailPage'))
const VendorsPage = lazy(() => import('../pages/vendors/VendorsPage'))
const VendorDetailPage = lazy(() => import('../pages/vendors/VendorDetailPage'))
const RiskPage = lazy(() => import('../pages/risk/RiskPage'))
const CompliancePage = lazy(() => import('../pages/compliance/CompliancePage'))
const AuditPage = lazy(() => import('../pages/audit/AuditPage'))
const ApprovalsPage = lazy(() => import('../pages/approvals/ApprovalsPage'))
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'))
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'))
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'))

const PageLoadingFallback = () => (
  <Box sx={{ p: 3 }}>
    <Stack spacing={2}>
      <Skeleton variant="text" width="40%" height={32} />
      <Skeleton variant="rectangular" height={96} />
      <Skeleton variant="rectangular" height={220} />
    </Stack>
  </Box>
)

const withSuspense = (element) => <Suspense fallback={<PageLoadingFallback />}>{element}</Suspense>
const withProtectedRoute = (element, allowedRoles) => withSuspense(<RouteGuard allowedRoles={allowedRoles}>{element}</RouteGuard>)

const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginPage />),
  },
  {
    path: '/forgot-password',
    element: withSuspense(<ForgotPasswordPage />),
  },
  {
    path: '/reset-password',
    element: withSuspense(<ResetPasswordPage />),
  },
  {
    path: '/session-expired',
    element: withSuspense(<SessionExpiredPage />),
  },
  {
    path: '/',
    element: (
      <RouteGuard>
        <MainLayout>
          <Navigate to="/dashboard" replace />
        </MainLayout>
      </RouteGuard>
    ),
  },
  {
    path: '/',
    element: (
      <RouteGuard>
        <MainLayout />
      </RouteGuard>
    ),
    children: [
      { path: 'dashboard', element: withProtectedRoute(<DashboardPage />, ['admin', 'manager', 'employee', 'auditor']) },
      { path: 'procurement', element: withProtectedRoute(<ProcurementPage />, ['admin', 'manager', 'employee']) },
      { path: 'procurement/:id', element: withProtectedRoute(<ProcurementDetailPage />, ['admin', 'manager', 'employee']) },
      { path: 'vendors', element: withProtectedRoute(<VendorsPage />, ['admin', 'manager']) },
      { path: 'vendors/:id', element: withProtectedRoute(<VendorDetailPage />, ['admin', 'manager']) },
      { path: 'risk', element: withProtectedRoute(<RiskPage />, ['admin', 'manager', 'employee', 'auditor']) },
      { path: 'compliance', element: withProtectedRoute(<CompliancePage />, ['admin', 'manager', 'employee', 'auditor']) },
      { path: 'audit', element: withProtectedRoute(<AuditPage />, ['admin', 'auditor']) },
      { path: 'approvals', element: withProtectedRoute(<ApprovalsPage />, ['admin', 'manager']) },
      { path: 'notifications', element: withProtectedRoute(<NotificationsPage />, ['admin', 'manager', 'employee']) },
      { path: 'reports', element: withProtectedRoute(<ReportsPage />, ['admin', 'manager', 'auditor']) },
      { path: 'settings', element: withProtectedRoute(<SettingsPage />, ['admin', 'manager', 'employee', 'auditor']) },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])

export default router
