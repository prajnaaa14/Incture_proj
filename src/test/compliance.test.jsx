import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import complianceReducer, { fetchComplianceItems } from '../store/slices/complianceSlice'
import CompliancePage from '../pages/compliance/CompliancePage'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { compliance: complianceReducer }
  })
  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

describe('CompliancePage', () => {
  it('renders compliance sections', async () => {
    renderWithProviders(<CompliancePage />)
    
    expect(screen.getByText(/Compliance Center/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Overall Score/i)).toBeInTheDocument()
      expect(screen.getByText(/Missing Documents/i)).toBeInTheDocument()
    })
  })
})

describe('complianceSlice', () => {
  it('loads compliance data successfully', async () => {
    const store = configureStore({ reducer: { compliance: complianceReducer } })
    const result = await store.dispatch(fetchComplianceItems())
    
    expect(result.type).toBe('compliance/fetchComplianceItems/fulfilled')
    expect(store.getState().compliance.items).toBeDefined()
  })
})
