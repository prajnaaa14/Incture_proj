import {
  DownloadRounded,
  OpenInNewRounded,
  SearchRounded,
  SortRounded,
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
import { fetchProcurementPipeline } from '../../store/slices/procurementSlice'

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
  const dispatch = useDispatch()
  const { items: requests, status } = useSelector((state) => state.procurement)
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
  }, [search, statusFilter, startDate, endDate])

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
      title: request.title,
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
    link.click()
    URL.revokeObjectURL(url)
  }, [sortedRows])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Procurement Workspace
        </Typography>
        <Typography color="text.secondary">
          Review requests, track approvals, and manage procurement activity.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search ID, title, or department"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{ startAdornment: <SearchRounded sx={{ mr: 1, color: 'text.secondary' }} /> }}
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

          <TextField label="From" type="date" size="small" value={startDate} onChange={(event) => setStartDate(event.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="To" type="date" size="small" value={endDate} onChange={(event) => setEndDate(event.target.value)} InputLabelProps={{ shrink: true }} />

          <Button variant="outlined" startIcon={<DownloadRounded />} onClick={exportCsv}>
            Export CSV
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
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

      {sortedRows.length === 0 ? (
        <Typography color="text.secondary">No requests match the current filters.</Typography>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedRows.length} of {sortedRows.length} requests
          </Typography>
          <Pagination count={totalPages} page={page - 1} onChange={(_, value) => setPage(value + 1)} color="primary" />
        </Stack>
      )}
    </Box>
  )
}

export default ProcurementPage
