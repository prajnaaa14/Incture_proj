import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pushSnackbar } from './uiSlice'

export const fetchAuditTrail = createAsyncThunk('audit/fetchAuditTrail', async (_, { dispatch, rejectWithValue }) => {
  try {
    const payload = {
      entries: [
        { id: 'A-01', event: 'Approval granted', actor: 'L. Chen', timestamp: '09:10' },
        { id: 'A-02', event: 'Vendor policy updated', actor: 'M. Patel', timestamp: '11:25' },
      ],
    }
    dispatch(pushSnackbar({ message: 'Audit trail loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load audit trail.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  entries: [],
  status: 'idle',
  error: null,
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditTrail.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAuditTrail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.entries = action.payload.entries
      })
      .addCase(fetchAuditTrail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default auditSlice.reducer
