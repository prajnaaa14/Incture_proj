import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import vendors from '../../mocks/vendors.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchVendors = createAsyncThunk('vendor/fetchVendors', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = { vendors }
    dispatch(pushSnackbar({ message: 'Vendor data loaded.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to load vendor data.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  items: [],
  vendors: [],
  status: 'idle',
  error: null,
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.vendors
        state.vendors = action.payload.vendors
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default vendorSlice.reducer
