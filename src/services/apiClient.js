import axios from 'axios'
import { store } from '../store/store'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state?.auth?.user?.token || state?.auth?.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || 'Request failed'

      if (status === 401) {
        window.location.assign('/login')
      }

      if (!error.response) {
        return Promise.reject(new Error('Network error. Please check your connection and try again.'))
      }

      return Promise.reject(new Error(message))
    }

    return Promise.reject(new Error('Unexpected error occurred.'))
  },
)

export default apiClient
