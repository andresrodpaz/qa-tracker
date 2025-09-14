"use client"

import { render, screen, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { AuthProvider, useAuth } from "@/components/auth/auth-provider"

// Test component to access auth context
const TestComponent = () => {
  const { user, login, logout, isLoading } = useAuth()

  return (
    <div>
      <div data-testid="user-email">{user?.email || "No user"}</div>
      <div data-testid="loading">{isLoading ? "Loading" : "Not loading"}</div>
      <button data-testid="login-btn" onClick={() => login("test@example.com", "password")}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should provide initial auth state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId("user-email")).toHaveTextContent("No user")
    expect(screen.getByTestId("loading")).toHaveTextContent("Not loading")
  })

  it("should handle successful login", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByTestId("login-btn").click()
    })

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com")
    })
  })

  it("should handle logout", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Login first
    await act(async () => {
      screen.getByTestId("login-btn").click()
    })

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com")
    })

    // Then logout
    await act(async () => {
      screen.getByTestId("logout-btn").click()
    })

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user")
    })
  })

  it("should persist user session in localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByTestId("login-btn").click()
    })

    await waitFor(() => {
      const storedUser = localStorage.getItem("qtrack_user")
      expect(storedUser).toBeTruthy()
      const user = JSON.parse(storedUser!)
      expect(user.email).toBe("test@example.com")
    })
  })
})
