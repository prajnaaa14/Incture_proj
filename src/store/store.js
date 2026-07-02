import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import authReducer from './slices/authSlice'
import auditReducer from './slices/auditSlice'
import complianceReducer from './slices/complianceSlice'
import counterReducer from './slices/counterSlice'
import dashboardReducer from './slices/dashboardSlice'
import notificationReducer from './slices/notificationSlice'
import procurementReducer from './slices/procurementSlice'
import reportReducer from './slices/reportSlice'
import riskReducer from './slices/riskSlice'
import uiReducer from './slices/uiSlice'
import vendorReducer from './slices/vendorSlice'
import approvalReducer from './slices/approvalSlice'

const createNoopStorage = () => ({
  getItem: async () => null,
  setItem: async (_key, value) => value,
  removeItem: async () => {},
})

const storage = typeof window !== 'undefined' && window.localStorage
  ? {
      getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
      setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
      removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
    }
  : createNoopStorage()

const persistConfig = {
  key: 'enterprise-console-root',
  storage,
  whitelist: ['auth', 'dashboard', 'procurement', 'vendor', 'risk', 'compliance', 'audit', 'report', 'notification', 'ui', 'approvals'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  procurement: procurementReducer,
  vendor: vendorReducer,
  risk: riskReducer,
  compliance: complianceReducer,
  audit: auditReducer,
  report: reportReducer,
  notification: notificationReducer,
  ui: uiReducer,
  counter: counterReducer,
  approvals: approvalReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

