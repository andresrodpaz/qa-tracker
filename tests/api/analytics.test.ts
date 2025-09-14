import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/analytics/route"
import jest from "jest"

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/analytics", () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/analytics", () => {
    it("should return analytics with default 7-day period", async () => {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const mockTickets = [
        {
          id: "ticket-1",
          status: "open",
          priority: "high",
          category: "bug",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "ticket-2",
          status: "resolved",
          priority: "medium",
          category: "feature",
          createdAt: sevenDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
          resolvedAt: now.toISOString(),
        },
      ]

      const mockTestCases = [
        {
          id: "test-1",
          status: "passed",
          priority: "high",
          createdAt: now.toISOString(),
          executedAt: now.toISOString(),
        },
        {
          id: "test-2",
          status: "failed",
          priority: "medium",
          createdAt: sevenDaysAgo.toISOString(),
          executedAt: now.toISOString(),
        },
      ]

      const mockUsers = [
        { id: "user-1", role: "admin", isActive: true },
        { id: "user-2", role: "agent", isActive: true },
      ]

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_tickets") return JSON.stringify(mockTickets)
        if (key === "qtrack_test_cases") return JSON.stringify(mockTestCases)
        if (key === "qtrack_users") return JSON.stringify(mockUsers)
        if (key === "qtrack_activity_logs") return "[]"
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/analytics")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.period).toBe("7d")

      // Ticket analytics
      expect(data.tickets.total).toBe(2)
      expect(data.tickets.open).toBe(1)
      expect(data.tickets.resolved).toBe(1)
      expect(data.tickets.byPriority.high).toBe(1)
      expect(data.tickets.byPriority.medium).toBe(1)
      expect(data.tickets.byCategory.bug).toBe(1)
      expect(data.tickets.byCategory.feature).toBe(1)

      // Test case analytics
      expect(data.testCases.total).toBe(2)
      expect(data.testCases.passed).toBe(1)
      expect(data.testCases.failed).toBe(1)

      // User analytics
      expect(data.users.total).toBe(2)
      expect(data.users.active).toBe(2)
      expect(data.users.byRole.admin).toBe(1)
      expect(data.users.byRole.agent).toBe(1)

      // Metrics
      expect(data.metrics.overallPassRate).toBe(50) // 1 passed out of 2 executed
      expect(data.metrics.avgResolutionTimeHours).toBeGreaterThanOrEqual(0)
    })

    it("should filter analytics by 30-day period", async () => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000)

      const mockTickets = [
        {
          id: "ticket-1",
          createdAt: now.toISOString(), // Within 30 days
          updatedAt: now.toISOString(),
        },
        {
          id: "ticket-2",
          createdAt: thirtyDaysAgo.toISOString(), // Exactly 30 days ago
          updatedAt: now.toISOString(),
        },
        {
          id: "ticket-3",
          createdAt: fortyDaysAgo.toISOString(), // Outside 30 days
          updatedAt: now.toISOString(),
        },
      ]

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_tickets") return JSON.stringify(mockTickets)
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/analytics?period=30d")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.period).toBe("30d")
      expect(data.tickets.total).toBe(3) // Total tickets
      expect(data.tickets.recentlyCreated).toBe(2) // Only tickets within 30 days
    })

    it("should calculate correct pass rate", async () => {
      const mockTestCases = [
        { id: "test-1", status: "passed", executedAt: new Date().toISOString() },
        { id: "test-2", status: "passed", executedAt: new Date().toISOString() },
        { id: "test-3", status: "failed", executedAt: new Date().toISOString() },
        { id: "test-4", status: "pending" }, // Not executed
      ]

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_test_cases") return JSON.stringify(mockTestCases)
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/analytics")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.metrics.overallPassRate).toBe(66.67) // 2 passed out of 3 executed
    })

    it("should handle empty data gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/analytics")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tickets.total).toBe(0)
      expect(data.testCases.total).toBe(0)
      expect(data.users.total).toBe(0)
      expect(data.metrics.overallPassRate).toBe(0)
      expect(data.metrics.avgResolutionTimeHours).toBe(0)
    })
  })
})
