import { AnalyticsService } from "@/lib/services/analytics.service"
import { type Ticket, type TestCase, TicketStatus, TestCaseStatus } from "@/lib/database/schema"
import { jest } from "@jest/globals"

describe("AnalyticsService", () => {
  let analyticsService: AnalyticsService

  beforeEach(() => {
    analyticsService = new AnalyticsService()
    localStorage.clear()
  })

  const mockTickets: Ticket[] = [
    {
      id: "1",
      title: "Bug 1",
      description: "Description",
      status: TicketStatus.OPEN,
      priority: "HIGH",
      assigneeId: "user1",
      reporterId: "user2",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "2",
      title: "Bug 2",
      description: "Description",
      status: TicketStatus.RESOLVED,
      priority: "MEDIUM",
      assigneeId: "user1",
      reporterId: "user2",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-05"),
    },
  ]

  const mockTestCases: TestCase[] = [
    {
      id: "1",
      title: "Test Case 1",
      description: "Description",
      status: TestCaseStatus.PASSED,
      priority: "HIGH",
      steps: [],
      expectedResult: "Expected",
      actualResult: "Actual",
      assigneeId: "user1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    },
  ]

  describe("getTicketMetrics", () => {
    beforeEach(() => {
      localStorage.setItem("qtrack_tickets", JSON.stringify(mockTickets))
    })

    it("should calculate total tickets correctly", async () => {
      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.total).toBe(2)
    })

    it("should calculate open tickets correctly", async () => {
      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.open).toBe(1)
    })

    it("should calculate resolved tickets correctly", async () => {
      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.resolved).toBe(1)
    })

    it("should calculate resolution rate correctly", async () => {
      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.resolutionRate).toBe(50)
    })

    it("should calculate average resolution time", async () => {
      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.avgResolutionTime).toBe(4) // 4 days difference
    })
  })

  describe("getTestMetrics", () => {
    beforeEach(() => {
      localStorage.setItem("qtrack_test_cases", JSON.stringify(mockTestCases))
    })

    it("should calculate total test cases correctly", async () => {
      const metrics = await analyticsService.getTestMetrics()
      expect(metrics.total).toBe(1)
    })

    it("should calculate passed tests correctly", async () => {
      const metrics = await analyticsService.getTestMetrics()
      expect(metrics.passed).toBe(1)
    })

    it("should calculate pass rate correctly", async () => {
      const metrics = await analyticsService.getTestMetrics()
      expect(metrics.passRate).toBe(100)
    })
  })

  describe("getQualityGateStatus", () => {
    it("should return PASSED when all criteria are met", async () => {
      localStorage.setItem(
        "qtrack_tickets",
        JSON.stringify([
          { ...mockTickets[0], status: TicketStatus.RESOLVED },
          { ...mockTickets[1], status: TicketStatus.RESOLVED },
        ]),
      )
      localStorage.setItem("qtrack_test_cases", JSON.stringify(mockTestCases))

      const status = await analyticsService.getQualityGateStatus()
      expect(status.status).toBe("PASSED")
    })

    it("should return FAILED when criteria are not met", async () => {
      localStorage.setItem("qtrack_tickets", JSON.stringify(mockTickets))
      localStorage.setItem(
        "qtrack_test_cases",
        JSON.stringify([{ ...mockTestCases[0], status: TestCaseStatus.FAILED }]),
      )

      const status = await analyticsService.getQualityGateStatus()
      expect(status.status).toBe("FAILED")
    })
  })

  describe("error handling", () => {
    it("should handle localStorage errors gracefully", async () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("Storage error")
      })

      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.total).toBe(0)
    })

    it("should handle invalid JSON in localStorage", async () => {
      localStorage.setItem("qtrack_tickets", "invalid json")

      const metrics = await analyticsService.getTicketMetrics()
      expect(metrics.total).toBe(0)
    })
  })
})
