import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { decrement, increment, incrementByAmount } from '../store/slices/counterSlice'
import StatCard from '../components/common/StatCard'
import { dashboardData } from '../mocks/dashboardData'
import { useFetchData } from '../hooks/useFetchData'

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
})

const HomePage = () => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const { posts, loading, error } = useFetchData()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  const [submittedName, setSubmittedName] = useState('')

  const onSubmit = (data) => {
    setSubmittedName(data.name)
    dispatch(incrementByAmount(5))
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome to your React 19 starter app
      </Typography>
      <Typography color="text.secondary" paragraph>
        This structure is ready for Material UI, Redux Toolkit, React Router, Axios, React Hook Form, Yup, and Recharts.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Redux counter" value={count} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Submitted name" value={submittedName || '—'} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Posts loaded" value={loading ? 'Loading…' : posts.length} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" onClick={() => dispatch(increment())}>
                  +1
                </Button>
                <Button variant="outlined" onClick={() => dispatch(decrement())}>
                  -1
                </Button>
              </Stack>
              <Typography variant="h6" gutterBottom>
                React Hook Form + Yup
              </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  fullWidth
                  label="Name"
                  {...register('name')}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recharts preview
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={dashboardData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error ? (
        <Typography color="error.main" sx={{ mt: 3 }}>
          Axios error: {error}
        </Typography>
      ) : null}
    </Box>
  )
}

export default HomePage
