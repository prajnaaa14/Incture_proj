import {
  DescriptionRounded,
  DownloadRounded,
  HistoryRounded,
  PersonRounded,
  SettingsRounded,
  AssessmentRounded
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Skeleton
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuditTrail } from '../../store/slices/auditSlice'

const exportCsv = (rows, filename) => {
  if (!rows || rows.length === 0) return
  const csv = [Object.keys(rows[0]).join(','), ...rows.map((row) => Object.values(row).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const exportPdf = (label) => {
  const pdfContent = `Audit export: ${label}`
  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${label.toLowerCase().replace(/\s+/g, '-')}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

const AuditPage = () => {
  const dispatch = useDispatch()
  const { entries: data, status } = useSelector((state) => state.audit)
  const loading = status === 'loading' || status === 'idle'
  const [tab, setTab] = useState('log')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAuditTrail())
    }
  }, [status, dispatch])

  const exportLabel = useMemo(() => {
    if (tab === 'log') return 'Audit Log'
    if (tab === 'users') return 'User Activity'
    if (tab === 'reports') return 'Reports'
    return 'System Logs'
  }, [tab])

  const handleExportCsv = () => {
    if (tab === 'log') exportCsv(data?.auditLogs || [], 'audit-log.csv')
    if (tab === 'users') exportCsv(data?.userActivities || [], 'user-activity.csv')
    if (tab === 'system') exportCsv(data?.systemLogs || [], 'system-logs.csv')
    if (tab === 'reports') exportCsv(data?.reports || [], 'reports-log.csv')
  }

  if (loading) {
    return <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={400} /></Box>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Audit Center
        </Typography>
        <Typography color="text.secondary">
          Review governance activity, identify operational changes, and export trace records.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
              <Tab value="log" label="Audit Log" />
              <Tab value="users" label="User Activity" />
              <Tab value="system" label="System Logs" />
              <Tab value="reports" label="Reports" />
            </Tabs>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="outlined" startIcon={<DescriptionRounded />} onClick={() => exportPdf(exportLabel)}>
                Export PDF
              </Button>
              <Button variant="contained" startIcon={<DownloadRounded />} onClick={handleExportCsv}>
                Export Excel
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {tab === 'log' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Audit Log
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.auditLogs?.map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell>{event.id}</TableCell>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell>{event.ip}</TableCell>
                      <TableCell>
                         <Chip label={event.status} color={event.status === 'Success' ? 'success' : 'error'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tab === 'users' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              User Activity
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.userActivities?.map((activity) => (
                    <TableRow key={activity.id} hover>
                      <TableCell>{activity.id}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.activity}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tab === 'system' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              System Logs
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.systemLogs?.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Chip label={log.level} color={log.level === 'ERROR' ? 'error' : log.level === 'WARNING' ? 'warning' : 'default'} size="small" />
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tab === 'reports' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Audit Reports
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Generated By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.reports?.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                         <Chip label={report.status} color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default AuditPage
