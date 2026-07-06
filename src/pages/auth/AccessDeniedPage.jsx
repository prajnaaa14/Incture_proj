import { Box, Button, Paper, Typography } from '@mui/material'
import { SecurityRounded, ArrowBackRounded, HomeRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const AccessDeniedPage = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper sx={{ p: 5, maxWidth: 460, textAlign: 'center', borderRadius: 3 }} elevation={0} variant="outlined">
        <SecurityRounded sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Access Denied</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          You do not have the required permissions to view this module.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" startIcon={<ArrowBackRounded />} onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button variant="contained" startIcon={<HomeRounded />} onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AccessDeniedPage
