import {
  AssessmentRounded,
  BusinessRounded,
  FactCheckRounded,
  FilterListRounded,
  OpenInNewRounded,
  SearchRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendors } from '../../store/slices/vendorSlice'

const statusColors = {
  Approved: 'success',
  'Under Review': 'warning',
  'High Risk': 'error',
}

const riskLevels = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
}

const VendorRow = memo(({ vendor }) => {
  const vendorRiskLevel = vendor.riskScore < 30 ? 'Low' : vendor.riskScore < 60 ? 'Medium' : 'High'
  const certificationStatusValue = vendor.certificationStatus || (vendor.riskScore > 55 ? 'Expiring' : vendor.riskScore > 35 ? 'Review Required' : 'Current')

  return (
    <TableRow hover>
      <TableCell>
        <Typography fontWeight={700}>{vendor.name}</Typography>
        <Typography variant="body2" color="text.secondary">{vendor.id}</Typography>
      </TableCell>
      <TableCell>{vendor.category}</TableCell>
      <TableCell>
        <Typography fontWeight={700}>{vendor.riskScore}</Typography>
        <Typography variant="body2" color="text.secondary">{vendorRiskLevel}</Typography>
      </TableCell>
      <TableCell>
        <Chip label={vendor.status} color={statusColors[vendor.status]} size="small" />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {(vendor.certifications || []).map((cert) => (
            <Chip key={cert} label={cert} size="small" variant="outlined" />
          ))}
          <Chip label={certificationStatusValue} size="small" variant="outlined" color={certificationStatusValue === 'Expiring' ? 'warning' : 'default'} />
        </Stack>
      </TableCell>
      <TableCell align="right">
        <Button component={Link} to={`/vendors/${vendor.id}`} size="small" endIcon={<OpenInNewRounded />}>
          View
        </Button>
      </TableCell>
    </TableRow>
  )
})

const VendorsPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [riskLevel, setRiskLevel] = useState('All')
  const [certificationStatus, setCertificationStatus] = useState('All')
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const { vendors, status } = useSelector((state) => state.vendor)
  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVendors())
    }
  }, [status, dispatch])

  const stats = useMemo(() => ({
    total: vendors.length,
    active: vendors.filter((vendor) => vendor.status === 'Approved').length,
    highRisk: vendors.filter((vendor) => vendor.status === 'High Risk').length,
    expiringCerts: vendors.filter((vendor) => (vendor.certificationStatus || 'Current') !== 'Current').length,
  }), [])

  const filteredVendors = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return vendors.filter((vendor) => {
      const matchesSearch =
        !searchValue ||
        vendor.name.toLowerCase().includes(searchValue) ||
        vendor.category.toLowerCase().includes(searchValue) ||
        vendor.id.toLowerCase().includes(searchValue)

      const matchesCategory = category === 'All' || vendor.category === category
      const vendorRiskLevel = vendor.riskScore < 30 ? 'Low' : vendor.riskScore < 60 ? 'Medium' : 'High'
      const matchesRisk = riskLevel === 'All' || vendorRiskLevel === riskLevel
      const vendorCertificationStatus = vendor.certificationStatus || (vendor.riskScore > 55 ? 'Expiring' : vendor.riskScore > 35 ? 'Review Required' : 'Current')
      const matchesCertification = certificationStatus === 'All' || vendorCertificationStatus === certificationStatus

      return matchesSearch && matchesCategory && matchesRisk && matchesCertification
    })
  }, [category, certificationStatus, riskLevel, search])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / pageSize))
  const pagedVendors = filteredVendors.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = useCallback((_event, value) => {
    setPage(value)
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Vendor Governance
        </Typography>
        <Typography color="text.secondary">
          Monitor supplier performance, certifications, and risk posture from a single workspace.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {[
          { label: 'Total Vendors', value: stats.total, icon: <BusinessRounded color="primary" /> },
          { label: 'Active', value: stats.active, icon: <FactCheckRounded color="success" /> },
          { label: 'High Risk', value: stats.highRisk, icon: <AssessmentRounded color="error" /> },
          { label: 'Expiring Certifications', value: stats.expiringCerts, icon: <FilterListRounded color="warning" /> },
        ].map((card) => (
          <Paper key={card.label} sx={{ flex: 1, p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {card.icon}
              <Box>
                <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search vendor or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{ input: { startAdornment: <SearchRounded sx={{ mr: 1, color: 'text.secondary' }} /> } }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(event) => setCategory(event.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {[...new Set(vendors.map((vendor) => vendor.category))].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Risk Level</InputLabel>
            <Select value={riskLevel} label="Risk Level" onChange={(event) => setRiskLevel(event.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Certification Status</InputLabel>
            <Select value={certificationStatus} label="Certification Status" onChange={(event) => setCertificationStatus(event.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Current">Current</MenuItem>
              <MenuItem value="Review Required">Review Required</MenuItem>
              <MenuItem value="Expiring">Expiring</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Risk Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Certifications</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`vendor-skeleton-${index}`}>
                  <TableCell colSpan={6}><Skeleton variant="text" width="100%" /></TableCell>
                </TableRow>
              ))
            ) : (
              pagedVendors.map((vendor) => <VendorRow key={vendor.id} vendor={vendor} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {pagedVendors.length} of {filteredVendors.length} vendors
        </Typography>
        <Pagination count={totalPages} page={page - 1} onChange={handlePageChange} color="primary" />
      </Stack>
    </Box>
  )
}

export default VendorsPage
