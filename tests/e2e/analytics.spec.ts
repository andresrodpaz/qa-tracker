import { test, expect } from "@playwright/test"

test.describe("Analytics Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.goto("/analytics")
  })

  test("should display analytics overview", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Analytics")

    // Check key metrics cards
    await expect(page.locator('[data-testid="total-tickets-metric"]')).toBeVisible()
    await expect(page.locator('[data-testid="pass-rate-metric"]')).toBeVisible()
    await expect(page.locator('[data-testid="resolution-time-metric"]')).toBeVisible()

    // Check charts are displayed
    await expect(page.locator('[data-testid="tickets-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="test-execution-chart"]')).toBeVisible()
  })

  test("should filter analytics by time period", async ({ page }) => {
    // Change time period to 30 days
    await page.selectOption('[data-testid="period-select"]', "30d")

    // Check URL contains period parameter
    await expect(page).toHaveURL(/period=30d/)

    // Check that metrics update (wait for API call)
    await page.waitForTimeout(1000)

    // Verify metrics are still displayed
    await expect(page.locator('[data-testid="total-tickets-metric"]')).toBeVisible()
  })

  test("should display ticket distribution charts", async ({ page }) => {
    // Check priority distribution chart
    await expect(page.locator('[data-testid="priority-chart"]')).toBeVisible()

    // Check status distribution chart
    await expect(page.locator('[data-testid="status-chart"]')).toBeVisible()

    // Check category distribution chart
    await expect(page.locator('[data-testid="category-chart"]')).toBeVisible()
  })

  test("should show test execution trends", async ({ page }) => {
    // Navigate to test execution section
    await page.click('[data-testid="test-execution-tab"]')

    // Check test execution metrics
    await expect(page.locator('[data-testid="total-test-cases"]')).toBeVisible()
    await expect(page.locator('[data-testid="executed-tests"]')).toBeVisible()
    await expect(page.locator('[data-testid="pass-rate-trend"]')).toBeVisible()

    // Check execution trend chart
    await expect(page.locator('[data-testid="execution-trend-chart"]')).toBeVisible()
  })

  test("should export analytics data", async ({ page }) => {
    // Click export button
    await page.click('[data-testid="export-btn"]')

    // Select export format
    await page.selectOption('[data-testid="export-format"]', "csv")

    // Start download
    const downloadPromise = page.waitForEvent("download")
    await page.click('[data-testid="download-btn"]')
    const download = await downloadPromise

    // Check download started
    expect(download.suggestedFilename()).toContain("analytics")
    expect(download.suggestedFilename()).toContain(".csv")
  })
})
