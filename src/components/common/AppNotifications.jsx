import { Alert, Snackbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { clearSnackbars } from '../../store/slices/uiSlice'

const AppNotifications = () => {
  const dispatch = useDispatch()
  const snackbars = useSelector((state) => state.ui?.snackbars || [])

  const handleClose = (id) => {
    dispatch(clearSnackbars())
  }

  if (!snackbars.length) return null

  const latest = snackbars[snackbars.length - 1]

  return (
    <Snackbar
      open
      autoHideDuration={4000}
      onClose={() => handleClose(latest.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={() => handleClose(latest.id)} severity={latest.severity || 'info'} sx={{ width: '100%' }}>
        {latest.message}
      </Alert>
    </Snackbar>
  )
}

export default AppNotifications
