import {
  DownloadRounded,
  FileDownloadRounded,
  TableChartRounded,
  AssessmentRounded,
  FilterListRounded,
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
  Typography,
  Skeleton,
  Tabs,
  Tab,
  TextField,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReports } from '../../store/slices/reportSlice'

// Dummy generation data for the preview tables
const dummyPreviews = {
  procurement: [
    { id: 'PR-10042', department: 'Engineering', spend: '$12,400', status: 'Approved', date: '2026-07-02' },
    { id: 'PR-10045', department: 'Marketing', spend: '$4,500', status: 'Pending', date: '2026-07-04' },
    { id: 'PR-10048', department: 'IT Operations', spend: '$32,000', status: 'Approved', date: '2026-07-05' },
  ],
  vendor: [
    { vendor: 'TechCorp Solutions', category: 'Software', spendYTD: '$145,000', risk: 'Low', status: 'Active' },
    { vendor: 'Global Logistics Inc', category: 'Logistics', spendYTD: '$312,000', risk: 'Medium', status: 'Active' },
    { vendor: 'OfficeSupplies Co', category: 'Supplies', spendYTD: '$15,000', risk: 'Low', status: 'Inactive' },
  ],
  risk: [
    { riskId: 'RSK-092', category: 'Financial', vendor: 'Global Logistics Inc', impact: 'High', mitigation: 'In Progress' },
    { riskId: 'RSK-095', category: 'Security', vendor: 'TechCorp Solutions', impact: 'Low', mitigation: 'Resolved' },
    { riskId: 'RSK-098', category: 'Operational', vendor: 'OfficeSupplies Co', impact: 'Medium', mitigation: 'Pending' },
  ],
  compliance: [
    { framework: 'ISO 27001', vendor: 'TechCorp Solutions', lastAudit: '2026-01-15', status: 'Compliant' },
    { framework: 'GDPR', vendor: 'DataSync Ltd', lastAudit: '2025-11-20', status: 'Action Required' },
    { framework: 'SOC 2', vendor: 'Global Logistics Inc', lastAudit: '2026-04-10', status: 'Compliant' },
  ]
}

