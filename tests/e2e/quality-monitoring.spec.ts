import { test, expect } from "@playwright/test"

test.describe("Quality Monitoring", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill('[data-testid="email"]', "admin@qtrack.com")
    await page.fill('[data-testid="password"]', "admin123")
    await page.click('[data-testid="login-button"]')
    await page.waitForURL("/dashboard")
  })

  test("should display quality dashboard", async ({ page }) => {
    await page.goto("/quality")

    await expect(page.locator('[data-testid="quality-dashboard"]')).toBeVisible()
    await expect(page.locator('[data-testid="quality-score"]')).toBeVisible()
    await expect(page.locator('[data-testid="quality-gates"]')).toBeVisible()
  })

  test("should show quality gate status", async ({ page }) => {
    await page.goto("/quality")

    const gateStatus = page.locator('[data-testid="gate-status"]')
    await expect(gateStatus).toBeVisible()

    // Should show either PASSED, FAILED, or PENDING
    const statusText = await gateStatus.textContent()
    expect(["PASSED", "FAILED", "PENDING"]).toContain(statusText)
  })

  test("should display quality metrics", async ({ page }) => {
    await page.goto("/quality")

    await expect(page.locator('[data-testid="test-coverage"]')).toBeVisible()
    await expect(page.locator('[data-testid="bug-density"]')).toBeVisible()
    await expect(page.locator('[data-testid="resolution-time"]')).toBeVisible()
  })

  test("should allow quality gate configuration", async ({ page }) => {
    await page.goto("/quality/settings")

    // Update test coverage threshold
    await page.fill('[data-testid="coverage-threshold"]', "85")
    await page.click('[data-testid="save-settings"]')

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test("should export quality reports", async ({ page }) => {
    await page.goto("/quality")

    const downloadPromise = page.waitForEvent("download")
    await page.click('[data-testid="export-report"]')
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain("quality-report")
  })
})
