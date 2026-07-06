import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeModeProvider } from '../theme/ThemeModeContext'
import SettingsPage from '../pages/settings/SettingsPage'
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'

const renderWithTheme = (ui) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { name: 'Asha Rao', email: 'asha.rao@company.com', department: 'Operations', role: 'admin' },
        isAuthenticated: true
      }
    }
  })
  return render(
    <Provider store={store}>
      <ThemeModeProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeModeProvider>
    </Provider>
  )
}

describe('SettingsPage', () => {
  it('renders tabs and switches between them', async () => {
    const user = userEvent.setup()
    renderWithTheme(<SettingsPage />)
    
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    
    // Check if Profile tab is active
    expect(screen.getByText(/Full Name/i, { selector: 'label' })).toBeInTheDocument()
    
    // Switch to Security tab
    await user.click(screen.getByRole('tab', { name: /Security/i }))
    expect(screen.getByText(/Current Password/i, { selector: 'label' })).toBeInTheDocument()
    
    // Switch to Theme tab
    await user.click(screen.getByRole('tab', { name: /Theme/i }))
    expect(screen.queryByText(/Dark Mode/i) || screen.queryByText(/Light Mode/i)).toBeTruthy()
  })
})
