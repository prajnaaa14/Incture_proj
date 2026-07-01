import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarCollapsed: false,
  activeModule: 'overview',
  globalLoading: false,
  snackbars: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setActiveModule: (state, action) => {
      state.activeModule = action.payload
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    pushSnackbar: (state, action) => {
      state.snackbars.push({ id: Date.now(), ...action.payload })
    },
    clearSnackbars: (state) => {
      state.snackbars = []
    },
  },
})

export const { toggleSidebar, setActiveModule, setGlobalLoading, pushSnackbar, clearSnackbars } = uiSlice.actions
export default uiSlice.reducer
