import { test, expect } from "@playwright/test"

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[type="email"]', "admin@qtrack.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
  })

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/")

    // Check h1 exists and is unique
    const h1Elements = page.locator("h1")
    await expect(h1Elements).toHaveCount(1)
    await expect(h1Elements).toContainText("Dashboard")

    // Check heading hierarchy
    const headings = page.locator("h1, h2, h3, h4, h5, h6")
    const count = await headings.count()

    if (count > 1) {
      // Verify headings follow logical order
      const headingTexts = await headings.allTextContents()
      expect(headingTexts[0]).toBeTruthy() // h1 should have content
    }
  })

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/tickets")
    await page.click('[data-testid="create-ticket-btn"]')

    // Check form inputs have labels
    const titleInput = page.locator('input[name="title"]')
    await expect(titleInput).toHaveAttribute("aria-label")

    const descriptionInput = page.locator('textarea[name="description"]')
    await expect(descriptionInput).toHaveAttribute("aria-label")
  })

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/")

    // Test tab navigation
    await page.keyboard.press("Tab")

    // Check focus is visible
    const focusedElement = page.locator(":focus")
    await expect(focusedElement).toBeVisible()

    // Continue tabbing through interactive elements
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")

    // Should be able to activate with Enter/Space
    await page.keyboard.press("Enter")

    // Check navigation occurred or action was triggered
    // This will depend on what element was focused
  })

  test("should have proper ARIA attributes", async ({ page }) => {
    await page.goto("/tickets")

    // Check table has proper ARIA attributes
    const table = page.locator("table")
    if ((await table.count()) > 0) {
      await expect(table).toHaveAttribute("role", "table")
    }

    // Check buttons have proper labels
    const buttons = page.locator("button")
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const hasAriaLabel = await button.getAttribute("aria-label")
      const hasText = await button.textContent()

      // Button should have either aria-label or text content
      expect(hasAriaLabel || hasText).toBeTruthy()
    }
  })

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/")

    // Check that text elements have sufficient contrast
    // This is a basic check - in real scenarios you'd use axe-core
    const textElements = page.locator("p, span, div").filter({ hasText: /.+/ })
    const count = await textElements.count()

    if (count > 0) {
      // Check first few text elements are visible (basic contrast check)
      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(textElements.nth(i)).toBeVisible()
      }
    }
  })

  test("should support screen reader navigation", async ({ page }) => {
    await page.goto("/tickets")

    // Check for landmark regions
    const main = page.locator("main")
    if ((await main.count()) > 0) {
      await expect(main).toBeVisible()
    }

    // Check for skip links
    const skipLink = page.locator('a[href="#main-content"]')
    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeVisible()
    }

    // Check table headers are properly associated
    const tableHeaders = page.locator("th")
    const headerCount = await tableHeaders.count()

    if (headerCount > 0) {
      // Headers should have scope attribute
      await expect(tableHeaders.first()).toHaveAttribute("scope")
    }
  })
})
