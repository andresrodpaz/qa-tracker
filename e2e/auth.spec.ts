import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/auth/login")

    await expect(page.getByRole("heading", { name: /welcome to qtrack/i })).toBeVisible()

    await page.fill('[data-testid="email-input"]', "admin@qtrack.com")
    await page.fill('[data-testid="password-input"]', "admin123")
    await page.click('[data-testid="login-button"]')

    await expect(page).toHaveURL("/")
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/login")

    await page.fill('[data-testid="email-input"]', "wrong@email.com")
    await page.fill('[data-testid="password-input"]', "wrongpassword")
    await page.click('[data-testid="login-button"]')

    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test("should register new user", async ({ page }) => {
    await page.goto("/auth/register")

    await page.fill('[data-testid="first-name"]', "John")
    await page.fill('[data-testid="last-name"]', "Doe")
    await page.fill('[data-testid="email"]', "john@example.com")
    await page.fill('[data-testid="password"]', "Strong123!")
    await page.fill('[data-testid="confirm-password"]', "Strong123!")
    await page.check('[data-testid="accept-terms"]')

    await page.click('[data-testid="register-button"]')

    await expect(page).toHaveURL("/auth/login")
  })

  test("should validate password strength", async ({ page }) => {
    await page.goto("/auth/register")

    await page.fill('[data-testid="password"]', "weak")
    await expect(page.getByText(/weak/i)).toBeVisible()

    await page.fill('[data-testid="password"]', "Strong123!")
    await expect(page.getByText(/strong/i)).toBeVisible()
  })

  test("should protect routes when not authenticated", async ({ page }) => {
    await page.goto("/")

    // Should redirect to login
    await expect(page).toHaveURL("/auth/login")
  })
})
