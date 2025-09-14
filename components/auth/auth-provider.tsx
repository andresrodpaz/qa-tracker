"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "MANAGER" | "QA" | "DEV" | "USER"
  avatar?: string
  permissions: string[]
  twoFactorEnabled: boolean
  department?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("qtrack_auth")
    const userData = localStorage.getItem("qtrack_user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({
          ...parsedUser,
          permissions: getPermissionsForRole(parsedUser.role),
          twoFactorEnabled: false,
        })
      } catch (error) {
        localStorage.removeItem("qtrack_auth")
        localStorage.removeItem("qtrack_user")
      }
    }

    setIsLoading(false)
  }, [])

  const getPermissionsForRole = (role: string): string[] => {
    const rolePermissions = {
      ADMIN: [
        "tickets.create",
        "tickets.read",
        "tickets.update",
        "tickets.delete",
        "users.manage",
        "projects.manage",
        "reports.view",
        "settings.manage",
        "test-cases.create",
        "test-cases.read",
        "test-cases.update",
        "test-cases.delete",
        "test-suites.manage",
        "analytics.view",
        "system.admin",
      ],
      MANAGER: [
        "tickets.create",
        "tickets.read",
        "tickets.update",
        "tickets.assign",
        "reports.view",
        "team.manage",
        "test-cases.read",
        "test-cases.assign",
        "test-suites.read",
        "analytics.view",
        "projects.read",
      ],
      QA: [
        "tickets.create",
        "tickets.read",
        "tickets.update",
        "tickets.test",
        "test-cases.create",
        "test-cases.read",
        "test-cases.update",
        "test-cases.execute",
        "test-suites.create",
        "test-suites.read",
        "test-suites.execute",
        "reports.view",
        "comments.create",
      ],
      DEV: ["tickets.read", "tickets.update", "tickets.resolve", "comments.create", "test-cases.read", "projects.read"],
      USER: ["tickets.create", "tickets.read", "comments.create", "reports.view"],
    }

    return rolePermissions[role as keyof typeof rolePermissions] || []
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        name: "John Doe",
        role: "ADMIN",
        permissions: getPermissionsForRole("ADMIN"),
        twoFactorEnabled: false,
      }

      localStorage.setItem("qtrack_auth", "mock_jwt_token")
      localStorage.setItem("qtrack_user", JSON.stringify(mockUser))
      setUser(mockUser)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("qtrack_auth")
    localStorage.removeItem("qtrack_user")
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("qtrack_user", JSON.stringify(updatedUser))
    }
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
