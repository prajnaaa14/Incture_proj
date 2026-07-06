import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeModeProvider } from '../theme/ThemeModeContext'
import SettingsPage from '../pages/settings/SettingsPage'
import userEvent from '@testing-library/user-event'

const renderWithTheme = (ui) => {
  return render(
    <ThemeModeProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </ThemeModeProvider>
  )
}

describe('SettingsPage', () => {
  it('renders tabs and switches between them', async () => {
    const user = userEvent.setup()
    renderWithTheme(<SettingsPage />)
    
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    
    // Check if Profile tab is active
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument()
    
    // Switch to Security tab
    await user.click(screen.getByRole('tab', { name: /Security/i }))
    expect(screen.getByText(/Current Password/i)).toBeInTheDocument()
    
    // Switch to Theme tab
    await user.click(screen.getByRole('tab', { name: /Theme/i }))
    expect(screen.getByText(/Dark Mode/i) || screen.getByText(/Light Mode/i)).toBeTruthy()
  })
})
