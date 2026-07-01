import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const SessionExpiredPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
    <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Session expired
          </Typography>
          <Typography color="text.secondary">
            Your sign-in session has ended. Please sign in again to continue.
          </Typography>
        </Box>
        <Alert severity="warning">You were automatically redirected here because your token is no longer valid.</Alert>
        <Button component={Link} to="/login" variant="contained" size="large">
          Go to login
        </Button>
      </Stack>
    </Paper>
  </Box>
)

export default SessionExpiredPage
