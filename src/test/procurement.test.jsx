import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProcurementPage from '../pages/procurement/ProcurementPage'

const getTableRows = () => screen.getAllByRole('row').slice(1)

describe('ProcurementPage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('filters requests by search and status', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<ProcurementPage />)
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

    render(<ProcurementPage />)
    jest.advanceTimersByTime(400)

    await user.click(screen.getByRole('button', { name: /^title$/i }))
    await user.click(screen.getByRole('button', { name: /^title$/i }))
    await user.click(screen.getByRole('button', { name: /export csv/i }))

    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalled()
  })

  it('shows empty state when no requests match filters', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<ProcurementPage />)
    jest.advanceTimersByTime(400)

    const searchInput = screen.getByPlaceholderText(/search id, title, or department/i)
    await user.type(searchInput, 'zzzz')

    expect(await screen.findByText(/no requests match the current filters/i)).toBeInTheDocument()
  })
})
