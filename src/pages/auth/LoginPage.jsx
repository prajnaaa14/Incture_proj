import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { loginThunk } from '../../store/slices/authSlice'

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useSelector((state) => state.auth.status)
  const authError = useSelector((state) => state.auth.error)
  const sessionExpired = useSelector((state) => state.auth.sessionExpired)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    setSubmitError('')
    const result = await dispatch(loginThunk({ email: data.email, password: data.password }))

    if (loginThunk.fulfilled.match(result)) {
      const userRole = result.payload?.user?.role
      let from = location.state?.from?.pathname || '/'

      // Force restricted roles to their designated home pages
      if (userRole === 'auditor') {
        from = '/audit'
      } else if (userRole === 'compliance') {
        from = '/compliance'
      } else if (userRole === 'employee') {
        // Employees also shouldn't go to random pages they might have bookmarked if they don't have access
        from = '/dashboard'
      } else if (from === '/dashboard') {
        // For admin/manager, let RootRedirect handle the dashboard
        from = '/'
      }
      
      navigate(from, { replace: true })
    } else {
      setSubmitError(result.payload || 'Unable to sign in')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Sign in
            </Typography>
            <Typography color="text.secondary">
              Access the enterprise procurement workspace.
            </Typography>
          </Box>

          {(authError || submitError || sessionExpired) && (
            <Alert severity={sessionExpired ? 'warning' : 'error'}>{authError || submitError || 'Your session expired. Please sign in again.'}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField label="Email" type="email" fullWidth {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
              <TextField label="Password" type="password" fullWidth {...register('password')} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <Button type="submit" variant="contained" size="large" disabled={authStatus === 'loading'}>
                {authStatus === 'loading' ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', pt: 1 }}>
            <Button component={Link} to="/forgot-password" variant="text">
              Forgot password?
            </Button>
            <Button component={Link} to="/reset-password" variant="text">
              Reset password
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default LoginPage
