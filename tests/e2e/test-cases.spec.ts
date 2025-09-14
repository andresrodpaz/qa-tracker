import { test, expect } from "@playwright/test"

test.describe("Test Case Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as QA manager
    await page.goto("/login")
    await page.fill('input[type="email"]', "manager@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.goto("/test-cases")
  })

  test("should display test cases list", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Test Cases")

    // Check table headers
    await expect(page.locator("text=Title")).toBeVisible()
    await expect(page.locator("text=Status")).toBeVisible()
    await expect(page.locator("text=Priority")).toBeVisible()

    // Check that test cases are displayed
    await expect(page.locator('[data-testid="test-case-row"]')).toHaveCount({ min: 1 })
  })

  test("should create new test case", async ({ page }) => {
    await page.click('[data-testid="create-test-case-btn"]')

    // Fill test case form
    await page.fill('input[name="title"]', "E2E Test Case")
    await page.fill('textarea[name="description"]', "Test case created by Playwright")

    // Add test steps
    await page.fill('[data-testid="step-input-0"]', "Navigate to login page")
    await page.click('[data-testid="add-step-btn"]')
    await page.fill('[data-testid="step-input-1"]', "Enter valid credentials")
    await page.click('[data-testid="add-step-btn"]')
    await page.fill('[data-testid="step-input-2"]', "Click login button")

    // Set expected result
    await page.fill('textarea[name="expectedResult"]', "User should be logged in successfully")

    // Set priority
    await page.selectOption('select[name="priority"]', "high")

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to test cases list
    await expect(page).toHaveURL("/test-cases")
    await expect(page.locator("text=E2E Test Case")).toBeVisible()
  })

  test("should execute test case", async ({ page }) => {
    // Click on first test case
    await page.click('[data-testid="test-case-row"]:first-child [data-testid="test-case-title"]')

    // Click execute button
    await page.click('[data-testid="execute-test-btn"]')

    // Fill execution results
    await page.fill('[data-testid="actual-result"]', "Test executed successfully")
    await page.selectOption('[data-testid="execution-status"]', "passed")

    // Save execution
    await page.click('[data-testid="save-execution-btn"]')

    // Check status updated
    await expect(page.locator('[data-testid="test-case-status"]')).toContainText("Passed")
    await expect(page.locator('[data-testid="execution-date"]')).toBeVisible()
  })

  test("should link test case to ticket", async ({ page }) => {
    // Navigate to test case detail
    await page.click('[data-testid="test-case-row"]:first-child [data-testid="test-case-title"]')

    // Click link ticket button
    await page.click('[data-testid="link-ticket-btn"]')

    // Select ticket from dropdown
    await page.selectOption('[data-testid="ticket-select"]', { index: 1 })

    // Save link
    await page.click('[data-testid="save-link-btn"]')

    // Check linked ticket appears
    await expect(page.locator('[data-testid="linked-tickets"]')).toContainText("ticket-")
  })

  test("should filter test cases by status", async ({ page }) => {
    // Filter by passed status
    await page.click('[data-testid="status-filter"]')
    await page.click("text=Passed")

    // Check URL contains filter
    await expect(page).toHaveURL(/status=passed/)

    // Check filtered results
    const testCaseRows = page.locator('[data-testid="test-case-row"]')
    const count = await testCaseRows.count()

    if (count > 0) {
      await expect(testCaseRows.first().locator('[data-testid="test-case-status"]')).toContainText("Passed")
    }
  })
})
