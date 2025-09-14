import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage before each test
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
  })

  test("should display login form on initial visit", async ({ page }) => {
    await page.goto("/")

    // Should redirect to login page
    await expect(page).toHaveURL("/login")

    // Check login form elements
    await expect(page.locator("h1")).toContainText("Sign In")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/login")

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check for validation messages
    await expect(page.locator("text=Email is required")).toBeVisible()
    await expect(page.locator("text=Password is required")).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    // Fill invalid credentials
    await page.fill('input[type="email"]', "invalid@example.com")
    await page.fill('input[type="password"]', "wrongpassword")
    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.locator("text=Invalid credentials")).toBeVisible()
  })

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/login")

    // Fill valid credentials
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL("/")
    await expect(page.locator("h1")).toContainText("Dashboard")

    // Check user info is displayed
    await expect(page.locator("text=Admin User")).toBeVisible()
  })

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Wait for dashboard
    await expect(page).toHaveURL("/")

    // Click logout
    await page.click('[data-testid="user-menu"]')
    await page.click("text=Logout")

    // Should redirect to login
    await expect(page).toHaveURL("/login")
  })

  test("should register new user successfully", async ({ page }) => {
    await page.goto("/register")

    // Fill registration form
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "password123")
    await page.selectOption('select[name="role"]', "agent")

    await page.click('button[type="submit"]')

    // Should redirect to dashboard after registration
    await expect(page).toHaveURL("/")
    await expect(page.locator("text=Test User")).toBeVisible()
  })
})
