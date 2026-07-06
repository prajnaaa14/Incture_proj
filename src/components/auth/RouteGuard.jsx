import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { Box, Button, Paper, Typography } from '@mui/material'
import { SecurityRounded, ArrowBackRounded } from '@mui/icons-material'

const AccessDenied = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
    <Paper sx={{ p: 5, maxWidth: 460, textAlign: 'center', borderRadius: 3 }} elevation={0} variant="outlined">
      <SecurityRounded sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Access Denied</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        You do not have the required role permissions to view this module.
      </Typography>
      <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => window.history.back()}>
        Go Back
      </Button>
    </Paper>
  </Box>
)

const RouteGuard = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <AccessDenied />
  }

  return children
}

export default RouteGuard
