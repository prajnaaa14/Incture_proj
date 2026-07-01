import {
  AssessmentRounded,
  BarChartRounded,
  BugReportRounded,
  ReportProblemRounded,
  ShieldRounded,
  TrendingUpRounded,
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import riskData from '../../mocks/riskData.json'

const kpiCards = [
  { title: 'Open Risks', value: riskData.riskList.filter((risk) => risk.status === 'Open').length, icon: <ReportProblemRounded />, color: 'error.main' },
  { title: 'Monitoring', value: riskData.riskList.filter((risk) => risk.status === 'Monitoring').length, icon: <ShieldRounded />, color: 'warning.main' },
  { title: 'Mitigating', value: riskData.riskList.filter((risk) => risk.status === 'Mitigating').length, icon: <BugReportRounded />, color: 'info.main' },
  { title: 'Resolved', value: riskData.riskList.filter((risk) => risk.status === 'Resolved').length, icon: <AssessmentRounded />, color: 'success.main' },
]

const getHeatColor = (value) => {
  if (value <= 2) return '#2e7d32'
  if (value <= 4) return '#ed6c02'
  if (value <= 6) return '#f9a825'
  return '#d32f2f'
}

const severityColors = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
}

const RiskPage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Risk Center
      </Typography>
      <Typography color="text.secondary">
        Track emerging exposures, assess severity, and monitor trend movement across the enterprise.
      </Typography>
    </Box>

    <Grid container spacing={2}>
      {kpiCards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                  <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                </Box>
                <Box sx={{ color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: `${card.color}22` }}>
                  {card.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Risk Heat Map
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              5x5 matrix mapping likelihood against impact.
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={1.5} />
                  {riskData.matrix.impact.map((impact) => (
                    <Grid item xs={2} key={impact}>
                      <Typography variant="caption" fontWeight={600} display="block" align="center">
                        {impact}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {riskData.matrix.likelihood.map((likelihood, rowIndex) => (
                <Grid item xs={12} key={likelihood}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1.5}>
                      <Typography variant="caption" fontWeight={600}>{likelihood}</Typography>
                    </Grid>
                    {riskData.matrix.values[rowIndex].map((value) => (
                      <Grid item xs={2} key={`${likelihood}-${value}`}>
                        <Box sx={{ minHeight: 52, borderRadius: 1, bgcolor: getHeatColor(value), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {value}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Risk Trend
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={riskData.trend}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[3, 7]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#d32f2f" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Grid container spacing={3}>
      <Grid item xs={12} lg={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Risk Distribution
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={riskData.distribution} dataKey="value" nameKey="category" outerRadius={90} label>
                    {riskData.distribution.map((entry) => (
                      <Cell key={entry.category} fill={['#2563eb', '#7c3aed', '#ef4444', '#0f766e', '#f59e0b'][riskData.distribution.indexOf(entry)]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Risk Register
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskData.riskList.map((risk) => (
                    <TableRow key={risk.id} hover>
                      <TableCell>{risk.id}</TableCell>
                      <TableCell>{risk.title}</TableCell>
                      <TableCell>
                        <Chip label={risk.severity} color={severityColors[risk.severity]} size="small" />
                      </TableCell>
                      <TableCell>{risk.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
)

export default RiskPage
