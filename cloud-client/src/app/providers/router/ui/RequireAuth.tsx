import { getUserAuthData } from '@/entities/User'
import { getRouteLogin } from '@/shared/consts/router'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const auth = useSelector(getUserAuthData)
  const location = useLocation()

  if (!auth) {
    return <Navigate to={getRouteLogin()} state={{ from: location }} />
  }

  return children
}
