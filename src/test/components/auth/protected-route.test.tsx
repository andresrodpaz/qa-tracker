import { render, screen } from "@testing-library/react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { type User, UserRole } from "@/lib/database/schema"
import jest from "jest" // Import jest to declare the variable

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: UserRole.QA,
  department: "Engineering",
  avatar: null,
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

// Mock the auth provider
jest.mock("@/components/auth/auth-provider", () => ({
  ...jest.requireActual("@/components/auth/auth-provider"),
  useAuth: jest.fn(),
}))

describe("ProtectedRoute", () => {
  const mockUseAuth = require("@/components/auth/auth-provider").useAuth

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
  })

  it("should redirect to login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
    )

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
  })

  it("should show loading when authentication is in progress", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("should check required role permissions", () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, role: UserRole.USER },
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <TestComponent />
      </ProtectedRoute>,
    )

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
  })

  it("should allow access with correct role", () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, role: UserRole.ADMIN },
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <TestComponent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
  })
})
