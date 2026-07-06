import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'

import mockData from '../../mocks/audit.json'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))
export const fetchAuditData = createAsyncThunk('audit/fetchAuditData', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    dispatch(pushSnackbar({ message: 'Audit trail loaded.', severity: 'success' }))
    return mockData
  } catch (error) {
    const message = error?.message || 'Unable to load audit trail.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  entries: [],
  data: null,
  status: 'idle',
  error: null,
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAuditData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.entries = action.payload
        state.data = action.payload
      })
      .addCase(fetchAuditData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const fetchAuditTrail = fetchAuditData
export default auditSlice.reducer
