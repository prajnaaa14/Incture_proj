import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
})

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data) => {
    setSent(true)
    reset({ email: data.email })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Forgot password
            </Typography>
            <Typography color="text.secondary">
              Enter your email to receive a reset link.
            </Typography>
          </Box>

          {sent && <Alert severity="success">Reset link sent. Please check your inbox.</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField label="Email" type="email" fullWidth {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
              <Button type="submit" variant="contained" size="large">
                Send reset link
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ForgotPasswordPage
