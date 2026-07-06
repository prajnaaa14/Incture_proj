import {
  Brightness4Rounded,
  Brightness7Rounded,
  LockRounded,
  PersonRounded,
  SettingsRounded,
  TranslateRounded,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useThemeMode } from '../../theme/ThemeModeContext'

import { useSelector } from 'react-redux'

const SettingsPage = () => {
  const [tab, setTab] = useState('profile')
  const { mode, toggleMode } = useThemeMode()
  const user = useSelector((state) => state.auth.user)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Settings
        </Typography>
        <Typography color="text.secondary">
          Configure your workspace profile, security, preferences, and appearance.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value="profile" label="Profile" />
            <Tab value="security" label="Security" />
            <Tab value="preferences" label="Preferences" />
            <Tab value="theme" label="Theme" />
          </Tabs>
        </CardContent>
      </Card>

      {tab === 'profile' && (
        <Card>
          <CardContent>
            <Grid container spacing={2} sx={{ flex: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Full Name" fullWidth defaultValue={user?.name || ''} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Email" fullWidth defaultValue={user?.email || ''} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Department" fullWidth defaultValue={user?.department || ''} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Role" fullWidth defaultValue={user?.role || ''} sx={{ textTransform: 'capitalize' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'security' && (
        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ maxWidth: 480 }}>
              <TextField label="Current Password" type="password" fullWidth />
              <TextField label="New Password" type="password" fullWidth />
              <TextField label="Confirm New Password" type="password" fullWidth />
              <Button variant="contained" startIcon={<LockRounded />} sx={{ alignSelf: 'flex-start' }}>
                Change Password
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {tab === 'preferences' && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select defaultValue="en" label="Language">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select defaultValue="utc" label="Timezone">
                    <MenuItem value="utc">UTC</MenuItem>
                    <MenuItem value="pst">Pacific Time</MenuItem>
                    <MenuItem value="ist">India Standard Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Enable email and in-app notifications" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'theme' && (
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Button variant={mode === 'dark' ? 'contained' : 'outlined'} startIcon={mode === 'dark' ? <Brightness4Rounded /> : <Brightness7Rounded />} onClick={toggleMode}>
                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default SettingsPage
