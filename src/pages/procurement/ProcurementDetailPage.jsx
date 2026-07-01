import {
  ArrowBackRounded,
  AttachmentRounded,
  ChevronRightRounded,
  DownloadRounded,
  MessageRounded,
  TimelineRounded,
} from '@mui/icons-material'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Link as MuiLink,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
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
import { Link as RouterLink, useParams } from 'react-router-dom'
import requests from '../../mocks/requests.json'

const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  'Under Review': 'info',
}

const ProcurementDetailPage = () => {
  const { id } = useParams()
  const [tab, setTab] = useState('overview')

  const request = useMemo(() => requests.find((item) => item.id === id), [id])

  if (!request) {
    return (
      <Box>
        <Button component={RouterLink} to="/procurement" startIcon={<ArrowBackRounded />} sx={{ mb: 2 }}>
          Back to procurement
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Request not found
        </Typography>
      </Box>
    )
  }

  const priority = request.status === 'Pending' ? 'High' : request.status === 'Rejected' ? 'Medium' : 'Normal'
  const description = request.comments?.[0]?.text || 'Request is currently under active review.'
  const auditLogs = [
    { action: 'Submitted', user: request.createdBy, timestamp: request.createdDate },
    ...request.approvalHistory.map((entry) => ({ action: entry.step, user: entry.by, timestamp: entry.date })),
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator={<ChevronRightRounded fontSize="small" />} aria-label="breadcrumb">
        <MuiLink component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <MuiLink component={RouterLink} to="/procurement" underline="hover" color="inherit">
          Procurement
        </MuiLink>
        <Typography color="text.primary">{request.id}</Typography>
      </Breadcrumbs>

      <Button component={RouterLink} to="/procurement" startIcon={<ArrowBackRounded />} sx={{ alignSelf: 'flex-start' }}>
        Back to procurement
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {request.title}
            </Typography>
            <Typography color="text.secondary">
              {request.id} • {request.department}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Chip label={request.status} color={statusColors[request.status]} />
            <Chip label={`Priority: ${priority}`} variant="outlined" />
            <Chip label={`Amount: ${request.amount.toLocaleString()}`} variant="outlined" />
          </Stack>
        </Stack>
      </Paper>

      <Paper>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab value="overview" label="Overview" />
          <Tab value="attachments" label="Attachments" />
          <Tab value="approval" label="Approval History" />
          <Tab value="comments" label="Comments" />
          <Tab value="audit" label="Audit Logs" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 'overview' && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Request details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Amount</Typography>
                  <Typography fontWeight={700}>{request.amount.toLocaleString()}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Department</Typography>
                  <Typography fontWeight={700}>{request.department}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Priority</Typography>
                  <Typography fontWeight={700}>{priority}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Created by</Typography>
                  <Typography fontWeight={700}>{request.createdBy}</Typography>
                </Paper>
              </Box>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Description</Typography>
                <Typography sx={{ mt: 1 }}>{description}</Typography>
              </Paper>
            </Stack>
          )}

          {tab === 'attachments' && (
            <Stack spacing={2}>
              {(request.attachments || []).map((file) => (
                <Paper key={file} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachmentRounded color="primary" />
                    <Typography>{file}</Typography>
                  </Stack>
                  <Button size="small" startIcon={<DownloadRounded />}>
                    Download
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}

          {tab === 'approval' && (
            <Box>
              <Stepper orientation="vertical">
                {request.approvalHistory.map((entry, index) => (
                  <Step key={`${entry.step}-${index}`} active>
                    <StepLabel>
                      <Typography fontWeight={700}>{entry.step}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.by} • {entry.date}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {tab === 'comments' && (
            <Stack spacing={2}>
              {(request.comments || []).map((comment, index) => (
                <Paper key={`${comment.author}-${index}`} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <MessageRounded color="primary" />
                    <Typography fontWeight={700}>{comment.author}</Typography>
                  </Stack>
                  <Typography color="text.secondary">{comment.text}</Typography>
                </Paper>
              ))}
            </Stack>
          )}

          {tab === 'audit' && (
            <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 480 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((entry, index) => (
                    <TableRow key={`${entry.action}-${index}`}>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>{entry.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default ProcurementDetailPage
