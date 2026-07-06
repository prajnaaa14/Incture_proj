import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import reportReducer, { fetchReports } from '../store/slices/reportSlice'
import ReportsPage from '../pages/reports/ReportsPage'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { report: reportReducer }
  })
  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

describe('ReportsPage', () => {
  it('renders report categories and list', async () => {
    // Mock URL.createObjectURL to avoid errors in CSV export tests if added later
    window.URL.createObjectURL = jest.fn()
    
    renderWithProviders(<ReportsPage />)
    
    expect(screen.getByText(/Reporting Center/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Available Reports/i)).toBeInTheDocument()
    })
  })
})

describe('reportSlice', () => {
  it('loads reports successfully', async () => {
    const store = configureStore({ reducer: { report: reportReducer } })
    const result = await store.dispatch(fetchReports())
    
    expect(result.type).toBe('report/fetchReports/fulfilled')
    expect(store.getState().report.reports).toBeDefined()
  })
})
