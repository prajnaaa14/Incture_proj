import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import RouteGuard from '../components/auth/RouteGuard'
import authReducer from '../store/slices/authSlice'

const renderWithStore = (authState, initialPath = '/secure', allowedRoles) => {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState: { auth: authState } })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/secure" element={<RouteGuard allowedRoles={allowedRoles}><div>Protected</div></RouteGuard>} />
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
          <Route path="/notifications" element={<RouteGuard><div>Notifications page</div></RouteGuard>} />
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/access-denied" element={<div>Access Denied page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('RouteGuard', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithStore({
      isAuthenticated: false,
      user: null,
      status: 'idle',
      error: null,
      lastLogin: null,
      sessionExpired: false,
    })

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })

  it('redirects users who are not in the allowed roles', () => {
    renderWithStore({
      isAuthenticated: true,
      user: { role: 'employee' },
      status: 'succeeded',
      error: null,
      lastLogin: null,
      sessionExpired: false,
    }, '/secure', ['admin'])

    expect(screen.getByText(/access denied page/i)).toBeInTheDocument()
  })

  it('renders children for employees on allowed routes', () => {
    renderWithStore({
      isAuthenticated: true,
      user: { role: 'employee' },
      status: 'succeeded',
      error: null,
      lastLogin: null,
      sessionExpired: false,
    }, '/notifications')

    expect(screen.getByText(/notifications page/i)).toBeInTheDocument()
  })
})
