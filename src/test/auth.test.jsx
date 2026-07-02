import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import uiReducer from '../store/slices/uiSlice'

const renderWithProviders = (ui, preloadedState = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
    preloadedState,
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={ui} />
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('auth forms', () => {
  it('validates login form and shows errors', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
  })

  it('submits valid login values', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), 'asha.rao@enterprise.com')
    await user.type(screen.getByLabelText(/password/i), 'Admin123!')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
    })
  })

  it('keeps the login page visible for an authenticated user', () => {
    renderWithProviders(<LoginPage />, {
      auth: {
        user: { name: 'Asha Rao', role: 'admin' },
        isAuthenticated: true,
        status: 'succeeded',
        error: null,
        lastLogin: null,
        sessionExpired: false,
      },
    })

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.queryByText(/dashboard page/i)).not.toBeInTheDocument()
  })

  it('validates forgot password and shows success state', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordPage />)

    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email/i), 'asharao@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/reset link sent/i)).toBeInTheDocument()
  })
})
