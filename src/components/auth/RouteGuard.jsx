import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

// Removed inline AccessDenied component since we now have a dedicated page

const RouteGuard = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}

export default RouteGuard
