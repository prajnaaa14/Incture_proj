import {
  CheckCircleOutlineRounded,
  MarkEmailReadRounded,
  MarkEmailUnreadRounded,
  NotificationsRounded,
} from '@mui/icons-material'
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAllRead, toggleNotificationRead } from '../../store/slices/notificationSlice'

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
}

const NotificationRow = memo(({ notification, onToggle }) => {
  const isRead = Boolean(notification.read ?? notification.isRead)

  return (
    <ListItem
      divider
      secondaryAction={
        <IconButton edge="end" aria-label={isRead ? 'mark as unread' : 'mark as read'} onClick={() => onToggle(notification.id)}>
          {isRead ? <MarkEmailUnreadRounded /> : <MarkEmailReadRounded />}
        </IconButton>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          {isRead ? <CheckCircleOutlineRounded color="success" /> : <NotificationsRounded color="warning" />}
        </ListItemIcon>
        <ListItemText primary={notification.title || notification.message} secondary={notification.message} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={notification.type} size="small" variant="outlined" />
          <Chip label={notification.priority} size="small" color={priorityColors[notification.priority]} />
        </Stack>
      </ListItemButton>
    </ListItem>
  )
})

const NotificationsPage = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.notification.items)
  const [filter, setFilter] = useState('All')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchNotifications())
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [dispatch])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesType = filter === 'All' || notification.type === filter
      const isRead = Boolean(notification.read ?? notification.isRead)
      const matchesReadState = !showUnreadOnly || !isRead
      return matchesType && matchesReadState
    })
  }, [filter, notifications, showUnreadOnly])

  const unreadCount = useMemo(() => notifications.filter((notification) => !(notification.read ?? notification.isRead)).length, [notifications])

  const handleToggleUnreadOnly = useCallback(() => {
    setShowUnreadOnly((value) => !value)
  }, [])

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value)
  }, [])

  const handleToggleRead = useCallback((id) => {
    dispatch(toggleNotificationRead(id))
  }, [dispatch])

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllRead())
  }, [dispatch])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Notification Center
        </Typography>
        <Typography color="text.secondary">
          Manage alerts, filter by category, and clear unread items quickly.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Button variant="outlined" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
              <Button variant={showUnreadOnly ? 'contained' : 'outlined'} onClick={handleToggleUnreadOnly}>
                {showUnreadOnly ? 'Showing unread only' : 'Show unread only'}
              </Button>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Type</InputLabel>
                <Select value={filter} label="Type" onChange={handleFilterChange}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Approval">Approval</MenuItem>
                  <MenuItem value="Risk">Risk</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="System">System</MenuItem>
                </Select>
              </FormControl>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsRounded />
              </Badge>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Paper>
        <List disablePadding>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ListItem key={`notif-skeleton-${index}`} divider>
                <ListItemIcon><Skeleton variant="circular" width={24} height={24} /></ListItemIcon>
                <ListItemText primary={<Skeleton variant="text" width="70%" />} secondary={<Skeleton variant="text" width="50%" />} />
              </ListItem>
            ))
          ) : (
            filteredNotifications.map((notification) => <NotificationRow key={notification.id} notification={notification} onToggle={handleToggleRead} />)
          )}
        </List>
      </Paper>
    </Box>
  )
}

export default NotificationsPage
