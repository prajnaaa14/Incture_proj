import { CssBaseline, ThemeProvider } from '@mui/material'
import { createContext, useContext, useMemo, useState } from 'react'
import { getEnterpriseTheme } from './theme'

const ThemeModeContext = createContext(null)

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light')

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'))
  }

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode])
  const theme = useMemo(() => getEnterpriseTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider')
  }

  return context
}
