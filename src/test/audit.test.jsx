import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import auditReducer, { fetchAuditData } from '../store/slices/auditSlice'
import AuditPage from '../pages/audit/AuditPage'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { audit: auditReducer }
  })
  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

describe('AuditPage', () => {
  it('renders audit center panels', async () => {
    renderWithProviders(<AuditPage />)
    
    expect(screen.getByText(/Audit & Control/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Audit Logs/i)).toBeInTheDocument()
      expect(screen.getByText(/Recent Activities/i)).toBeInTheDocument()
    })
  })
})

describe('auditSlice', () => {
  it('loads audit data successfully', async () => {
    const store = configureStore({ reducer: { audit: auditReducer } })
    const result = await store.dispatch(fetchAuditData())
    
    expect(result.type).toBe('audit/fetchAuditData/fulfilled')
    expect(store.getState().audit.data).toBeDefined()
    expect(store.getState().audit.data.auditLogs).toBeDefined()
  })
})
