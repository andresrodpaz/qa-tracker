import { test, expect } from "@playwright/test"

test.describe("Test Suite Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as QA manager
    await page.goto("/login")
    await page.fill('input[type="email"]', "manager@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.goto("/test-suites")
  })

  test("should display test suites list", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Test Suites")

    // Check suite cards are displayed
    await expect(page.locator('[data-testid="test-suite-card"]')).toHaveCount({ min: 1 })

    // Check suite information
    await expect(page.locator("text=Authentication Suite")).toBeVisible()
    await expect(page.locator("text=Performance Suite")).toBeVisible()
  })

  test("should create new test suite", async ({ page }) => {
    await page.click('[data-testid="create-suite-btn"]')

    // Fill suite form
    await page.fill('input[name="name"]', "E2E Test Suite")
    await page.fill('textarea[name="description"]', "Test suite created by Playwright")

    // Select test cases
    await page.check('[data-testid="test-case-checkbox"]:first-child')
    await page.check('[data-testid="test-case-checkbox"]:nth-child(2)')

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to test suites list
    await expect(page).toHaveURL("/test-suites")
    await expect(page.locator("text=E2E Test Suite")).toBeVisible()
  })

  test("should execute test suite", async ({ page }) => {
    // Click on first test suite
    await page.click('[data-testid="test-suite-card"]:first-child [data-testid="suite-title"]')

    // Click execute suite button
    await page.click('[data-testid="execute-suite-btn"]')

    // Execute individual test cases
    const testCaseRows = page.locator('[data-testid="suite-test-case"]')
    const count = await testCaseRows.count()

    for (let i = 0; i < count; i++) {
      const row = testCaseRows.nth(i)
      await row.locator('[data-testid="test-result-select"]').selectOption("passed")
      await row.locator('[data-testid="actual-result-input"]').fill(`Test case ${i + 1} passed`)
    }

    // Submit execution results
    await page.click('[data-testid="submit-execution-btn"]')

    // Check execution results
    await expect(page.locator('[data-testid="suite-pass-rate"]')).toContainText("100%")
    await expect(page.locator('[data-testid="last-executed"]')).toBeVisible()
  })

  test("should view test suite details", async ({ page }) => {
    // Click on test suite
    await page.click('[data-testid="test-suite-card"]:first-child [data-testid="suite-title"]')

    // Check suite details are displayed
    await expect(page.locator('[data-testid="suite-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="suite-test-cases"]')).toBeVisible()
    await expect(page.locator('[data-testid="suite-statistics"]')).toBeVisible()

    // Check test cases in suite
    await expect(page.locator('[data-testid="suite-test-case"]')).toHaveCount({ min: 1 })
  })

  test("should show execution history", async ({ page }) => {
    // Navigate to suite detail
    await page.click('[data-testid="test-suite-card"]:first-child [data-testid="suite-title"]')

    // Click execution history tab
    await page.click('[data-testid="execution-history-tab"]')

    // Check history is displayed
    await expect(page.locator('[data-testid="execution-history"]')).toBeVisible()

    // Check history entries
    const historyEntries = page.locator('[data-testid="history-entry"]')
    if ((await historyEntries.count()) > 0) {
      await expect(historyEntries.first()).toContainText("Executed")
    }
  })
})
