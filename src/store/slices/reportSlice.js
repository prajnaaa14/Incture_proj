import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import reports from '../../mocks/reports.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchReports = createAsyncThunk('report/fetchReports', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = { reports }
    dispatch(pushSnackbar({ message: 'Reports loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load reports.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  reports: [],
  status: 'idle',
  error: null,
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.reports = action.payload.reports
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default reportSlice.reducer
