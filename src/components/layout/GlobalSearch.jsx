import { SearchRounded, Inventory2Rounded, ManageAccountsRounded, OpenInNewRounded } from '@mui/icons-material'
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
      .filter((r) => r.title.toLowerCase().includes(query) || r.id.toLowerCase().includes(query))
      .map((r) => ({
        type: 'Procurement',
        id: r.id,
        title: r.title,
        subtitle: `Request • ${r.department}`,
        icon: <Inventory2Rounded fontSize="small" />,
        path: `/procurement/${r.id}`,
      }))

    const vendorMatches = vendors
      .filter((v) => v.name.toLowerCase().includes(query) || v.id.toLowerCase().includes(query))
      .map((v) => ({
        type: 'Vendor',
        id: v.id,
        title: v.name,
        subtitle: `Vendor • ${v.category}`,
        icon: <ManageAccountsRounded fontSize="small" />,
        path: `/vendors/${v.id}`,
      }))

    return [...requestMatches.slice(0, 5), ...vendorMatches.slice(0, 5)]
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
        getOptionLabel={(option) => option.title}
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
            <Box component="li" key={key} {...otherProps} sx={{ p: '0 !important' }}>
              <ListItemButton sx={{ py: 1, width: '100%' }}>
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
            </Box>
          );
        }}
        noOptionsText={inputValue ? "No results found" : "Type to search"}
      />
    </Box>
  )
}

export default GlobalSearch
