import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import riskData from '../../mocks/riskData.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchRiskData = createAsyncThunk('risk/fetchRiskData', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = riskData
    dispatch(pushSnackbar({ message: 'Risk signals loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load risk signals.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  data: {
    matrix: { likelihood: [], impact: [], values: [] },
    trend: [],
    distribution: [],
    riskList: [],
    metrics: {}
  },
  status: 'idle',
  error: null,
}

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRiskData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = {
          metrics: {},
          ...action.payload
        }
      })
      .addCase(fetchRiskData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const fetchRiskSignals = fetchRiskData
export default riskSlice.reducer
