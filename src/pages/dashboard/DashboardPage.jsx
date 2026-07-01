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
import { useEffect } from 'react'
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
  const dashboardStatus = useSelector((state) => state.dashboard.status)
  const dashboardSummary = useSelector((state) => state.dashboard.summary)
  const dashboardTrend = useSelector((state) => state.dashboard.trend)
  const riskStatus = useSelector((state) => state.risk.status)
  const riskSignals = useSelector((state) => state.risk.items)
  const vendorStatus = useSelector((state) => state.vendor.status)
  const vendors = useSelector((state) => state.vendor.vendors)
  const notificationStatus = useSelector((state) => state.notification.status)
  const notifications = useSelector((state) => state.notification.items)

  const hasExistingData = Boolean(dashboardSummary || dashboardTrend.length || riskSignals.length || vendors.length || notifications.length)

  useEffect(() => {
    if (dashboardStatus === 'idle' && !dashboardSummary) {
      dispatch(fetchDashboardMetrics())
    }

    if (riskStatus === 'idle' && !riskSignals.length) {
      dispatch(fetchRiskSignals())
    }

    if (notificationStatus === 'idle' && !notifications.length) {
      dispatch(fetchNotifications())
    }

    if (vendorStatus === 'idle' && !vendors.length) {
      dispatch(fetchVendors())
    }
  }, [dashboardStatus, dashboardSummary, dispatch, notificationStatus, notifications.length, riskSignals.length, riskStatus, vendorStatus, vendors.length])

  const isLoading = [dashboardStatus, riskStatus, vendorStatus, notificationStatus].some((status) => status === 'loading') && !hasExistingData

  const kpiCards = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: <AssignmentTurnedInRounded />,
      color: 'primary.main',
    },
    {
      title: 'Pending',
      value: requests.filter((request) => request.status === 'Pending').length,
      icon: <NotificationsRounded />,
      color: 'warning.main',
    },
    {
      title: 'Approved',
      value: requests.filter((request) => request.status === 'Approved').length,
      icon: <CheckCircleRounded />,
      color: 'success.main',
    },
    {
      title: 'Rejected',
      value: requests.filter((request) => request.status === 'Rejected').length,
      icon: <ReportProblemRounded />,
      color: 'error.main',
    },
    {
      title: 'Total Vendors',
      value: vendors.length,
      icon: <GroupRounded />,
      color: 'secondary.main',
    },
    {
      title: 'Active Risks',
      value: riskSignals.filter((risk) => risk.status === 'Open' || risk.status === 'Monitoring').length,
      icon: <ShieldRounded />,
      color: 'info.main',
    },
    {
      title: 'Compliance Issues',
      value: 3,
      icon: <FactCheckRounded />,
      color: 'warning.main',
    },
  ]

  const monthlyTrend = dashboardTrend.length
    ? dashboardTrend.map((item) => ({ month: item.label, value: item.value }))
    : Array.from({ length: 12 }, (_, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        value: 180000 + index * 12000 + (index % 3) * 5000,
      }))

  const timelineEvents = notifications.slice(0, 10).map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Executive Dashboard
          </Typography>
          <Typography color="text.secondary">
            Loading dashboard data and analytics snapshots.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {Array.from({ length: 7 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" height={44} sx={{ mt: 1.5 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={280} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="55%" height={30} />
                <Skeleton variant="circular" width={120} height={120} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Executive Dashboard
      </Typography>
      <Typography color="text.secondary">
        Cross-functional procurement, vendor, risk, and compliance overview.
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

    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Monthly Procurement Trend
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyTrend}>
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

      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Compliance Status Distribution
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
    </Grid>

    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Department Spending
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={departmentSpending}>
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
                <AreaChart data={riskData.trend}>
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
