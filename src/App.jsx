import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { RouterProvider } from 'react-router-dom'
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary'
import AppNotifications from './components/common/AppNotifications'
import { persistor, store } from './store/store'
import { ThemeModeProvider } from './theme/ThemeModeContext'
import router from './routes/router'

function App() {
  return (
    <GlobalErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeModeProvider>
            <AppNotifications />
            <RouterProvider router={router} />
          </ThemeModeProvider>
        </PersistGate>
      </Provider>
    </GlobalErrorBoundary>
  )
}

export default App
