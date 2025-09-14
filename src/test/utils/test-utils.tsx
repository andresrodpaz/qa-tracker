import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { AuthProvider } from "@/components/auth/auth-provider"

// Mock user for testing
const mockUser = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: "USER" as const,
  permissions: ["tickets.read", "tickets.create"],
  twoFactorEnabled: false,
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

// Test utilities
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key])
    },
  }
}

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
})

export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0))
