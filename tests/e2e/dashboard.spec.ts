import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
  })

  test("should display dashboard overview", async ({ page }) => {
    // Check main dashboard elements
    await expect(page.locator("h1")).toContainText("Dashboard")

    // Check stats cards
    await expect(page.locator('[data-testid="total-tickets"]')).toBeVisible()
    await expect(page.locator('[data-testid="open-tickets"]')).toBeVisible()
    await expect(page.locator('[data-testid="test-cases"]')).toBeVisible()
    await expect(page.locator('[data-testid="pass-rate"]')).toBeVisible()

    // Check recent tickets section
    await expect(page.locator("text=Recent Tickets")).toBeVisible()

    // Check activity feed
    await expect(page.locator("text=Recent Activity")).toBeVisible()
  })

  test("should display correct ticket statistics", async ({ page }) => {
    // Check that statistics are numbers and not zero
    const totalTickets = await page.locator('[data-testid="total-tickets"] .text-2xl').textContent()
    const openTickets = await page.locator('[data-testid="open-tickets"] .text-2xl').textContent()

    expect(Number.parseInt(totalTickets || "0")).toBeGreaterThan(0)
    expect(Number.parseInt(openTickets || "0")).toBeGreaterThanOrEqual(0)
  })

  test("should navigate to tickets page from dashboard", async ({ page }) => {
    await page.click("text=View All Tickets")
    await expect(page).toHaveURL("/tickets")
    await expect(page.locator("h1")).toContainText("Tickets")
  })

  test("should filter tickets by status", async ({ page }) => {
    // Navigate to tickets
    await page.click("text=View All Tickets")

    // Filter by open status
    await page.click('[data-testid="status-filter"]')
    await page.click("text=Open")

    // Check that URL contains filter
    await expect(page).toHaveURL(/status=open/)

    // Check that only open tickets are shown
    const ticketRows = page.locator('[data-testid="ticket-row"]')
    const count = await ticketRows.count()

    if (count > 0) {
      // Check first ticket has open status
      await expect(ticketRows.first().locator('[data-testid="ticket-status"]')).toContainText("Open")
    }
  })

  test("should search tickets", async ({ page }) => {
    await page.click("text=View All Tickets")

    // Search for specific ticket
    await page.fill('[data-testid="search-input"]', "login")
    await page.press('[data-testid="search-input"]', "Enter")

    // Check search results
    await expect(page.locator('[data-testid="ticket-row"]')).toContainText("login", { ignoreCase: true })
  })
})
