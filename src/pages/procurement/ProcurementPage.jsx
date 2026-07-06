import {
  AddRounded,
  DownloadRounded,
  OpenInNewRounded,
  SearchRounded,
  SortRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
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
import { useDispatch, useSelector } from 'react-redux'
import { fetchProcurementPipeline, addProcurementRequest } from '../../store/slices/procurementSlice'
import { pushSnackbar } from '../../store/slices/uiSlice'

const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  'Under Review': 'info',
}

const RequestRow = memo(({ request, onView }) => (
  <TableRow hover>
    <TableCell>{request.id}</TableCell>
    <TableCell>{request.title}</TableCell>
    <TableCell>{request.department}</TableCell>
    <TableCell>{request.amount.toLocaleString()}</TableCell>
    <TableCell>
      <Chip label={request.status} color={statusColors[request.status]} size="small" />
    </TableCell>
    <TableCell>{request.createdDate}</TableCell>
    <TableCell align="right">
      <Button onClick={() => onView(request.id)} size="small" endIcon={<OpenInNewRounded />}>
        View
      </Button>
    </TableCell>
  </TableRow>
))

const ProcurementPage = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({ title: '', amount: '', department: '' })

  const dispatch = useDispatch()
  const { items: requests, status } = useSelector((state) => state.procurement)
  const user = useSelector((state) => state.auth.user)
  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProcurementPipeline())
    }
  }, [status, dispatch])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, startDate, endDate])

  const filteredRows = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        !searchValue ||
        request.title.toLowerCase().includes(searchValue) ||
        request.department.toLowerCase().includes(searchValue) ||
        request.id.toLowerCase().includes(searchValue)

      const matchesStatus = statusFilter === 'All' || request.status === statusFilter
      const matchesStart = !startDate || request.createdDate >= startDate
      const matchesEnd = !endDate || request.createdDate <= endDate

      return matchesSearch && matchesStatus && matchesStart && matchesEnd
    })
  }, [search, statusFilter, startDate, endDate, requests])

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows]
    rows.sort((a, b) => {
      const left = a[sortConfig.key]
      const right = b[sortConfig.key]
      const modifier = sortConfig.direction === 'asc' ? 1 : -1

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * modifier
      }

      return String(left).localeCompare(String(right)) * modifier
    })

    return rows
  }, [filteredRows, sortConfig])

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * 10
    return sortedRows.slice(startIndex, startIndex + 10)
  }, [sortedRows, page])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / 10))

  const handleSort = useCallback((key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const handleView = useCallback((requestId) => {
    window.location.assign(`/procurement/${requestId}`)
  }, [])

  const exportCsv = useCallback(() => {
    const rows = sortedRows.map((request) => ({
      id: request.id,
      title: `"${request.title || ''}"`,
      department: request.department,
      amount: request.amount,
      status: request.status,
      date: request.createdDate,
    }))

    const header = ['ID', 'Title', 'Department', 'Amount', 'Status', 'Date']
    const csv = [
      header.join(','),
      ...rows.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'procurement-requests.csv'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [sortedRows])

  const handleCreateSubmit = () => {
    if (!newRequest.title || !newRequest.amount || !newRequest.department) {
      dispatch(pushSnackbar({ message: 'Please fill in all fields', severity: 'warning' }))
      return
    }

    dispatch(addProcurementRequest({
      title: newRequest.title,
      amount: newRequest.amount,
      department: newRequest.department,
      createdBy: user?.name || 'Current User'
    }))

    dispatch(pushSnackbar({ message: 'Procurement request submitted successfully!', severity: 'success' }))
    setCreateDialogOpen(false)
    setNewRequest({ title: '', amount: '', department: '' })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Procurement Workspace
          </Typography>
          <Typography color="text.secondary">
            Review requests, track approvals, and manage procurement activity.
          </Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddRounded />} onClick={() => setCreateDialogOpen(true)}>
          Create Request
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search ID, title, or department"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            label="From" 
            type="date" 
            size="small" 
            value={startDate} 
            onChange={(event) => setStartDate(event.target.value)} 
            InputLabelProps={{ shrink: true }}
            sx={{ 
              minWidth: 140,
              '& input': { display: 'flex', alignItems: 'center', height: '1.4375em' },
              '& input::-webkit-datetime-edit': { color: startDate ? 'inherit' : 'transparent' },
              '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
            }}
          />
          <TextField 
            label="To" 
            type="date" 
            size="small" 
            value={endDate} 
            onChange={(event) => setEndDate(event.target.value)} 
            InputLabelProps={{ shrink: true }}
            sx={{ 
              minWidth: 140,
              '& input': { display: 'flex', alignItems: 'center', height: '1.4375em' },
              '& input::-webkit-datetime-edit': { color: endDate ? 'inherit' : 'transparent' },
              '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
            }}
          />

          <Button variant="outlined" startIcon={<DownloadRounded />} onClick={exportCsv} sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}>
            Export CSV
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'department', label: 'Department' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'createdDate', label: 'Date' },
              ].map((column) => (
                <TableCell key={column.key}>
                  <Button
                    color="inherit"
                    size="small"
                    endIcon={<SortRounded />}
                    onClick={() => handleSort(column.key)}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    {column.label}
                  </Button>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={7}><Skeleton variant="text" width="100%" /></TableCell>
                </TableRow>
              ))
            ) : (
              paginatedRows.map((request) => <RequestRow key={request.id} request={request} onView={handleView} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {sortedRows.length === 0 && !loading ? (
        <Typography color="text.secondary">No requests match the current filters.</Typography>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedRows.length} of {sortedRows.length} requests
          </Typography>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Stack>
      )}

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Procurement Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Submit a new requisition for manager approval.
          </Typography>
          <Stack spacing={2}>
            <TextField 
              label="Request Title" 
              fullWidth 
              value={newRequest.title} 
              onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })} 
            />
            <TextField 
              label="Estimated Amount ($)" 
              type="number" 
              fullWidth 
              value={newRequest.amount} 
              onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })} 
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select 
                value={newRequest.department} 
                label="Department" 
                onChange={(e) => setNewRequest({ ...newRequest, department: e.target.value })}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSubmit}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProcurementPage
