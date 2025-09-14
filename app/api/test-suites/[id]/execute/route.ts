import { type NextRequest, NextResponse } from "next/server"
import { TestSuiteModel, TestCaseModel, ActivityLogModel } from "@/lib/database/models"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, testResults = {} } = body

    const testSuite = TestSuiteModel.getById(params.id)
    if (!testSuite) {
      return NextResponse.json({ error: "Test suite not found" }, { status: 404 })
    }

    // Update test case results
    const updatedTestCases = []
    for (const testCaseId of testSuite.testCases) {
      const result = testResults[testCaseId]
      if (result) {
        const updatedTestCase = TestCaseModel.update(testCaseId, {
          status: result.status,
          actualResult: result.actualResult,
          executedAt: new Date(),
        })
        if (updatedTestCase) {
          updatedTestCases.push(updatedTestCase)
        }
      }
    }

    // Calculate pass rate
    const executedCases = updatedTestCases.filter((tc) => tc.executedAt)
    const passedCases = executedCases.filter((tc) => tc.status === "passed")
    const passRate = executedCases.length > 0 ? (passedCases.length / executedCases.length) * 100 : 0

    // Update test suite
    const updatedTestSuite = TestSuiteModel.update(params.id, {
      lastExecuted: new Date(),
      passRate: Math.round(passRate * 100) / 100,
    })

    // Log activity
    if (userId) {
      ActivityLogModel.create({
        userId,
        action: "test_suite_executed",
        entityType: "ticket",
        entityId: params.id,
        details: {
          testCaseCount: testSuite.testCases.length,
          executedCount: executedCases.length,
          passedCount: passedCases.length,
          passRate,
        },
      })
    }

    return NextResponse.json({
      testSuite: updatedTestSuite,
      executionResults: {
        totalTests: testSuite.testCases.length,
        executedTests: executedCases.length,
        passedTests: passedCases.length,
        failedTests: executedCases.length - passedCases.length,
        passRate,
      },
    })
  } catch (error) {
    console.error("[v0] Error executing test suite:", error)
    return NextResponse.json({ error: "Failed to execute test suite" }, { status: 500 })
  }
}
