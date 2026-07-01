import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchComplianceItems = createAsyncThunk('compliance/fetchComplianceItems', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = {
      items: [
        { id: 'C-01', title: 'SOC 2 attestation', status: 'Compliant' },
        { id: 'C-02', title: 'Supplier onboarding', status: 'Pending' },
      ],
    }
    dispatch(pushSnackbar({ message: 'Compliance items loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load compliance items.'
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
        state.items = action.payload.items
      })
      .addCase(fetchComplianceItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default complianceSlice.reducer
