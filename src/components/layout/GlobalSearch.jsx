import {
  SearchRounded,
  Inventory2Rounded,
  ManageAccountsRounded,
  OpenInNewRounded,
  DashboardRounded,
  SecurityRounded,
  GppGoodRounded,
  FactCheckRounded,
  AssignmentTurnedInRounded,
  NotificationsRounded,
  ReportRounded,
  SettingsRounded
} from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import requests from '../../mocks/requests.json'
import vendors from '../../mocks/vendors.json'

const GlobalSearch = () => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()

  const options = useMemo(() => {
    if (!inputValue) return []
    const query = inputValue.toLowerCase()

    const requestMatches = requests
      .filter((r) => r?.title?.toLowerCase().includes(query) || r?.id?.toLowerCase().includes(query))
      .map((r) => ({
        type: 'Procurement',
        id: r.id,
        title: r.title,
        subtitle: `Request • ${r.department}`,
        icon: <Inventory2Rounded fontSize="small" />,
        path: `/procurement/${r.id}`,
      }))

    const vendorMatches = vendors
      .filter((v) => v?.name?.toLowerCase().includes(query) || v?.id?.toLowerCase().includes(query))
      .map((v) => ({
        type: 'Vendor',
        id: v.id,
        title: v.name,
        subtitle: `Vendor • ${v.category}`,
        icon: <ManageAccountsRounded fontSize="small" />,
        path: `/vendors/${v.id}`,
      }))

    const pages = [
      { label: 'Dashboard', path: '/dashboard', icon: <DashboardRounded fontSize="small" /> },
      { label: 'Procurement', path: '/procurement', icon: <Inventory2Rounded fontSize="small" /> },
      { label: 'Vendors', path: '/vendors', icon: <ManageAccountsRounded fontSize="small" /> },
      { label: 'Risk', path: '/risk', icon: <SecurityRounded fontSize="small" /> },
      { label: 'Compliance', path: '/compliance', icon: <GppGoodRounded fontSize="small" /> },
      { label: 'Audit', path: '/audit', icon: <FactCheckRounded fontSize="small" /> },
      { label: 'Approvals', path: '/approvals', icon: <AssignmentTurnedInRounded fontSize="small" /> },
      { label: 'Notifications', path: '/notifications', icon: <NotificationsRounded fontSize="small" /> },
      { label: 'Reports', path: '/reports', icon: <ReportRounded fontSize="small" /> },
      { label: 'Settings', path: '/settings', icon: <SettingsRounded fontSize="small" /> },
    ]

    const pageMatches = pages
      .filter((p) => p.label.toLowerCase().includes(query))
      .map((p) => ({
        type: 'Navigation',
        id: p.path,
        title: p.label,
        subtitle: `App Page`,
        icon: p.icon,
        path: p.path,
      }))

    return [...pageMatches.slice(0, 3), ...requestMatches.slice(0, 5), ...vendorMatches.slice(0, 5)]
  }, [inputValue])

  const handleSelect = (event, option) => {
    if (option) {
      navigate(option.path)
      setInputValue('')
      setOpen(false)
    }
  }

  return (
    <Box sx={{ width: { xs: '100%', sm: 300, md: 400 }, mr: 2 }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        options={options}
        value={null}
        groupBy={(option) => option.type}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option?.title || '')}
        onChange={handleSelect}
        filterOptions={(x) => x} 
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search requests, vendors..."
            size="small"
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'divider',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <SearchRounded color="action" />
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <ListItemButton component="li" key={key} {...otherProps} sx={{ py: 1, width: '100%', borderBottom: 1, borderColor: 'divider' }}>
              <ListItemIcon sx={{ minWidth: 36 }}>{option.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {option.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {option.id} • {option.subtitle}
                  </Typography>
                }
              />
              <OpenInNewRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
            </ListItemButton>
          );
        }}
        noOptionsText={inputValue ? "No results found" : "Type to search"}
      />
    </Box>
  )
}

export default GlobalSearch
