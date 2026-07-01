import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
})

const ResetPasswordPage = () => {
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data) => {
    setSuccess(true)
    reset({ password: '', confirmPassword: '' })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Reset password
            </Typography>
            <Typography color="text.secondary">
              Create a new password for your account.
            </Typography>
          </Box>

          {success && <Alert severity="success">Password reset successful. You can now sign in with your new password.</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField label="New password" type="password" fullWidth {...register('password')} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <TextField label="Confirm password" type="password" fullWidth {...register('confirmPassword')} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message} />
              <Button type="submit" variant="contained" size="large">
                Reset password
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ResetPasswordPage
