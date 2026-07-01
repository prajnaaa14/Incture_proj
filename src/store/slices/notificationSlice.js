import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import notifications from '../../mocks/notifications.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = { items: notifications }
    dispatch(pushSnackbar({ message: 'Notifications loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load notifications.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const normalizeNotification = (item) => ({
  ...item,
  read: item.read ?? item.isRead ?? false,
  isRead: item.isRead ?? item.read ?? false,
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAllRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, read: true, isRead: true }))
    },
    toggleNotificationRead: (state, action) => {
      state.items = state.items.map((item) => (item.id === action.payload ? { ...item, read: !item.read, isRead: !item.isRead } : item))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = (action.payload.items || []).map(normalizeNotification)
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { markAllRead, toggleNotificationRead } = notificationSlice.actions
export default notificationSlice.reducer
