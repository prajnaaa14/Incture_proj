import { createTheme } from '@mui/material/styles'

export const getEnterpriseTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#5aa9ff' : '#0f6cbd',
        light: mode === 'dark' ? '#8ec5ff' : '#4a91d6',
        dark: mode === 'dark' ? '#2f77c2' : '#0b4f8a',
      },
      secondary: {
        main: mode === 'dark' ? '#7dd3fc' : '#2563eb',
      },
      background: {
        default: mode === 'dark' ? '#07111f' : '#f4f7fb',
        paper: mode === 'dark' ? '#0f172a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#e2e8f0' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#475569',
      },
      divider: mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.1)',
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage:
              mode === 'dark'
                ? 'linear-gradient(90deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.95))'
                : 'linear-gradient(90deg, rgba(255,255,255,0.96), rgba(241,245,249,0.95))',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.08)'}`,
            color: mode === 'dark' ? '#e2e8f0' : '#0f172a',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.08)'}`,
            backgroundImage: mode === 'dark' ? 'linear-gradient(180deg, #0f172a, #111827)' : 'linear-gradient(180deg, #f8fafc, #eef2ff)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: mode === 'dark' ? '0 12px 30px rgba(2, 8, 23, 0.35)' : '0 12px 30px rgba(15, 23, 42, 0.08)',
            border: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.14)' : 'rgba(15,23,42,0.06)'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '8px 16px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '4px 8px',
          },
        },
      },
    },
  })
