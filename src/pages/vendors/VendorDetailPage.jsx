import {
  ArrowBackRounded,
  AssignmentRounded,
  ChevronRightRounded,
  ContactMailRounded,
  DescriptionRounded,
  ShieldRounded,
  TimelineRounded,
} from '@mui/icons-material'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link as MuiLink,
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
import { useMemo } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import vendors from '../../mocks/vendors.json'

const VendorDetailPage = () => {
  const { id } = useParams()

  const vendor = useMemo(() => vendors.find((item) => item.id === id), [id])

  if (!vendor) {
    return (
      <Box>
        <Button component={RouterLink} to="/vendors" startIcon={<ArrowBackRounded />} sx={{ mb: 2 }}>
          Back to vendors
        </Button>
        <Typography variant="h5" fontWeight={700}>Vendor not found</Typography>
      </Box>
    )
  }

  const riskLevel = vendor.riskScore < 30 ? 'Low' : vendor.riskScore < 60 ? 'Medium' : 'High'
  const certificationStatus = vendor.certificationStatus || (vendor.riskScore > 55 ? 'Expiring' : vendor.riskScore > 35 ? 'Review Required' : 'Current')
  const history = vendor.history || [
    { title: 'Registered', date: vendor.registeredDate, note: 'Supplier onboarding completed' },
    { title: 'Risk Review', date: '2024-06-01', note: 'Annual governance review scheduled' },
    { title: 'Certification Audit', date: '2024-08-12', note: 'Documents reviewed with procurement team' },
  ]
  const documents = vendor.documents || ['Vendor questionnaire', 'Compliance attestation', 'Insurance certificate']

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator={<ChevronRightRounded fontSize="small" />} aria-label="breadcrumb">
        <MuiLink component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <MuiLink component={RouterLink} to="/vendors" underline="hover" color="inherit">
          Vendors
        </MuiLink>
        <Typography color="text.primary">{vendor.id}</Typography>
      </Breadcrumbs>

      <Button component={RouterLink} to="/vendors" startIcon={<ArrowBackRounded />} sx={{ alignSelf: 'flex-start' }}>
        Back to vendors
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {vendor.name}
            </Typography>
            <Typography color="text.secondary">
              {vendor.id} • {vendor.category}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Chip label={vendor.status} color={vendor.status === 'High Risk' ? 'error' : vendor.status === 'Under Review' ? 'warning' : 'success'} />
            <Chip label={`Risk ${riskLevel}`} variant="outlined" />
            <Chip label={`Cert ${certificationStatus}`} variant="outlined" />
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr 0.8fr' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Basic Details
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Registered Date</Typography>
                <Typography fontWeight={700}>{vendor.registeredDate}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Category</Typography>
                <Typography fontWeight={700}>{vendor.category}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Primary Contact</Typography>
                <Typography fontWeight={700}>{vendor.contacts?.[0]?.name}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography fontWeight={700}>{vendor.contacts?.[0]?.email}</Typography>
              </Paper>
            </Box>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Summary</Typography>
              <Typography sx={{ mt: 1 }}>
                {vendor.summary || `${vendor.name} is a ${vendor.category.toLowerCase()} supplier with ${vendor.certifications?.length || 1} active certifications and a ${riskLevel.toLowerCase()} risk posture.`}
              </Typography>
            </Paper>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Risk Information
          </Typography>
          <Stack alignItems="center" spacing={1}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant="determinate" value={vendor.riskScore} size={96} thickness={6} color={vendor.riskScore > 55 ? 'error' : vendor.riskScore > 35 ? 'warning' : 'success'} />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight={700}>{vendor.riskScore}</Typography>
              </Box>
            </Box>
            <Typography color="text.secondary">Overall risk score</Typography>
            <Typography fontWeight={700}>{riskLevel} risk</Typography>
            <Typography variant="body2" color="text.secondary">
              {vendor.riskSummary || 'Monitoring is active and review cadence remains within policy thresholds.'}
            </Typography>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <ContactMailRounded color="primary" />
            <Typography variant="h6" fontWeight={700}>Contacts</Typography>
          </Stack>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 320 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(vendor.contacts || []).map((contact) => (
                  <TableRow key={contact.name}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <DescriptionRounded color="primary" />
            <Typography variant="h6" fontWeight={700}>Documents</Typography>
          </Stack>
          <Stack spacing={1.5}>
            {documents.map((document) => (
              <Paper key={document} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AssignmentRounded color="primary" />
                  <Typography>{document}</Typography>
                </Stack>
                <Button size="small">View</Button>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TimelineRounded color="primary" />
          <Typography variant="h6" fontWeight={700}>History Timeline</Typography>
        </Stack>
        <Stack spacing={2}>
          {history.map((entry, index) => (
            <Box key={`${entry.title}-${index}`}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <ShieldRounded color="primary" />
                <Box>
                  <Typography fontWeight={700}>{entry.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{entry.date}</Typography>
                  <Typography sx={{ mt: 0.5 }}>{entry.note}</Typography>
                </Box>
              </Stack>
              {index < history.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}

export default VendorDetailPage
