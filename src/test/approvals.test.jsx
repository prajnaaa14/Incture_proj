import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ApprovalsPage from '../pages/approvals/ApprovalsPage'
import uiReducer from '../store/slices/uiSlice'

describe('ApprovalsPage', () => {
  it('updates an item to Approved when the approval action is confirmed', async () => {
    const store = configureStore({ reducer: { ui: uiReducer } })
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <ApprovalsPage />
      </Provider>
    )

    await user.click(screen.getAllByRole('button', { name: 'Approve' })[0])
    await user.click(screen.getByRole('button', { name: /confirm approve/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /approved/i }))

    expect(screen.getByText('Cloud migration hardware refresh')).toBeInTheDocument()
  })
})
