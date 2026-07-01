import {
  Brightness4Rounded,
  Brightness7Rounded,
  LockRounded,
  PersonRounded,
  PaletteRounded,
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

const SettingsPage = () => {
  const [tab, setTab] = useState('profile')
  const [accentColor, setAccentColor] = useState('#2563eb')
  const { mode, toggleMode } = useThemeMode()

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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'stretch', md: 'flex-start' }}>
              <Stack alignItems="center" spacing={1.5}>
                <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main' }}>
                  <PersonRounded sx={{ fontSize: 40 }} />
                </Avatar>
                <Button variant="outlined">Upload Avatar</Button>
              </Stack>

              <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField label="Full Name" fullWidth defaultValue="Alex Morgan" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Email" fullWidth defaultValue="alex.morgan@enterprise.com" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Phone" fullWidth defaultValue="+1 415 555 0187" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Role" fullWidth defaultValue="Operations Lead" />
                </Grid>
              </Grid>
            </Stack>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select defaultValue="en" label="Language">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select defaultValue="utc" label="Timezone">
                    <MenuItem value="utc">UTC</MenuItem>
                    <MenuItem value="pst">Pacific Time</MenuItem>
                    <MenuItem value="ist">India Standard Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Enable email and in-app notifications" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'theme' && (
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button variant={mode === 'dark' ? 'contained' : 'outlined'} startIcon={mode === 'dark' ? <Brightness4Rounded /> : <Brightness7Rounded />} onClick={toggleMode}>
                  {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Button>
                <Button variant="outlined" startIcon={<PaletteRounded />} sx={{ color: accentColor, borderColor: accentColor }} onClick={() => setAccentColor('#2563eb')}>
                  Reset Accent
                </Button>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Accent Color</Typography>
                <TextField type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} sx={{ width: 120 }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default SettingsPage
