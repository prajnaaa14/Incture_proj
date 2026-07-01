import { configureStore } from '@reduxjs/toolkit'
import authReducer, { loginThunk, bootstrapAuth } from '../store/slices/authSlice'
import procurementReducer, { fetchProcurementPipeline } from '../store/slices/procurementSlice'
import notificationReducer, { fetchNotifications } from '../store/slices/notificationSlice'
import uiReducer from '../store/slices/uiSlice'

describe('redux slices', () => {
  it('handles auth login success and failure', async () => {
    const store = configureStore({ reducer: { auth: authReducer, ui: uiReducer } })

    const success = await store.dispatch(loginThunk({ email: 'asha.rao@enterprise.com', password: 'Admin123!' }))
    expect(success.type).toBe('auth/loginThunk/fulfilled')
    expect(store.getState().auth.isAuthenticated).toBe(true)

    const failure = await store.dispatch(loginThunk({ email: 'bad@example.com', password: 'wrong' }))
    expect(failure.type).toBe('auth/loginThunk/rejected')
    expect(store.getState().auth.error).toBe('Invalid email or password')
  })

  it('bootstraps auth state', async () => {
    const store = configureStore({ reducer: { auth: authReducer, ui: uiReducer } })

    const result = await store.dispatch(bootstrapAuth())
    expect(result.type).toBe('auth/bootstrapAuth/fulfilled')
    expect(store.getState().auth.isAuthenticated).toBe(true)
  })

  it('loads procurement pipeline data', async () => {
    const store = configureStore({ reducer: { procurement: procurementReducer, ui: uiReducer } })

    const result = await store.dispatch(fetchProcurementPipeline())
    expect(result.type).toBe('procurement/fetchProcurementPipeline/fulfilled')
    expect(store.getState().procurement.items).toHaveLength(3)
  })

  it('loads notifications', async () => {
    const store = configureStore({ reducer: { notification: notificationReducer, ui: uiReducer } })

    const result = await store.dispatch(fetchNotifications())
    expect(result.type).toBe('notification/fetchNotifications/fulfilled')
    expect(store.getState().notification.items).toHaveLength(15)
  })

  it('captures rejected auth and slice paths', async () => {
    const store = configureStore({ reducer: { auth: authReducer, ui: uiReducer } })

    const failedLogin = await store.dispatch(loginThunk({ email: 'bad@example.com', password: 'wrong' }))
    expect(failedLogin.type).toBe('auth/loginThunk/rejected')
    expect(store.getState().auth.error).toBe('Invalid email or password')
  })
})
