import { type NextRequest, NextResponse } from "next/server"
import { TestSuiteModel, TestCaseModel, ActivityLogModel } from "@/lib/database/models"

export async function GET() {
  try {
    const testSuites = TestSuiteModel.getAll()

    // Calculate pass rates for each suite
    const suitesWithStats = testSuites.map((suite) => {
      const testCases = suite.testCases.map((id) => TestCaseModel.getById(id)).filter(Boolean)
      const executedCases = testCases.filter((tc) => tc && tc.executedAt)
      const passedCases = executedCases.filter((tc) => tc && tc.status === "passed")

      const passRate = executedCases.length > 0 ? (passedCases.length / executedCases.length) * 100 : 0

      return {
        ...suite,
        passRate: Math.round(passRate * 100) / 100,
        totalTestCases: testCases.length,
        executedTestCases: executedCases.length,
        passedTestCases: passedCases.length,
      }
    })

    return NextResponse.json({ testSuites: suitesWithStats })
  } catch (error) {
    console.error("[v0] Error fetching test suites:", error)
    return NextResponse.json({ error: "Failed to fetch test suites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, testCases = [], createdBy } = body

    // Validation
    if (!name || !description || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const testSuiteData = {
      name,
      description,
      testCases,
      status: "draft" as const,
      createdBy,
    }

    const testSuite = TestSuiteModel.create(testSuiteData)

    // Log activity
    ActivityLogModel.create({
      userId: createdBy,
      action: "test_suite_created",
      entityType: "ticket",
      entityId: testSuite.id,
      details: { name, testCaseCount: testCases.length },
    })

    return NextResponse.json({ testSuite }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating test suite:", error)
    return NextResponse.json({ error: "Failed to create test suite" }, { status: 500 })
  }
}
