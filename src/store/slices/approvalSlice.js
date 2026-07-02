import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'
import mockData from '../../mocks/approvals.json'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchApprovals = createAsyncThunk('approvals/fetchApprovals', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    dispatch(pushSnackbar({ message: 'Approvals data loaded.', severity: 'success' }))
    return mockData
  } catch (error) {
    const message = error?.message || 'Unable to load approvals data.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  data: {
    pending: [],
    approved: [],
    rejected: [],
    escalated: []
  },
  status: 'idle',
  error: null,
}

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    approveRequest: (state, action) => {
      const id = action.payload
      const index = state.data.pending.findIndex(req => req.id === id)
      if (index !== -1) {
        const item = state.data.pending[index]
        state.data.pending.splice(index, 1)
        state.data.approved.push(item)
      }
    },
    rejectRequest: (state, action) => {
      const id = action.payload
      const index = state.data.pending.findIndex(req => req.id === id)
      if (index !== -1) {
        const item = state.data.pending[index]
        state.data.pending.splice(index, 1)
        state.data.rejected.push(item)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovals.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchApprovals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchApprovals.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { approveRequest, rejectRequest } = approvalSlice.actions
export default approvalSlice.reducer
