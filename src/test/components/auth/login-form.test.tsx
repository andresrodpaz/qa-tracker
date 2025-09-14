import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@/src/test/utils/test-utils"
import { LoginForm } from "@/components/auth/login-form"
import userEvent from "@testing-library/user-event"

describe("LoginForm", () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("renders login form with all required fields", () => {
    render(<LoginForm onSuccess={mockOnSuccess} />)

    expect(screen.getByRole("heading", { name: /welcome to qtrack/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("shows demo credentials alert", () => {
    render(<LoginForm onSuccess={mockOnSuccess} />)

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument()
    expect(screen.getByText(/admin@qtrack.com/i)).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    await user.click(submitButton)

    expect(screen.getByLabelText(/email address/i)).toBeInvalid()
    expect(screen.getByLabelText(/password/i)).toBeInvalid()
  })

  it("toggles password visibility", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole("button", { name: "" }) // Eye icon button

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("handles successful login with valid credentials", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    await user.type(screen.getByLabelText(/email address/i), "admin@qtrack.com")
    await user.type(screen.getByLabelText(/password/i), "admin123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(mockOnSuccess).toHaveBeenCalled()
      },
      { timeout: 2000 },
    )
  })

  it("shows error message for invalid credentials", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    await user.type(screen.getByLabelText(/email address/i), "wrong@email.com")
    await user.type(screen.getByLabelText(/password/i), "wrongpassword")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(
      () => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it("implements rate limiting after multiple failed attempts", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    // Simulate 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await user.clear(screen.getByLabelText(/email address/i))
      await user.clear(screen.getByLabelText(/password/i))
      await user.type(screen.getByLabelText(/email address/i), "wrong@email.com")
      await user.type(screen.getByLabelText(/password/i), "wrongpassword")
      await user.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(
        () => {
          expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    }

    await waitFor(
      () => {
        expect(screen.getByText(/account temporarily locked/i)).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
  })

  it("handles remember me checkbox", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)

    const rememberCheckbox = screen.getByLabelText(/remember me/i)
    expect(rememberCheckbox).not.toBeChecked()

    await user.click(rememberCheckbox)
    expect(rememberCheckbox).toBeChecked()
  })

  it("has accessible form labels and structure", () => {
    render(<LoginForm onSuccess={mockOnSuccess} />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("form")).toBeInTheDocument()
  })
})
