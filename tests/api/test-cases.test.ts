import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/test-cases/route"
import { PUT } from "@/app/api/test-cases/[id]/route"
import jest from "jest" // Declare the jest variable

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/test-cases", () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/test-cases", () => {
    it("should return empty array when no test cases exist", async () => {
      const request = new NextRequest("http://localhost:3000/api/test-cases")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testCases).toEqual([])
      expect(data.total).toBe(0)
    })

    it("should filter test cases by status", async () => {
      const mockTestCases = [
        {
          id: "test-1",
          title: "Login Test",
          status: "passed",
          priority: "high",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "test-2",
          title: "Logout Test",
          status: "failed",
          priority: "medium",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTestCases))

      const request = new NextRequest("http://localhost:3000/api/test-cases?status=passed")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testCases).toHaveLength(1)
      expect(data.testCases[0].status).toBe("passed")
    })

    it("should filter test cases by linked ticket", async () => {
      const mockTestCases = [
        {
          id: "test-1",
          title: "Test Case 1",
          linkedTickets: ["ticket-1", "ticket-2"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "test-2",
          title: "Test Case 2",
          linkedTickets: ["ticket-3"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTestCases))

      const request = new NextRequest("http://localhost:3000/api/test-cases?linkedTicket=ticket-1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testCases).toHaveLength(1)
      expect(data.testCases[0].linkedTickets).toContain("ticket-1")
    })
  })

  describe("POST /api/test-cases", () => {
    it("should create a new test case successfully", async () => {
      const testCaseData = {
        title: "New Test Case",
        description: "Test case description",
        steps: ["Step 1", "Step 2", "Step 3"],
        expectedResult: "Expected result",
        priority: "high",
        createdBy: "user-1",
        tags: ["automation"],
        linkedTickets: ["ticket-1"],
      }

      const request = new NextRequest("http://localhost:3000/api/test-cases", {
        method: "POST",
        body: JSON.stringify(testCaseData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.testCase).toBeDefined()
      expect(data.testCase.title).toBe(testCaseData.title)
      expect(data.testCase.status).toBe("pending")
      expect(data.testCase.steps).toEqual(testCaseData.steps)
    })

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        title: "Incomplete Test Case",
        // Missing required fields
      }

      const request = new NextRequest("http://localhost:3000/api/test-cases", {
        method: "POST",
        body: JSON.stringify(incompleteData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing required fields")
    })
  })

  describe("PUT /api/test-cases/[id]", () => {
    it("should execute test case and set executedAt", async () => {
      const existingTestCase = {
        id: "test-1",
        title: "Test Case",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingTestCase]))

      const updateData = {
        status: "passed",
        actualResult: "Test passed successfully",
        userId: "user-1",
      }

      const request = new NextRequest("http://localhost:3000/api/test-cases/test-1", {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await PUT(request, { params: { id: "test-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testCase.status).toBe("passed")
      expect(data.testCase.actualResult).toBe("Test passed successfully")
      expect(data.testCase.executedAt).toBeDefined()
    })

    it("should return 404 for non-existent test case", async () => {
      localStorageMock.getItem.mockReturnValue("[]")

      const updateData = { status: "passed" }

      const request = new NextRequest("http://localhost:3000/api/test-cases/non-existent", {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await PUT(request, { params: { id: "non-existent" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Test case not found")
    })
  })
})
