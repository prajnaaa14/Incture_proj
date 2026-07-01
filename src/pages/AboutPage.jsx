import { Box, Typography } from '@mui/material'

const AboutPage = () => (
  <Box>
    <Typography variant="h4" fontWeight={700} gutterBottom>
      About this setup
    </Typography>
    <Typography color="text.secondary">
      This app includes the requested folder structure and starter integrations for Material UI, Redux Toolkit, routing, axios, forms, and charts.
    </Typography>
  </Box>
)

export default AboutPage
