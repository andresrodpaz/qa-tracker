import { test, expect } from "@playwright/test"

test.describe("Collaboration Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill('[data-testid="email"]', "qa@qtrack.com")
    await page.fill('[data-testid="password"]', "qa123")
    await page.click('[data-testid="login-button"]')
    await page.waitForURL("/dashboard")
  })

  test("should display live activity feed", async ({ page }) => {
    await page.click('[data-testid="activity-feed-toggle"]')

    await expect(page.locator('[data-testid="activity-feed"]')).toBeVisible()
    await expect(page.locator('[data-testid="activity-item"]').first()).toBeVisible()
  })

  test("should show user presence indicators", async ({ page }) => {
    await page.goto("/tickets/1")

    await expect(page.locator('[data-testid="presence-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="online-users-count"]')).toContainText("1")
  })

  test("should handle real-time comments", async ({ page }) => {
    await page.goto("/tickets/1")

    // Add a comment
    await page.fill('[data-testid="comment-input"]', "Test real-time comment")
    await page.click('[data-testid="add-comment-button"]')

    // Verify comment appears
    await expect(page.locator('[data-testid="comment"]').last()).toContainText("Test real-time comment")
  })

  test("should display live notifications", async ({ page }) => {
    // Trigger a notification
    await page.goto("/tickets/1")
    await page.click('[data-testid="assign-to-me"]')

    // Check notification appears
    await expect(page.locator('[data-testid="notification"]').first()).toBeVisible()
    await expect(page.locator('[data-testid="notification-count"]')).toContainText("1")
  })

  test("should handle notification interactions", async ({ page }) => {
    await page.click('[data-testid="notifications-toggle"]')

    // Mark notification as read
    await page.click('[data-testid="notification"] [data-testid="mark-read"]')

    await expect(page.locator('[data-testid="notification"].read')).toBeVisible()
  })
})
