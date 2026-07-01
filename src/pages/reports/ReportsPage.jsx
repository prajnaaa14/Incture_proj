import {
  DownloadRounded,
  FileDownloadRounded,
  TableChartRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { useCallback, useMemo, useState } from 'react'

const reportData = {
  Procurement: [
    { id: 'PO-1042', title: 'Cloud migration hardware refresh', department: 'IT', date: '2026-06-22', value: 128500 },
    { id: 'PO-1043', title: 'Regional vendor onboarding', department: 'Procurement', date: '2026-06-20', value: 45200 },
  ],
  Vendor: [
    { id: 'VND-001', title: 'Northwind Supplies', department: 'Operations', date: '2026-06-21', value: 24 },
    { id: 'VND-004', title: 'Horizon Industrial', department: 'Manufacturing', date: '2026-06-19', value: 63 },
  ],
  Risk: [
    { id: 'R-001', title: 'Supplier concentration', department: 'Supply Chain', date: '2026-06-18', value: 'High' },
    { id: 'R-003', title: 'Unpatched ERP access points', department: 'IT', date: '2026-06-16', value: 'High' },
  ],
  Compliance: [
    { id: 'C-101', title: 'Incomplete vendor onboarding', department: 'Compliance', date: '2026-06-17', value: 'Open' },
    { id: 'C-102', title: 'Expired Insurance certificate', department: 'Legal', date: '2026-06-15', value: 'Escalated' },
  ],
}

const savedReports = [
  { name: 'Q2 Procurement Summary', type: 'Procurement', updated: '2 hrs ago' },
  { name: 'Vendor Risk Snapshot', type: 'Vendor', updated: 'Yesterday' },
]

const ReportsPage = () => {
  const [reportType, setReportType] = useState('Procurement')
  const [dateRange, setDateRange] = useState('30d')
  const [department, setDepartment] = useState('All')

  const filteredRows = useMemo(() => {
    return reportData[reportType].filter((row) => {
      const matchesDepartment = department === 'All' || row.department === department
      const matchesRange = dateRange === '30d' || dateRange === '90d' || dateRange === 'all'
      return matchesDepartment && matchesRange
    })
  }, [dateRange, department, reportType])

  const exportCsv = useCallback((filename = `${reportType.toLowerCase()}-report.csv`) => {
    const csv = [Object.keys(filteredRows[0] || {}).join(','), ...filteredRows.map((row) => Object.values(row).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }, [filteredRows, reportType])

  const exportExcel = useCallback(() => {
    exportCsv(`${reportType.toLowerCase()}-report.xlsx`)
  }, [exportCsv, reportType])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Reporting Center
        </Typography>
        <Typography color="text.secondary">
          Build report views, export sanitized snapshots, and revisit saved reports.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Report Type</InputLabel>
                <Select value={reportType} label="Report Type" onChange={(event) => setReportType(event.target.value)}>
                  <MenuItem value="Procurement">Procurement</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Risk">Risk</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select value={dateRange} label="Date Range" onChange={(event) => setDateRange(event.target.value)}>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                  <MenuItem value="all">All time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select value={department} label="Department" onChange={(event) => setDepartment(event.target.value)}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Procurement">Procurement</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Supply Chain">Supply Chain</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Legal">Legal</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TableChartRounded color="primary" />
              <Typography variant="h6" fontWeight={700}>Report Preview</Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="outlined" startIcon={<DownloadRounded />} onClick={exportCsv}>CSV</Button>
              <Button variant="contained" startIcon={<FileDownloadRounded />} onClick={exportExcel}>Excel</Button>
            </Stack>
          </Stack>

          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Saved Reports
          </Typography>
          <Stack spacing={1.5}>
            {savedReports.map((report) => (
              <Paper key={report.name} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography fontWeight={700}>{report.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{report.type} • Updated {report.updated}</Typography>
                </Box>
                <Chip label="Ready" color="success" size="small" />
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReportsPage
