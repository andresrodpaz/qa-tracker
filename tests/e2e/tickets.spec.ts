import { test, expect } from "@playwright/test"

test.describe("Ticket Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.goto("/tickets")
  })

  test("should display tickets list", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Tickets")

    // Check table headers
    await expect(page.locator("text=Title")).toBeVisible()
    await expect(page.locator("text=Status")).toBeVisible()
    await expect(page.locator("text=Priority")).toBeVisible()
    await expect(page.locator("text=Assignee")).toBeVisible()

    // Check that tickets are displayed
    await expect(page.locator('[data-testid="ticket-row"]')).toHaveCount({ min: 1 })
  })

  test("should create new ticket", async ({ page }) => {
    // Click create ticket button
    await page.click('[data-testid="create-ticket-btn"]')

    // Fill ticket form
    await page.fill('input[name="title"]', "Test Ticket from E2E")
    await page.fill('textarea[name="description"]', "This is a test ticket created by Playwright")
    await page.selectOption('select[name="priority"]', "medium")
    await page.selectOption('select[name="category"]', "bug")

    // Add tags
    await page.fill('input[name="tags"]', "e2e-test,automation")

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect back to tickets list
    await expect(page).toHaveURL("/tickets")

    // Check that new ticket appears
    await expect(page.locator("text=Test Ticket from E2E")).toBeVisible()
  })

  test("should edit existing ticket", async ({ page }) => {
    // Click on first ticket
    await page.click('[data-testid="ticket-row"]:first-child [data-testid="ticket-title"]')

    // Should navigate to ticket detail
    await expect(page).toHaveURL(/\/tickets\/ticket-/)

    // Click edit button
    await page.click('[data-testid="edit-ticket-btn"]')

    // Update title
    await page.fill('input[name="title"]', "Updated Ticket Title")

    // Change status
    await page.selectOption('select[name="status"]', "in-progress")

    // Save changes
    await page.click('button[type="submit"]')

    // Check updated title is displayed
    await expect(page.locator("h1")).toContainText("Updated Ticket Title")
    await expect(page.locator('[data-testid="ticket-status"]')).toContainText("In Progress")
  })

  test("should add comment to ticket", async ({ page }) => {
    // Navigate to first ticket
    await page.click('[data-testid="ticket-row"]:first-child [data-testid="ticket-title"]')

    // Scroll to comments section
    await page.locator('[data-testid="comments-section"]').scrollIntoViewIfNeeded()

    // Add comment
    await page.fill('[data-testid="comment-input"]', "This is a test comment from Playwright")
    await page.click('[data-testid="add-comment-btn"]')

    // Check comment appears
    await expect(page.locator("text=This is a test comment from Playwright")).toBeVisible()
  })

  test("should filter tickets by priority", async ({ page }) => {
    // Filter by high priority
    await page.click('[data-testid="priority-filter"]')
    await page.click("text=High")

    // Check URL contains filter
    await expect(page).toHaveURL(/priority=high/)

    // Check filtered results
    const ticketRows = page.locator('[data-testid="ticket-row"]')
    const count = await ticketRows.count()

    if (count > 0) {
      await expect(ticketRows.first().locator('[data-testid="ticket-priority"]')).toContainText("High")
    }
  })

  test("should assign ticket to user", async ({ page }) => {
    // Navigate to first ticket
    await page.click('[data-testid="ticket-row"]:first-child [data-testid="ticket-title"]')

    // Click assign button
    await page.click('[data-testid="assign-ticket-btn"]')

    // Select assignee
    await page.selectOption('[data-testid="assignee-select"]', { label: "QA Agent 1" })

    // Save assignment
    await page.click('[data-testid="save-assignment-btn"]')

    // Check assignee is displayed
    await expect(page.locator('[data-testid="ticket-assignee"]')).toContainText("QA Agent 1")
  })
})
