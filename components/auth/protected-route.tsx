"use client"

import { useAuth } from "./auth-provider"
import { LoginForm } from "./login-form"
import type { ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallback?: ReactNode
}

export function ProtectedRoute({ children, requiredPermission, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasPermission, hasRole } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || <LoginForm />
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-50 border-red-200">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Access Denied</strong>
            <br />
            You don't have the required role ({requiredRole}) to access this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Insufficient Permissions</strong>
            <br />
            You don't have permission ({requiredPermission}) to access this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
