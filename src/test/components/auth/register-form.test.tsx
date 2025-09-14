import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@/src/test/utils/test-utils"
import { RegisterForm } from "@/components/auth/register-form"
import userEvent from "@testing-library/user-event"

describe("RegisterForm", () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders registration form with all required fields", () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("validates password strength requirements", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    const passwordInput = screen.getByLabelText(/^password$/i)

    // Test weak password
    await user.type(passwordInput, "weak")
    expect(screen.getByText(/weak/i)).toBeInTheDocument()

    // Test medium password
    await user.clear(passwordInput)
    await user.type(passwordInput, "Medium123")
    expect(screen.getByText(/medium/i)).toBeInTheDocument()

    // Test strong password
    await user.clear(passwordInput)
    await user.type(passwordInput, "Strong123!")
    expect(screen.getByText(/strong/i)).toBeInTheDocument()
  })

  it("shows password requirements checklist", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, "Test123!")

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument()
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument()
    expect(screen.getByText(/one number/i)).toBeInTheDocument()
    expect(screen.getByText(/one special character/i)).toBeInTheDocument()
  })

  it("validates password confirmation match", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    await user.type(screen.getByLabelText(/^password$/i), "Test123!")
    await user.type(screen.getByLabelText(/confirm password/i), "Different123!")

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it("requires terms acceptance", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    // Fill form without accepting terms
    await user.type(screen.getByLabelText(/first name/i), "John")
    await user.type(screen.getByLabelText(/last name/i), "Doe")
    await user.type(screen.getByLabelText(/email address/i), "john@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "Strong123!")
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123!")

    const submitButton = screen.getByRole("button", { name: /create account/i })
    expect(submitButton).toBeDisabled()

    // Accept terms
    await user.click(screen.getByLabelText(/i agree to the terms/i))
    expect(submitButton).not.toBeDisabled()
  })

  it("handles successful registration", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    await user.type(screen.getByLabelText(/first name/i), "John")
    await user.type(screen.getByLabelText(/last name/i), "Doe")
    await user.type(screen.getByLabelText(/email address/i), "john@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "Strong123!")
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123!")
    await user.click(screen.getByLabelText(/i agree to the terms/i))

    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByText(/creating account/i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(mockOnSuccess).toHaveBeenCalled()
      },
      { timeout: 3000 },
    )
  })

  it("shows error for existing email", async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)

    await user.type(screen.getByLabelText(/first name/i), "John")
    await user.type(screen.getByLabelText(/last name/i), "Doe")
    await user.type(screen.getByLabelText(/email address/i), "existing@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "Strong123!")
    await user.type(screen.getByLabelText(/confirm password/i), "Strong123!")
    await user.click(screen.getByLabelText(/i agree to the terms/i))

    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(
      () => {
        expect(screen.getByText(/already registered/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
