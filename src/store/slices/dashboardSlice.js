import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'
import { dashboardData } from '../../mocks/dashboardData.js'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchDashboardMetrics = createAsyncThunk('dashboard/fetchDashboardMetrics', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = {
      summary: {
        revenue: 1845000,
        margin: 31,
        openDeals: 24,
        riskExposure: 8.6,
      },
      trend: dashboardData.map(({ month, sales }) => ({ label: month, value: sales })),
      updatedAt: '2026-06-29',
    }
    dispatch(pushSnackbar({ message: 'Dashboard data refreshed.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to refresh dashboard data.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  summary: null,
  trend: [],
  status: 'idle',
  error: null,
  updatedAt: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.summary = action.payload.summary
        state.trend = action.payload.trend
        state.updatedAt = action.payload.updatedAt
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default dashboardSlice.reducer
