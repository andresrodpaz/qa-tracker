import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/auth/login")
    await page.fill('[data-testid="email-input"]', "admin@qtrack.com")
    await page.fill('[data-testid="password-input"]', "admin123")
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL("/")
  })

  test("should display dashboard stats", async ({ page }) => {
    await expect(page.getByText(/total tickets/i)).toBeVisible()
    await expect(page.getByText(/open tickets/i)).toBeVisible()
    await expect(page.getByText(/overdue/i)).toBeVisible()
    await expect(page.getByText(/resolved today/i)).toBeVisible()
  })

  test("should show recent tickets", async ({ page }) => {
    await expect(page.getByText(/recent tickets/i)).toBeVisible()
    await expect(page.getByText(/authentication system/i)).toBeVisible()
  })

  test("should filter tickets", async ({ page }) => {
    await page.selectOption("select", "open")

    // Should show only open tickets
    const tickets = page.locator('[data-testid="ticket-card"]')
    await expect(tickets).toHaveCount(1)
  })

  test("should search tickets", async ({ page }) => {
    await page.fill('[data-testid="search-input"]', "authentication")
    await page.press('[data-testid="search-input"]', "Enter")

    await expect(page.getByText(/authentication system/i)).toBeVisible()
  })

  test("should display collaboration features", async ({ page }) => {
    await expect(page.getByText(/team presence/i)).toBeVisible()
    await expect(page.getByText(/live activity feed/i)).toBeVisible()
    await expect(page.getByText(/notifications/i)).toBeVisible()
  })

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible()

    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.getByText(/dashboard/i)).toBeVisible()
  })
})
