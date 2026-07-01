import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import DashboardPage from '../pages/dashboard/DashboardPage'
import dashboardReducer from '../store/slices/dashboardSlice'
import riskReducer from '../store/slices/riskSlice'
import vendorReducer from '../store/slices/vendorSlice'
import notificationReducer from '../store/slices/notificationSlice'
import uiReducer from '../store/slices/uiSlice'

jest.mock('recharts', () => {
  const React = require('react')
  const createMock = (name) => ({ children, ...props }) => React.createElement(name, props, children)

  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: createMock('div'),
    BarChart: createMock('div'),
    LineChart: createMock('div'),
    PieChart: createMock('div'),
    CartesianGrid: createMock('div'),
    XAxis: createMock('div'),
    YAxis: createMock('div'),
    Tooltip: createMock('div'),
    Legend: createMock('div'),
    Line: createMock('div'),
    Area: createMock('div'),
    Bar: createMock('div'),
    Pie: createMock('div'),
    Cell: createMock('div'),
  }
})

const renderDashboard = (preloadedState) => {
  const store = configureStore({
    reducer: {
      dashboard: dashboardReducer,
      risk: riskReducer,
      vendor: vendorReducer,
      notification: notificationReducer,
      ui: uiReducer,
    },
    preloadedState,
  })

  return render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  )
}

describe('DashboardPage', () => {
  it('renders KPI cards and the dashboard heading', () => {
    renderDashboard({
      dashboard: { summary: { revenue: 1000, margin: 10, openDeals: 2, riskExposure: 1 }, trend: [{ label: 'Jan', value: 10 }], status: 'succeeded', error: null, updatedAt: '2026-06-29' },
      risk: { items: [{ id: 'R-1', title: 'Test', severity: 'High', status: 'Open' }], status: 'succeeded', error: null },
      vendor: { vendors: [{ id: 'V-1', name: 'Test Vendor', score: 90, segment: 'Strategic' }], status: 'succeeded', error: null },
      notification: { items: [{ id: 'N-1', message: 'Test notification', type: 'Approval', priority: 'High', isRead: false, timestamp: '2026-06-29T09:10:00' }], status: 'succeeded', error: null },
      ui: { globalLoading: false, snackbars: [], sidebarCollapsed: false, activeModule: 'dashboard' },
    })

    expect(screen.getByText(/executive dashboard/i)).toBeInTheDocument()
    expect(screen.getByText('Total Requests')).toBeInTheDocument()
    expect(screen.getByText('Pending', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Approved', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Rejected', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Total Vendors', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Active Risks', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Compliance Issues', { selector: 'p' })).toBeInTheDocument()
  })

  it('shows skeleton state while dashboard data is loading', () => {
    renderDashboard({
      dashboard: { summary: null, trend: [], status: 'loading', error: null, updatedAt: null },
      risk: { items: [], status: 'idle', error: null },
      vendor: { vendors: [], status: 'idle', error: null },
      notification: { items: [], status: 'idle', error: null },
      ui: { globalLoading: false, snackbars: [], sidebarCollapsed: false, activeModule: 'dashboard' },
    })

    expect(screen.getByText(/loading dashboard data and analytics snapshots/i)).toBeInTheDocument()
  })

  it('renders fallback trend data when no trend points are available', () => {
    renderDashboard({
      dashboard: { summary: { revenue: 1000, margin: 10, openDeals: 2, riskExposure: 1 }, trend: [], status: 'succeeded', error: null, updatedAt: '2026-06-29' },
      risk: { items: [], status: 'succeeded', error: null },
      vendor: { vendors: [], status: 'succeeded', error: null },
      notification: { items: [], status: 'succeeded', error: null },
      ui: { globalLoading: false, snackbars: [], sidebarCollapsed: false, activeModule: 'dashboard' },
    })

    expect(screen.getByText(/monthly procurement trend/i)).toBeInTheDocument()
    expect(screen.getByText(/risk trend/i)).toBeInTheDocument()
  })
})
