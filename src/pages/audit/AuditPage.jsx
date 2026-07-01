import {
  DescriptionRounded,
  DownloadRounded,
  HistoryRounded,
  PersonRounded,
  SettingsRounded,
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
} from '@mui/material'
import { useMemo, useState } from 'react'

const auditEvents = [
  { timestamp: '2026-06-23 09:12', user: 'A. Singh', action: 'Approved Request', module: 'Procurement', details: 'Approved PO-1042' },
  { timestamp: '2026-06-23 08:47', user: 'M. Chen', action: 'Updated Vendor', module: 'Vendor Governance', details: 'Risk profile revised' },
  { timestamp: '2026-06-22 16:05', user: 'J. Rivera', action: 'Filed Compliance Notice', module: 'Compliance', details: 'Issued overdue document reminder' },
  { timestamp: '2026-06-22 14:30', user: 'P. Kumar', action: 'Reset Password', module: 'Access', details: 'Self-service password reset' },
]

const userActivity = [
  { user: 'A. Singh', actions: ['Approved request PO-1042', 'Reviewed vendor scorecard'], lastSeen: '09:12' },
  { user: 'M. Chen', actions: ['Updated vendor risk profile', 'Closed remediation task'], lastSeen: '08:47' },
  { user: 'J. Rivera', actions: ['Filed compliance notice', 'Downloaded report pack'], lastSeen: '16:05' },
]

const systemLogs = [
  { timestamp: '2026-06-23 09:12', source: 'Auth Service', message: 'Token refresh completed successfully' },
  { timestamp: '2026-06-23 08:47', source: 'Workflow Engine', message: 'Approval queue synced to 6 pending items' },
  { timestamp: '2026-06-22 16:05', source: 'Compliance Service', message: 'Alert rules recalculated' },
]

const exportCsv = (rows, filename) => {
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
  const [tab, setTab] = useState('log')

  const exportLabel = useMemo(() => (tab === 'log' ? 'Audit Log' : tab === 'users' ? 'User Activity' : 'System Logs'), [tab])

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
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab value="log" label="Audit Log" />
              <Tab value="users" label="User Activity" />
              <Tab value="system" label="System Logs" />
            </Tabs>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="outlined" startIcon={<DescriptionRounded />} onClick={() => exportPdf(exportLabel)}>
                Export PDF
              </Button>
              <Button variant="contained" startIcon={<DownloadRounded />} onClick={() => exportCsv(tab === 'log' ? auditEvents : tab === 'users' ? userActivity : systemLogs, `${exportLabel.toLowerCase().replace(/\s+/g, '-')}.csv`)}>
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
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Module</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditEvents.map((event) => (
                    <TableRow key={`${event.timestamp}-${event.action}`} hover>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell>{event.module}</TableCell>
                      <TableCell>{event.details}</TableCell>
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
                    <TableCell>User</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Last Seen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userActivity.map((activity) => (
                    <TableRow key={activity.user} hover>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {activity.actions.map((action) => (
                            <Chip key={action} label={action} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>{activity.lastSeen}</TableCell>
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
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={`${log.timestamp}-${log.source}`} hover>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>{log.message}</TableCell>
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
