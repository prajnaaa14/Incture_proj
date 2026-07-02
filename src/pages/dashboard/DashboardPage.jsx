import {
  AssessmentRounded,
  AssignmentTurnedInRounded,
  CheckCircleRounded,
  FactCheckRounded,
  GroupRounded,
  NotificationsRounded,
  ReportProblemRounded,
  ShieldRounded,
} from '@mui/icons-material'
import { Box, Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import requests from '../../mocks/requests.json'
import riskData from '../../mocks/riskData.json'
import { fetchDashboardMetrics } from '../../store/slices/dashboardSlice'
import { fetchNotifications } from '../../store/slices/notificationSlice'
import { fetchRiskSignals } from '../../store/slices/riskSlice'
import { fetchVendors } from '../../store/slices/vendorSlice'

const departmentSpending = [
  { department: 'IT', amount: 320000 },
  { department: 'Operations', amount: 280000 },
  { department: 'Finance', amount: 190000 },
  { department: 'Compliance', amount: 150000 },
  { department: 'Engineering', amount: 260000 },
  { department: 'Supply Chain', amount: 240000 },
]

const complianceStatus = [
  { name: 'Compliant', value: 64, color: '#2e7d32' },
  { name: 'Review', value: 21, color: '#ed6c02' },
  { name: 'At Risk', value: 15, color: '#d32f2f' },
]

const DashboardPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const role = user?.role

  const dashboardStatus = useSelector((state) => state.dashboard.status)
  const dashboardSummary = useSelector((state) => state.dashboard.summary)
  const dashboardTrend = useSelector((state) => state.dashboard.trend)
  const riskStatus = useSelector((state) => state.risk.status)
  const riskSignals = useSelector((state) => state.risk.items)
  const vendorStatus = useSelector((state) => state.vendor.status)
  const vendors = useSelector((state) => state.vendor.vendors)
  const notificationStatus = useSelector((state) => state.notification.status)
  const notifications = useSelector((state) => state.notification.items)

  const safeRiskSignals = Array.isArray(riskSignals) ? riskSignals : []
  const safeVendors = Array.isArray(vendors) ? vendors : []
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const safeDashboardTrend = Array.isArray(dashboardTrend) ? dashboardTrend : []

  const hasExistingData = Boolean(dashboardSummary || safeDashboardTrend.length || safeRiskSignals.length || safeVendors.length || safeNotifications.length)

  useEffect(() => {
    if (dashboardStatus === 'idle' && !dashboardSummary) dispatch(fetchDashboardMetrics())
    if (riskStatus === 'idle' && !safeRiskSignals.length) dispatch(fetchRiskSignals())
    if (notificationStatus === 'idle' && !safeNotifications.length) dispatch(fetchNotifications())
    if (vendorStatus === 'idle' && !safeVendors.length) dispatch(fetchVendors())
  }, [dashboardStatus, dashboardSummary, dispatch, notificationStatus, safeNotifications.length, safeRiskSignals.length, riskStatus, safeVendors.length, vendorStatus])

  const isLoading = [dashboardStatus, riskStatus, vendorStatus, notificationStatus].some((status) => status === 'loading') && !hasExistingData

  const kpiCards = useMemo(() => {
    const allKpis = [
      { id: 'total', title: 'Total Requests', value: requests.length, icon: <AssignmentTurnedInRounded />, color: 'primary.main' },
      { id: 'pending', title: 'Pending', value: requests.filter((r) => r.status === 'Pending').length, icon: <NotificationsRounded />, color: 'warning.main' },
      { id: 'approved', title: 'Approved', value: requests.filter((r) => r.status === 'Approved').length, icon: <CheckCircleRounded />, color: 'success.main' },
      { id: 'rejected', title: 'Rejected', value: requests.filter((r) => r.status === 'Rejected').length, icon: <ReportProblemRounded />, color: 'error.main' },
      { id: 'vendors', title: 'Total Vendors', value: safeVendors.length, icon: <GroupRounded />, color: 'secondary.main' },
      { id: 'risks', title: 'Active Risks', value: safeRiskSignals.filter((r) => r.status === 'Open' || r.status === 'Monitoring').length, icon: <ShieldRounded />, color: 'info.main' },
      { id: 'compliance', title: 'Compliance Issues', value: 3, icon: <FactCheckRounded />, color: 'warning.main' },
    ]

    return allKpis.filter(card => {
      if (role === 'employee') return ['total', 'pending', 'approved', 'rejected'].includes(card.id)
      if (role === 'auditor') return ['vendors', 'risks', 'compliance'].includes(card.id)
      return true
    })
  }, [safeVendors.length, safeRiskSignals, role])

  const monthlyTrend = safeDashboardTrend.length
    ? safeDashboardTrend.map((item) => ({ month: item.label, value: item.value }))
    : Array.from({ length: 12 }, (_, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        value: 180000 + index * 12000 + (index % 3) * 5000,
      }))

  const timelineEvents = safeNotifications.slice(0, 10).map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Loading dashboard data and analytics snapshots.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card><CardContent><Skeleton variant="rectangular" height={44} /></CardContent></Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {role === 'employee' ? 'My Dashboard' : role === 'auditor' ? 'Audit Overview' : 'Executive Dashboard'}
        </Typography>
        <Typography color="text.secondary">
          {role === 'employee' ? 'Track your active procurement requests and recent updates.' : 'Cross-functional procurement, vendor, risk, and compliance overview.'}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {kpiCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {card.value}
                    </Typography>
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

      {role !== 'auditor' && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={role === 'employee' ? 12 : 8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Monthly Procurement Trend
                </Typography>
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {role !== 'employee' && (
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Compliance Status
                  </Typography>
                  <Box sx={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={complianceStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                          {complianceStatus.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {role !== 'employee' && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {role === 'auditor' ? 'Audit Violations by Department' : 'Department Spending'}
                </Typography>
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={departmentSpending} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
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
                    <AreaChart data={riskData.trend} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fda4af" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Activity Timeline
          </Typography>
          <Stack spacing={2}>
            {timelineEvents.map((event) => (
              <Box key={event.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, borderBottom: 1, borderColor: 'divider', pb: 1.5 }}>
                <Box sx={{ mt: 0.2 }}>
                  <AssessmentRounded color="primary" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.5}>
                    <Typography fontWeight={600}>{event.message}</Typography>
                    <Chip size="small" label={event.type} variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {event.time} • {event.id} • {event.priority} priority
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DashboardPage
