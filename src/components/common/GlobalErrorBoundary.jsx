import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Component } from 'react'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper elevation={0} sx={{ maxWidth: 560, p: 4, border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <Stack spacing={2.5}>
              <Alert severity="error" sx={{ alignItems: 'flex-start' }}>
                Something went wrong while loading this experience.
              </Alert>
              <Typography variant="h5" fontWeight={700}>
                The app hit an unexpected issue.
              </Typography>
              <Typography color="text.secondary">
                A friendly fallback is shown instead of a broken screen. You can retry loading the app or refresh the page.
              </Typography>
              <Button variant="contained" onClick={this.handleReset} sx={{ alignSelf: 'flex-start' }}>
                Try again
              </Button>
            </Stack>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary
