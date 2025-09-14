import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/test-suites/route"
import { POST as executeTestSuite } from "@/app/api/test-suites/[id]/execute/route"
import jest from "jest" // Declare the jest variable

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/test-suites", () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/test-suites", () => {
    it("should return test suites with calculated pass rates", async () => {
      const mockTestSuites = [
        {
          id: "suite-1",
          name: "Authentication Suite",
          testCases: ["test-1", "test-2"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      const mockTestCases = [
        {
          id: "test-1",
          status: "passed",
          executedAt: new Date().toISOString(),
        },
        {
          id: "test-2",
          status: "failed",
          executedAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_test_suites") return JSON.stringify(mockTestSuites)
        if (key === "qtrack_test_cases") return JSON.stringify(mockTestCases)
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/test-suites")
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testSuites).toHaveLength(1)
      expect(data.testSuites[0].passRate).toBe(50) // 1 passed out of 2 executed
      expect(data.testSuites[0].totalTestCases).toBe(2)
      expect(data.testSuites[0].executedTestCases).toBe(2)
      expect(data.testSuites[0].passedTestCases).toBe(1)
    })

    it("should handle empty test suites", async () => {
      const request = new NextRequest("http://localhost:3000/api/test-suites")
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.testSuites).toEqual([])
    })
  })

  describe("POST /api/test-suites", () => {
    it("should create a new test suite successfully", async () => {
      const testSuiteData = {
        name: "New Test Suite",
        description: "Test suite description",
        testCases: ["test-1", "test-2"],
        createdBy: "user-1",
      }

      const request = new NextRequest("http://localhost:3000/api/test-suites", {
        method: "POST",
        body: JSON.stringify(testSuiteData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.testSuite).toBeDefined()
      expect(data.testSuite.name).toBe(testSuiteData.name)
      expect(data.testSuite.status).toBe("draft")
      expect(data.testSuite.testCases).toEqual(testSuiteData.testCases)
    })

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        name: "Incomplete Suite",
        // Missing required fields
      }

      const request = new NextRequest("http://localhost:3000/api/test-suites", {
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

  describe("POST /api/test-suites/[id]/execute", () => {
    it("should execute test suite and calculate pass rate", async () => {
      const mockTestSuite = {
        id: "suite-1",
        name: "Test Suite",
        testCases: ["test-1", "test-2", "test-3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockTestCases = [
        { id: "test-1", status: "pending" },
        { id: "test-2", status: "pending" },
        { id: "test-3", status: "pending" },
      ]

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_test_suites") return JSON.stringify([mockTestSuite])
        if (key === "qtrack_test_cases") return JSON.stringify(mockTestCases)
        return "[]"
      })

      const executionData = {
        userId: "user-1",
        testResults: {
          "test-1": { status: "passed", actualResult: "Test 1 passed" },
          "test-2": { status: "passed", actualResult: "Test 2 passed" },
          "test-3": { status: "failed", actualResult: "Test 3 failed" },
        },
      }

      const request = new NextRequest("http://localhost:3000/api/test-suites/suite-1/execute", {
        method: "POST",
        body: JSON.stringify(executionData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await executeTestSuite(request, { params: { id: "suite-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.executionResults.totalTests).toBe(3)
      expect(data.executionResults.executedTests).toBe(3)
      expect(data.executionResults.passedTests).toBe(2)
      expect(data.executionResults.failedTests).toBe(1)
      expect(data.executionResults.passRate).toBe(66.67)
    })

    it("should return 404 for non-existent test suite", async () => {
      localStorageMock.getItem.mockReturnValue("[]")

      const executionData = {
        userId: "user-1",
        testResults: {},
      }

      const request = new NextRequest("http://localhost:3000/api/test-suites/non-existent/execute", {
        method: "POST",
        body: JSON.stringify(executionData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await executeTestSuite(request, { params: { id: "non-existent" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Test suite not found")
    })
  })
})
