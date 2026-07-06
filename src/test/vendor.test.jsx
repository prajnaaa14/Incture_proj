import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import vendorReducer, { fetchVendors } from '../store/slices/vendorSlice'
import VendorsPage from '../pages/vendors/VendorsPage'

import vendorData from '../mocks/vendors.json'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { vendor: vendorReducer },
    preloadedState: {
      vendor: {
        items: vendorData,
        vendors: vendorData,
        status: 'succeeded',
        error: null
      }
    }
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
    renderWithProviders(<VendorsPage />)
    
    expect(screen.getByText(/Vendor Governance/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Active/i, { selector: 'p' })).toBeInTheDocument()
      expect(screen.getByText(/High Risk/i, { selector: 'p' })).toBeInTheDocument()
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
