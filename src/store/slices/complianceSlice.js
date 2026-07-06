import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'

import mockData from '../../mocks/compliance.json'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchComplianceItems = createAsyncThunk('compliance/fetchComplianceItems', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    dispatch(pushSnackbar({ message: 'Compliance data loaded.', severity: 'success' }))
    return mockData
  } catch (error) {
    const message = error?.message || 'Unable to load compliance data.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceItems.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchComplianceItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchComplianceItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default complianceSlice.reducer
