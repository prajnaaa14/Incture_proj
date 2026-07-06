import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import riskReducer, { fetchRiskData } from '../store/slices/riskSlice'
import RiskPage from '../pages/risk/RiskPage'

import riskData from '../mocks/riskData.json'

const renderWithProviders = (ui, { store } = {}) => {
  const testStore = store || configureStore({
    reducer: { risk: riskReducer },
    preloadedState: {
      risk: {
        data: {
          metrics: {},
          ...riskData
        },
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

describe('RiskPage', () => {
  it('renders risk dashboard and charts', async () => {
    // Recharts uses ResizeObserver which doesn't exist in JSDOM, polyfill it for tests
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    renderWithProviders(<RiskPage />)
    
    expect(screen.getByText(/Risk Center/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Open Risks/i)).toBeInTheDocument()
      expect(screen.getByText(/Mitigating/i, { selector: 'p' })).toBeInTheDocument()
    })
  })
})

describe('riskSlice', () => {
  it('loads risk data successfully', async () => {
    const store = configureStore({ reducer: { risk: riskReducer } })
    const result = await store.dispatch(fetchRiskData())
    
    expect(result.type).toBe('risk/fetchRiskData/fulfilled')
    expect(store.getState().risk.data).toBeDefined()
    expect(store.getState().risk.data.metrics).toBeDefined()
  })
})