const ReportsPage = () => {
  const dispatch = useDispatch()
  const { reports, status } = useSelector((state) => state.report)
  const loading = status === 'loading' || status === 'idle'

  const [activeTab, setActiveTab] = useState(0)
  const [dateRange, setDateRange] = useState('30d')
  
  // Generic filter states
  const [filter1, setFilter1] = useState('All')
  const [filter2, setFilter2] = useState('All')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReports())
    }
  }, [status, dispatch])

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue)
    setFilter1('All')
    setFilter2('All')
    setDateRange('30d')
  }

  const exportCsv = useCallback((data, filename) => {
    if (!data || !data.length) return
    const csv = [Object.keys(data[0]).join(','), ...data.map((row) => Object.values(row).map(v => typeof v === 'object' ? JSON.stringify(v).replace(/,/g, ';') : v).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleExportCurrentView = (format) => {
    let dataToExport = []
    let filename = 'report'
    
    if (activeTab === 0) { dataToExport = dummyPreviews.procurement; filename = 'procurement_report' }
    else if (activeTab === 1) { dataToExport = dummyPreviews.vendor; filename = 'vendor_report' }
    else if (activeTab === 2) { dataToExport = dummyPreviews.risk; filename = 'risk_report' }
    else if (activeTab === 3) { dataToExport = dummyPreviews.compliance; filename = 'compliance_report' }
    else if (activeTab === 4) { dataToExport = reports; filename = 'saved_reports' }

    if (format === 'csv') {
      exportCsv(dataToExport, `${filename}.csv`)
    } else {
      exportCsv(dataToExport, `${filename}.xlsx`)
    }
  }

  const renderFilters = () => {
    let filter1Options = []
    let filter1Label = ''
    let filter2Options = []
    let filter2Label = ''

    if (activeTab === 0) { // Procurement
      filter1Label = 'Department'
      filter1Options = ['All', 'Engineering', 'Marketing', 'IT Operations', 'Finance']
      filter2Label = 'Status'
      filter2Options = ['All', 'Pending', 'Approved', 'Rejected']
    } else if (activeTab === 1) { // Vendor
      filter1Label = 'Category'
      filter1Options = ['All', 'Software', 'Logistics', 'Supplies', 'Services']
      filter2Label = 'Risk Level'
      filter2Options = ['All', 'Low', 'Medium', 'High']
    } else if (activeTab === 2) { // Risk
      filter1Label = 'Risk Category'
      filter1Options = ['All', 'Financial', 'Security', 'Operational', 'Compliance']
      filter2Label = 'Impact Level'
      filter2Options = ['All', 'Low', 'Medium', 'High']
    } else if (activeTab === 3) { // Compliance
      filter1Label = 'Framework'
      filter1Options = ['All', 'ISO 27001', 'GDPR', 'SOC 2', 'HIPAA']
      filter2Label = 'Status'
      filter2Options = ['All', 'Compliant', 'Action Required', 'Non-Compliant']
    } else {
      return null // Saved reports has its own layout
    }

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} label="Date Range" onChange={(e) => setDateRange(e.target.value)}>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="ytd">Year to Date</MenuItem>
              <MenuItem value="all">All time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>{filter1Label}</InputLabel>
            <Select value={filter1} label={filter1Label} onChange={(e) => setFilter1(e.target.value)}>
              {filter1Options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>{filter2Label}</InputLabel>
            <Select value={filter2} label={filter2Label} onChange={(e) => setFilter2(e.target.value)}>
              {filter2Options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  const renderPreviewTable = (type, headers, data) => (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Report Preview</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DownloadRounded />} onClick={() => handleExportCurrentView('csv')}>Export CSV</Button>
          <Button variant="contained" startIcon={<FileDownloadRounded />} onClick={() => handleExportCurrentView('excel')}>Export Excel</Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(h => <TableCell key={h}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} hover>
                {Object.keys(row).map((key) => (
                  <TableCell key={key}>
                    {key === 'status' || key === 'risk' || key === 'impact' ? (
                      <Chip 
                        label={row[key]} 
                        size="small" 
                        color={['Approved', 'Low', 'Compliant', 'Active'].includes(row[key]) ? 'success' : ['High', 'Action Required', 'Rejected', 'Non-Compliant'].includes(row[key]) ? 'error' : 'warning'} 
                        variant="outlined" 
                      />
                    ) : row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Reporting Center
        </Typography>
        <Typography color="text.secondary">
          Generate comprehensive analytics, export standardized files, and view saved reports.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Procurement Report" />
            <Tab label="Vendor Report" />
            <Tab label="Risk Report" />
            <Tab label="Compliance Report" />
            <Tab label="Saved Reports" />
          </Tabs>
        </CardContent>

        <CardContent>
          {activeTab !== 4 && (
             <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <FilterListRounded color="action" fontSize="small" />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase">Report Filters</Typography>
                </Stack>
                {renderFilters()}
                
                {activeTab === 0 && renderPreviewTable('procurement', ['ID', 'Department', 'Spend', 'Status', 'Date'], dummyPreviews.procurement)}
                {activeTab === 1 && renderPreviewTable('vendor', ['Vendor Name', 'Category', 'Spend (YTD)', 'Risk Level', 'Status'], dummyPreviews.vendor)}
                {activeTab === 2 && renderPreviewTable('risk', ['Risk ID', 'Category', 'Vendor', 'Impact Level', 'Mitigation'], dummyPreviews.risk)}
                {activeTab === 3 && renderPreviewTable('compliance', ['Framework', 'Vendor', 'Last Audit', 'Status'], dummyPreviews.compliance)}
             </Box>
          )}

          {activeTab === 4 && (
             <Box>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TableChartRounded color="primary" />
                  <Typography variant="h6" fontWeight={700}>Saved & Generated Reports</Typography>
                </Stack>
                <TextField 
                  size="small" 
                  placeholder="Search saved reports..." 
                  sx={{ minWidth: 250 }} 
                />
              </Stack>

              <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Date Generated</TableCell>
                      <TableCell>Generated By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`row-skeleton-${index}`}>
                          <TableCell colSpan={5}><Skeleton variant="text" width="100%" /></TableCell>
                        </TableRow>
                      ))
                    ) : reports.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={5} align="center"><Typography color="text.secondary" sx={{ py: 2 }}>No saved reports found.</Typography></TableCell>
                       </TableRow>
                    ) : (
                      reports.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell><Chip label={row.type} size="small" variant="outlined" /></TableCell>
                          <TableCell>{row.createdDate}</TableCell>
                          <TableCell>{row.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
             </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReportsPage
