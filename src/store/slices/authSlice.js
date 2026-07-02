import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import users from '../../mocks/users.json'
import { pushSnackbar } from './uiSlice'

const simulateDelay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const bootstrapAuth = createAsyncThunk('auth/bootstrapAuth', async (_, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const payload = {
      user: {
        id: 'demo-user',
        name: 'Asha Rao',
        role: 'admin',
        team: 'Enterprise Operations',
        token: 'demo-token',
      },
      isAuthenticated: true,
      lastLogin: '2026-06-29',
    }
    dispatch(pushSnackbar({ message: 'Session restored successfully.', severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to restore your session.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

export const loginThunk = createAsyncThunk('auth/loginThunk', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    await simulateDelay()
    const cleanEmail = email?.trim().toLowerCase() || ''
    const cleanPassword = password?.trim() || ''

    const matchedUser = users.find((user) => user.email.toLowerCase() === cleanEmail)

    if (!matchedUser || matchedUser.password !== cleanPassword) {
      console.warn('Login Failed:', { inputEmail: cleanEmail, inputPassword: cleanPassword, userFound: !!matchedUser })
      const message = 'Invalid email or password'
      dispatch(pushSnackbar({ message, severity: 'error' }))
      return rejectWithValue(message)
    }

    const payload = {
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        department: matchedUser.department,
        avatar: matchedUser.avatar,
        token: `mock-token-${matchedUser.id}`,
      },
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    }

    dispatch(pushSnackbar({ message: `Welcome back, ${matchedUser.name.split(' ')[0]}!`, severity: 'success' }))
    return payload
  } catch (error) {
    const message = error?.message || 'Unable to sign in.'
    dispatch(pushSnackbar({ message, severity: 'error' }))
    return rejectWithValue(message)
  }
})

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  lastLogin: null,
  sessionExpired: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.lastLogin = null
      state.sessionExpired = false
    },
    setSession: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.lastLogin = action.payload.lastLogin
      state.sessionExpired = false
    },
    expireSession: (state) => {
      state.isAuthenticated = false
      state.sessionExpired = true
      state.user = null
      state.error = 'Session expired. Please sign in again.'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.isAuthenticated = action.payload.isAuthenticated
        state.lastLogin = action.payload.lastLogin
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.isAuthenticated = action.payload.isAuthenticated
        state.lastLogin = action.payload.lastLogin
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to sign in'
      })
  },
})

export const { logout, setSession, expireSession } = authSlice.actions
export default authSlice.reducer
