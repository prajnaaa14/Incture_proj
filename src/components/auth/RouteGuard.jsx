import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const RouteGuard = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (user?.role === 'employee') {
    const allowedEmployeeRoutes = ['/dashboard', '/procurement', '/notifications', '/settings']
    const isAllowed = allowedEmployeeRoutes.some((route) => location.pathname === route || location.pathname.startsWith(`${route}/`))

    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default RouteGuard
