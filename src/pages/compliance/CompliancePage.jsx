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
} from '@mui/material'

const violations = [
  { id: 'V-101', issue: 'Incomplete supplier onboarding', severity: 'High', status: 'Open' },
  { id: 'V-102', issue: 'Expired insurance certificate', severity: 'Critical', status: 'Escalated' },
  { id: 'V-103', issue: 'Late quarterly policy attestation', severity: 'Medium', status: 'Monitoring' },
]

const missingDocuments = [
  'SOC 2 report for Northwind Supplies',
  'Environmental compliance attestation for Harbor Chemicals',
  'Data processing agreement for BluePeak Technologies',
]

const certifications = [
  { vendor: 'Northwind Supplies', certification: 'ISO 9001', daysRemaining: 12, status: 'Expiring' },
  { vendor: 'Apex Logistics', certification: 'ISO 14001', daysRemaining: 4, status: 'Expired' },
  { vendor: 'BluePeak Technologies', certification: 'SOC 2', daysRemaining: 31, status: 'Expiring' },
]

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
}

const kpiCards = [
  { title: 'Overall Compliance', value: '94%', icon: <FactCheckRounded />, color: 'success.main' },
  { title: 'Open Violations', value: '3', icon: <AssignmentLateRounded />, color: 'warning.main' },
  { title: 'Missing Documents', value: '3', icon: <FolderOffRounded />, color: 'info.main' },
  { title: 'Certifications at Risk', value: '3', icon: <ShieldRounded />, color: 'error.main' },
]

const CompliancePage = () => (
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
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Issue</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id} hover>
                      <TableCell>{violation.id}</TableCell>
                      <TableCell>{violation.issue}</TableCell>
                      <TableCell>
                        <Chip label={violation.severity} color={severityColors[violation.severity]} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={violation.status} color={statusColors[violation.status]} size="small" />
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
              {missingDocuments.map((document) => (
                <ListItem key={document} divider>
                  <ListItemIcon>
                    <FolderOffRounded color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={document} />
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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Certification</TableCell>
                <TableCell>Days Remaining</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((item) => (
                <TableRow key={`${item.vendor}-${item.certification}`} hover>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.certification}</TableCell>
                  <TableCell>{item.daysRemaining}</TableCell>
                  <TableCell>
                    <Chip label={item.status} color={item.status === 'Expired' ? 'error' : 'warning'} size="small" />
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

export default CompliancePage
