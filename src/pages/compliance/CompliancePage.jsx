import {
  AssignmentLateRounded,
  FactCheckRounded,
  FolderOffRounded,
  ShieldRounded,
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComplianceItems } from '../../store/slices/complianceSlice'

const severityColors = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
  Critical: 'error',
}

const statusColors = {
  Open: 'error',
  Escalated: 'warning',
  Monitoring: 'info',
  Resolved: 'success'
}

const CompliancePage = () => {
  const dispatch = useDispatch()
  const { items: data, status } = useSelector((state) => state.compliance)
  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    dispatch(fetchComplianceItems())
  }, [dispatch])

  if (loading) {
    return <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={400} /></Box>
  }

  const kpiCards = [
    { title: 'Overall Score', value: `${data?.monitoring?.score || 0}%`, icon: <FactCheckRounded />, color: 'success.main' },
    { title: 'Open Violations', value: data?.violations?.filter(v => v.status === 'Open').length || 0, icon: <AssignmentLateRounded />, color: 'warning.main' },
    { title: 'Missing Documents', value: data?.missingDocuments?.length || 0, icon: <FolderOffRounded />, color: 'info.main' },
    { title: 'Certifications at Risk', value: data?.expiredCertifications?.length || 0, icon: <ShieldRounded />, color: 'error.main' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Compliance Center
        </Typography>
        <Typography color="text.secondary">
          Review policy gaps, document readiness, and certification expiry exposure.
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
                Violations
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.violations?.map((violation) => (
                      <TableRow key={violation.id} hover>
                        <TableCell>{violation.id}</TableCell>
                        <TableCell>{violation.vendor}</TableCell>
                        <TableCell>{violation.type}</TableCell>
                        <TableCell>
                          <Chip label={violation.severity} color={severityColors[violation.severity]} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={violation.status} color={statusColors[violation.status] || 'default'} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Missing Documents
              </Typography>
              <List disablePadding>
                {data?.missingDocuments?.map((document) => (
                  <ListItem key={document.id} divider>
                    <ListItemIcon>
                      <FolderOffRounded color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={document.document} secondary={`Vendor: ${document.vendor} • Due: ${document.dueDate}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Expiring / Expired Certifications
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Certification</TableCell>
                  <TableCell>Expired On</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.expiredCertifications?.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.certification}</TableCell>
                    <TableCell>{item.expiredOn}</TableCell>
                    <TableCell>
                      <Chip label="Expired" color="error" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CompliancePage
