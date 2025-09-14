import { type NextRequest, NextResponse } from "next/server"
import { TestCaseService } from "@/lib/services/test-case.service"
import { TestCaseRepository } from "@/lib/repositories/test-case.repository"
import { ActivityLogRepository } from "@/lib/repositories/activity-log.repository"
import { ValidationError } from "@/lib/errors/custom-errors"
import { ErrorHandler } from "@/lib/utils/error-handler"

export class TestCaseController {
  private testCaseService: TestCaseService

  constructor() {
    const testCaseRepository = new TestCaseRepository()
    const activityLogRepository = new ActivityLogRepository()
    this.testCaseService = new TestCaseService(testCaseRepository, activityLogRepository)
  }

  async getTestCases(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const filters = {
        status: searchParams.get("status") || undefined,
        assignedTo: searchParams.get("assignedTo") || undefined,
        priority: searchParams.get("priority") || undefined,
        linkedTicket: searchParams.get("linkedTicket") || undefined,
      }

      const result = await this.testCaseService.getAllTestCases(filters)
      return NextResponse.json(result)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async getTestCase(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const testCase = await this.testCaseService.getTestCaseById(params.id)
      return NextResponse.json({ testCase })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async createTestCase(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { createdBy, ...testCaseData } = body

      if (!createdBy) {
        throw new ValidationError("createdBy is required")
      }

      const testCase = await this.testCaseService.createTestCase(testCaseData, createdBy)
      return NextResponse.json({ testCase }, { status: 201 })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async updateTestCase(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { updatedBy, ...updateData } = body

      if (!updatedBy) {
        throw new ValidationError("updatedBy is required")
      }

      const testCase = await this.testCaseService.updateTestCase(params.id, updateData, updatedBy)
      return NextResponse.json({ testCase })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async executeTestCase(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { actualResult, status, executedBy } = body

      if (!actualResult || !status || !executedBy) {
        throw new ValidationError("actualResult, status, and executedBy are required")
      }

      const testCase = await this.testCaseService.executeTestCase(params.id, actualResult, status, executedBy)
      return NextResponse.json({ testCase })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
