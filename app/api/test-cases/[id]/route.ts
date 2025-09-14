import { type NextRequest, NextResponse } from "next/server"
import { TestCaseModel, ActivityLogModel } from "@/lib/database/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testCase = TestCaseModel.getById(params.id)

    if (!testCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 })
    }

    return NextResponse.json({ testCase })
  } catch (error) {
    console.error("[v0] Error fetching test case:", error)
    return NextResponse.json({ error: "Failed to fetch test case" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    const existingTestCase = TestCaseModel.getById(params.id)
    if (!existingTestCase) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 })
    }

    // Handle test execution
    if (updates.status && ["passed", "failed", "blocked"].includes(updates.status)) {
      updates.executedAt = new Date()
    }

    const testCase = TestCaseModel.update(params.id, updates)

    if (!testCase) {
      return NextResponse.json({ error: "Failed to update test case" }, { status: 500 })
    }

    // Log activity for test execution
    if (updates.status && updates.status !== existingTestCase.status) {
      ActivityLogModel.create({
        userId: userId || "system",
        action: "test_case_executed",
        entityType: "ticket",
        entityId: testCase.id,
        details: {
          status: updates.status,
          actualResult: updates.actualResult,
        },
      })
    }

    return NextResponse.json({ testCase })
  } catch (error) {
    console.error("[v0] Error updating test case:", error)
    return NextResponse.json({ error: "Failed to update test case" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const success = TestCaseModel.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Test case not found" }, { status: 404 })
    }

    // Log activity
    if (userId) {
      ActivityLogModel.create({
        userId,
        action: "test_case_deleted",
        entityType: "ticket",
        entityId: params.id,
        details: {},
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting test case:", error)
    return NextResponse.json({ error: "Failed to delete test case" }, { status: 500 })
  }
}
