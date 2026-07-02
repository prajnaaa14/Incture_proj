import {
  AssignmentTurnedInRounded,
  Brightness4Rounded,
  Brightness7Rounded,
  ChevronRight,
  DashboardRounded,
  FactCheckRounded,
  GppGoodRounded,
  Inventory2Rounded,
  LogoutRounded,
  ManageAccountsRounded,
  MenuOpenRounded,
  NotificationsRounded,
  ReportRounded,
  SecurityRounded,
  SettingsRounded,
} from '@mui/icons-material'
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { useThemeMode } from '../../theme/ThemeModeContext'
import GlobalSearch from './GlobalSearch'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRounded /> },
  { label: 'Procurement', path: '/procurement', icon: <Inventory2Rounded /> },
  { label: 'Vendors', path: '/vendors', icon: <ManageAccountsRounded /> },
  { label: 'Risk', path: '/risk', icon: <SecurityRounded /> },
  { label: 'Compliance', path: '/compliance', icon: <GppGoodRounded /> },
  { label: 'Audit', path: '/audit', icon: <FactCheckRounded /> },
  { label: 'Approvals', path: '/approvals', icon: <AssignmentTurnedInRounded /> },
  { label: 'Notifications', path: '/notifications', icon: <NotificationsRounded /> },
  { label: 'Reports', path: '/reports', icon: <ReportRounded /> },
  { label: 'Settings', path: '/settings', icon: <SettingsRounded /> },
]

const drawerWidth = 260
const collapsedWidth = 74
const appBarHeight = 64

const MainLayout = ({ children, actionSlot }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(true)
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { mode, toggleMode } = useThemeMode()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const user = useSelector((state) => state.auth.user)
  const globalLoading = useSelector((state) => state.ui.globalLoading)
  const role = user?.role
  const unreadNotificationCount = useSelector((state) => (state.notification?.items || []).filter((item) => !(item.read ?? item.isRead)).length)
  const sidebarWidth = collapsed ? collapsedWidth : drawerWidth
  const effectiveSidebarWidth = isMobile ? (mobileOpen ? drawerWidth : 0) : sidebarWidth

  const visibleNavItems = navItems.filter((item) => {
    const pathKey = item.path.replace('/', '')
    if (role === 'employee') {
      return ['dashboard', 'procurement', 'risk', 'compliance', 'notifications', 'settings'].includes(pathKey)
    }
    if (role === 'manager') {
      return ['dashboard', 'approvals', 'vendors', 'procurement', 'risk', 'compliance', 'notifications', 'reports', 'settings'].includes(pathKey)
    }
    if (role === 'auditor') {
      return ['dashboard', 'audit', 'risk', 'compliance', 'reports', 'settings'].includes(pathKey)
    }
    return true
  })

  const isActiveRoute = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  const handleLogout = () => {
    dispatch(logout())
    setConfirmLogoutOpen(false)
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ height: '100%', pt: 1 }}>
      <Toolbar />
      <List sx={{ px: 1 }}>
        {visibleNavItems.map((item) => {
          const active = isActiveRoute(item.path)
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={active}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  py: 1.2,
                  px: 1.5,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'inherit' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                {!collapsed || isMobile ? <ListItemText primary={item.label} /> : null}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton edge="start" color="inherit" onClick={() => (isMobile ? setMobileOpen((value) => !value) : setCollapsed((value) => !value))} aria-label="toggle sidebar">
            {isMobile ? <MenuOpenRounded /> : collapsed ? <ChevronRight /> : <MenuOpenRounded />}
          </IconButton>
          {isMobile ? (
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
              Menu
            </Typography>
          ) : null}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Enterprise Console
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SAP-inspired operations workspace
            </Typography>
          </Box>
          
          <GlobalSearch />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={toggleMode} aria-label="toggle color mode">
              {mode === 'dark' ? <Brightness7Rounded /> : <Brightness4Rounded />}
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/notifications')} aria-label="notifications">
              <Badge badgeContent={unreadNotificationCount} color="error">
                <NotificationsRounded />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/settings')} aria-label="profile">
              <ManageAccountsRounded />
            </IconButton>
            {actionSlot}
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutRounded />}
              onClick={() => setConfirmLogoutOpen(true)}
              sx={{ ml: 0.5 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Drawer
          variant={isMobile ? 'persistent' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: effectiveSidebarWidth,
            flexShrink: 0,
            transition: 'width 0.2s ease-in-out',
            '& .MuiDrawer-paper': {
              width: effectiveSidebarWidth,
              boxSizing: 'border-box',
              transition: 'width 0.2s ease-in-out',
              overflowX: 'hidden',
              paddingTop: 1,
              top: isMobile ? 0 : appBarHeight,
              height: isMobile ? '100%' : `calc(100% - ${appBarHeight}px)`,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: isMobile ? (mobileOpen ? `${drawerWidth}px` : 0) : `${sidebarWidth}px` }}>
          {globalLoading ? <LinearProgress color="primary" sx={{ width: '100%' }} /> : null}
          <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
            {children || <Outlet />}
          </Container>

          <Box
            component="footer"
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              px: { xs: 2, md: 3 },
              py: 2.2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2026 Enterprise Console. Prepared for modern analytics and CRM workflows.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be returned to the sign-in screen and your current session will end.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MainLayout
