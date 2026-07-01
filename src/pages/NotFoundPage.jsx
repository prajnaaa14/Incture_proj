import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: 1, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography color="text.secondary">
          The page you are looking for does not exist.
        </Typography>
        <Button component={Link} to="/dashboard" variant="contained">
          Go to dashboard
        </Button>
      </Stack>
    </Paper>
  </Box>
)

export default NotFoundPage
