import {
  CheckCircleRounded,
  CloseRounded,
  ForwardToInboxRounded,
  ReplayRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setGlobalLoading } from '../../store/slices/uiSlice'

const initialApprovalQueue = [
  { id: 'APR-101', title: 'Cloud migration hardware refresh', requester: 'A. Singh', amount: 128500, department: 'IT', dateSubmitted: '2026-06-22', status: 'Pending' },
  { id: 'APR-102', title: 'Regional vendor onboarding', requester: 'M. Chen', amount: 45200, department: 'Procurement', dateSubmitted: '2026-06-21', status: 'Pending' },
  { id: 'APR-103', title: 'Compliance training bundle', requester: 'J. Rivera', amount: 18420, department: 'HR', dateSubmitted: '2026-06-20', status: 'Approved' },
  { id: 'APR-104', title: 'ERP integration support', requester: 'P. Kumar', amount: 76350, department: 'Operations', dateSubmitted: '2026-06-19', status: 'Rejected' },
  { id: 'APR-105', title: 'Supplier audit contract', requester: 'R. Patel', amount: 91500, department: 'Legal', dateSubmitted: '2026-06-18', status: 'Escalated' },
]

const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  Escalated: 'info',
}

const ApprovalsPage = () => {
  const dispatch = useDispatch()
  const [tab, setTab] = useState('Pending')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState('Approve')
  const [comment, setComment] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [queue, setQueue] = useState(initialApprovalQueue)

  useEffect(() => {
    dispatch(setGlobalLoading(true))
    const timer = window.setTimeout(() => dispatch(setGlobalLoading(false)), 250)
    return () => window.clearTimeout(timer)
  }, [dispatch, tab])

  const visibleItems = useMemo(() => queue.filter((item) => item.status === tab), [queue, tab])

  const openDialog = (action, item) => {
    setDialogAction(action)
    setSelectedItem(item)
    setComment('')
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    if (!selectedItem) {
      setDialogOpen(false)
      return
    }

    const nextStatus = dialogAction === 'Reject' ? 'Rejected' : dialogAction === 'Send Back' ? 'Escalated' : dialogAction === 'Delegate' ? 'Escalated' : 'Approved'

    setQueue((currentQueue) =>
      currentQueue.map((item) => (item.id === selectedItem.id ? { ...item, status: nextStatus } : item))
    )
    setTab(nextStatus)
    setDialogOpen(false)
    setSelectedItem(null)
    setComment('')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Approval Workbench
        </Typography>
        <Typography color="text.secondary">
          Review pending requests, update decision outcomes, and route escalations quickly.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab value="Pending" label="Pending" />
          <Tab value="Approved" label="Approved" />
          <Tab value="Rejected" label="Rejected" />
          <Tab value="Escalated" label="Escalated" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 860 }}>
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography fontWeight={700}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.id}</Typography>
                </TableCell>
                <TableCell>{item.requester}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.amount.toLocaleString()}</TableCell>
                <TableCell>{item.dateSubmitted}</TableCell>
                <TableCell>
                  <Chip label={item.status} color={statusColors[item.status]} size="small" />
                </TableCell>
                <TableCell align="right">
                  {item.status === 'Pending' ? (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                      <Button variant="contained" color="success" size="small" startIcon={<CheckCircleRounded />} onClick={() => openDialog('Approve', item)}>
                        Approve
                      </Button>
                      <Button variant="contained" color="error" size="small" startIcon={<CloseRounded />} onClick={() => openDialog('Reject', item)}>
                        Reject
                      </Button>
                      <Button variant="contained" color="warning" size="small" startIcon={<ReplayRounded />} onClick={() => openDialog('Send Back', item)}>
                        Send Back
                      </Button>
                      <Button variant="contained" color="info" size="small" startIcon={<ForwardToInboxRounded />} onClick={() => openDialog('Delegate', item)}>
                        Delegate
                      </Button>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No action</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogAction} Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedItem ? `${selectedItem.title} (${selectedItem.id})` : ''}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Comment"
            placeholder="Add a note for the requester"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color={dialogAction === 'Reject' ? 'error' : dialogAction === 'Send Back' ? 'warning' : dialogAction === 'Delegate' ? 'info' : 'success'} onClick={handleConfirm}>
            Confirm {dialogAction}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalsPage
