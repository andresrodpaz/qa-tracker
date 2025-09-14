import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Accessibility", () => {
  test("should not have accessibility violations on login page", async ({ page }) => {
    await page.goto("/auth/login")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test("should not have accessibility violations on dashboard", async ({ page }) => {
    // Login first
    await page.goto("/auth/login")
    await page.fill('[data-testid="email-input"]', "admin@qtrack.com")
    await page.fill('[data-testid="password-input"]', "admin123")
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL("/")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/auth/login")

    // Tab through form elements
    await page.keyboard.press("Tab")
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.locator('[data-testid="login-button"]')).toBeFocused()
  })

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/auth/login")

    await expect(page.getByRole("textbox", { name: /email address/i })).toBeVisible()
    await expect(page.getByRole("textbox", { name: /password/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })
})
