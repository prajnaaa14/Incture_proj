import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import vendorReducer, { fetchVendors } from '../store/slices/vendorSlice'
import VendorPage from '../pages/vendor/VendorPage'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { vendor: vendorReducer }
  })
  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

describe('VendorPage', () => {
  it('renders vendor KPIs and table', async () => {
    renderWithProviders(<VendorPage />)
    
    expect(screen.getByText(/Vendor Directory/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Active Vendors/i)).toBeInTheDocument()
      expect(screen.getByText(/At Risk/i)).toBeInTheDocument()
    })
  })
})

describe('vendorSlice', () => {
  it('loads vendors successfully', async () => {
    const store = configureStore({ reducer: { vendor: vendorReducer } })
    const result = await store.dispatch(fetchVendors())
    
    expect(result.type).toBe('vendor/fetchVendors/fulfilled')
    expect(store.getState().vendor.items.length).toBeGreaterThan(0)
  })
})
