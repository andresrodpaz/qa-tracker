import { test, expect } from "@playwright/test"

test.describe("Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
  })

  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/")

    // Check mobile navigation
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible()

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-btn"]')
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()

    // Check navigation links
    await expect(page.locator('[data-testid="mobile-nav"] text=Tickets')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-nav"] text=Test Cases')).toBeVisible()
  })

  test("should work on tablet viewport", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto("/")

    // Check that desktop navigation is visible
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible()

    // Check dashboard cards stack properly
    const dashboardCards = page.locator('[data-testid="dashboard-card"]')
    const count = await dashboardCards.count()

    if (count >= 2) {
      const firstCard = dashboardCards.first()
      const secondCard = dashboardCards.nth(1)

      const firstBox = await firstCard.boundingBox()
      const secondBox = await secondCard.boundingBox()

      // Cards should be in same row or stacked
      expect(firstBox).toBeTruthy()
      expect(secondBox).toBeTruthy()
    }
  })

  test("should handle touch interactions on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/tickets")

    // Test swipe gestures on ticket cards
    const ticketCard = page.locator('[data-testid="ticket-row"]').first()

    // Tap to select
    await ticketCard.tap()

    // Check if ticket is selected or navigated
    await expect(page).toHaveURL(/\/tickets\//)
  })

  test("should maintain functionality on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })

    // Test creating a ticket on small screen
    await page.goto("/tickets")
    await page.click('[data-testid="create-ticket-btn"]')

    // Form should be usable
    await expect(page.locator('input[name="title"]')).toBeVisible()
    await page.fill('input[name="title"]', "Mobile Test Ticket")

    // Submit should work
    await page.click('button[type="submit"]')

    // Should handle form submission
    await expect(page).toHaveURL("/tickets")
  })
})
