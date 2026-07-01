import { Card, CardContent, Typography } from '@mui/material'

const StatCard = ({ title, value }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </CardContent>
  </Card>
)

export default StatCard
