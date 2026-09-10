import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from '../Spinner'
import styles from './ProtectedRoute.module.css'

export interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner size="lg" />
      </div>
    )
  }
  if (!user) return fallback || <Navigate to="/login" replace />
  return <>{children}</>
}