import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProcurementPage from '../pages/procurement/ProcurementPage'
import procurementReducer from '../store/slices/procurementSlice'
import authReducer from '../store/slices/authSlice'
import uiReducer from '../store/slices/uiSlice'
import requests from '../mocks/requests.json'
import { BrowserRouter } from 'react-router-dom'

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: {
      procurement: procurementReducer,
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: {
      procurement: {
        items: requests,
        status: 'succeeded',
        error: null,
        totalValue: requests.reduce((sum, request) => sum + request.amount, 0),
      },
      auth: {
        user: { name: 'Asha Rao', email: 'asha.rao@company.com', department: 'Operations', role: 'admin' },
        isAuthenticated: true,
      }
    }
  })
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

const getTableRows = () => screen.getAllByRole('row').slice(1)

describe('ProcurementPage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    try {
      jest.runOnlyPendingTimers()
    } catch (e) {}
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('filters requests by search and status', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithProviders(<ProcurementPage />)
    jest.advanceTimersByTime(400)

    const searchInput = screen.getByPlaceholderText(/search id, title, or department/i)
    await user.type(searchInput, 'Cloud')

    expect(await screen.findByText(/cloud infrastructure refresh/i)).toBeInTheDocument()
    expect(getTableRows().some((row) => row.textContent.includes('Enterprise software licenses'))).toBe(false)
  })

  it('supports sorting and exporting the filtered list', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const createObjectURL = jest.fn(() => 'blob:mock')
    const revokeObjectURL = jest.fn()

    Object.defineProperty(URL, 'createObjectURL', { writable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: revokeObjectURL })
    HTMLAnchorElement.prototype.click = jest.fn()

    renderWithProviders(<ProcurementPage />)
    jest.advanceTimersByTime(400)

    await user.click(screen.getByRole('button', { name: /^title$/i }))
    await user.click(screen.getByRole('button', { name: /^title$/i }))
    await user.click(screen.getByRole('button', { name: /export csv/i }))

    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalled()
  })

  it('shows empty state when no requests match filters', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithProviders(<ProcurementPage />)
    jest.advanceTimersByTime(400)

    const searchInput = screen.getByPlaceholderText(/search id, title, or department/i)
    await user.type(searchInput, 'zzzz')

    expect(await screen.findByText(/no requests match the current filters/i)).toBeInTheDocument()
  })

  it('handles row viewing, status/date filtering, and request creation dialog', async () => {
    jest.useRealTimers()
    const user = userEvent.setup()
    
    renderWithProviders(<ProcurementPage />)
    await new Promise((resolve) => setTimeout(resolve, 400))

    const viewButtons = screen.getAllByRole('button', { name: /view/i })
    await user.click(viewButtons[0])
    expect(window.location.pathname).toContain('/procurement/')

    const statusSelect = screen.getByRole('combobox', { name: /status/i })
    await user.click(statusSelect)
    const approvedOption = await screen.findByRole('option', { name: 'Approved' })
    await user.click(approvedOption)
    await new Promise((resolve) => setTimeout(resolve, 400))

    const fromInput = screen.getByLabelText(/^from$/i)
    const toInput = screen.getByLabelText(/^to$/i)
    await user.type(fromInput, '2026-06-01')
    await user.type(toInput, '2026-07-31')
    await new Promise((resolve) => setTimeout(resolve, 400))

    const createBtn = screen.getByRole('button', { name: /create request/i })
    await user.click(createBtn)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /submit request/i })
    await user.click(submitBtn)

    const titleInput = screen.getByLabelText(/request title/i)
    const amountInput = screen.getByLabelText(/estimated amount/i)
    const deptSelect = screen.getByRole('combobox', { name: /department/i })

    await user.type(titleInput, 'New Laptop')
    await user.type(amountInput, '1500')
    await user.click(deptSelect)
    
    const itOption = await screen.findByRole('option', { name: 'IT' })
    await user.click(itOption)

    await user.click(submitBtn)

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
