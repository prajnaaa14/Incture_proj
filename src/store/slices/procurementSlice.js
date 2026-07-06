import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import requests from '../../mocks/requests.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchProcurementPipeline = createAsyncThunk('procurement/fetchProcurementPipeline', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = {
      items: requests,
      totalValue: requests.reduce((sum, request) => sum + request.amount, 0),
    }
    dispatch(pushSnackbar({ message: 'Procurement pipeline loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load procurement pipeline.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  items: [],
  totalValue: 0,
  status: 'idle',
  error: null,
}

const procurementSlice = createSlice({
  name: 'procurement',
  initialState,
  reducers: {
    addProcurementRequest: (state, action) => {
      const newRequest = {
        id: `REQ-${String(state.items.length + 1).padStart(3, '0')}`,
        title: action.payload.title,
        department: action.payload.department,
        amount: Number(action.payload.amount),
        status: 'Pending',
        createdBy: action.payload.createdBy || 'System',
        createdDate: new Date().toISOString().split('T')[0],
        approvalHistory: [
          { step: 'Submitted', date: new Date().toISOString().split('T')[0], by: action.payload.createdBy || 'System' }
        ],
        comments: [],
        attachments: []
      };
      state.items.unshift(newRequest);
      state.totalValue += newRequest.amount;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcurementPipeline.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProcurementPipeline.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.totalValue = action.payload.totalValue
      })
      .addCase(fetchProcurementPipeline.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { addProcurementRequest } = procurementSlice.actions
export default procurementSlice.reducer
