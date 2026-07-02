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
  Skeleton
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApprovals, approveRequest, rejectRequest } from '../../store/slices/approvalSlice'

const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  Escalated: 'info',
}

const ApprovalsPage = () => {
  const dispatch = useDispatch()
  const { data, status } = useSelector((state) => state.approvals)
  const loading = status === 'loading' || status === 'idle'

  const [tab, setTab] = useState('Pending')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState('Approve')
  const [comment, setComment] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchApprovals())
    }
  }, [status, dispatch])

  const visibleItems = useMemo(() => {
    if (!data) return []
    const key = tab.toLowerCase()
    return data[key] || []
  }, [data, tab])

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

    if (dialogAction === 'Approve') {
      dispatch(approveRequest(selectedItem.id))
    } else if (dialogAction === 'Reject') {
      dispatch(rejectRequest(selectedItem.id))
    } else {
      // Simulate escalation or send back
      dispatch(rejectRequest(selectedItem.id))
    }

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
          <Tab value="Pending" label={`Pending (${data?.pending?.length || 0})`} />
          <Tab value="Approved" label={`Approved (${data?.approved?.length || 0})`} />
          <Tab value="Rejected" label={`Rejected (${data?.rejected?.length || 0})`} />
          <Tab value="Escalated" label={`Escalated (${data?.escalated?.length || 0})`} />
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
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={7}><Skeleton variant="text" width="100%" /></TableCell>
                </TableRow>
              ))
            ) : visibleItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ py: 2 }}>No items in this queue.</Typography></TableCell>
              </TableRow>
            ) : visibleItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography fontWeight={700}>{item.title || item.type}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.id}</Typography>
                </TableCell>
                <TableCell>{item.requester}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.amount?.toLocaleString()}</TableCell>
                <TableCell>{item.submitted}</TableCell>
                <TableCell>
                  <Chip label={tab} color={statusColors[tab]} size="small" />
                </TableCell>
                <TableCell align="right">
                  {tab === 'Pending' ? (
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
            {selectedItem ? `${selectedItem.type || selectedItem.title} (${selectedItem.id})` : ''}
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
