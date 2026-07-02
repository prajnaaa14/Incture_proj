import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'

// Create Axios Instance with Base URL and Timeout
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.enterprise.com/v1',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attempt to grab the token from the Redux store
    // (In a real app, this might come from auth state or localStorage directly)
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error)
  }
)

// Response Interceptor & Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Extract and return data directly for cleaner API calls
    return response.data
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const { response } = error

    if (response) {
      // Server responded with a status other than 200 range
      switch (response.status) {
        case 401:
          // Unauthorized - Token expired or invalid
          console.error('Session expired or unauthorized. Logging out...')
          // Dispatch logout to clear state and redirect to login via RouteGuard
          store.dispatch(logout())
          break
        case 403:
          console.error('Forbidden: You do not have access to this resource.')
          break
        case 404:
          console.error('Resource not found.')
          break
        case 500:
          console.error('Internal Server Error.')
          break
        default:
          console.error(`API Error: ${response.status} - ${response.data?.message || error.message}`)
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g. Network Error)
      console.error('Network Error: No response received from the server.')
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message)
    }

    // Reject the promise to allow caller to handle UI feedback
    return Promise.reject(error)
  }
)

export default apiClient
