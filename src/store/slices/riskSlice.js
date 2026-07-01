import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import riskData from '../../mocks/riskData.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchRiskSignals = createAsyncThunk('risk/fetchRiskSignals', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = {
      items: Array.isArray(riskData?.riskList) ? riskData.riskList : Array.isArray(riskData) ? riskData : [],
    }
    dispatch(pushSnackbar({ message: 'Risk signals loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load risk signals.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskSignals.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRiskSignals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
      })
      .addCase(fetchRiskSignals.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default riskSlice.reducer
