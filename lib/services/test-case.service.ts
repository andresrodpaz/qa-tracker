import type { ITestCaseRepository, IActivityLogRepository } from "@/lib/interfaces/repositories"
import type { QATestCase, CreateTestCaseData, UpdateTestCaseData } from "@/lib/database/schema"
import { ValidationError, NotFoundError } from "@/lib/errors/custom-errors"

export class TestCaseService {
  constructor(
    private testCaseRepository: ITestCaseRepository,
    private activityLogRepository: IActivityLogRepository,
  ) {}

  async getAllTestCases(filters?: {
    status?: string
    assignedTo?: string
    priority?: string
    linkedTicket?: string
  }): Promise<{ testCases: QATestCase[]; total: number }> {
    let testCases = this.testCaseRepository.getAll()

    if (filters) {
      if (filters.status) {
        testCases = this.testCaseRepository.getByStatus(filters.status)
      }
      if (filters.assignedTo) {
        testCases = testCases.filter((tc) => tc.assignedTo === filters.assignedTo)
      }
      if (filters.priority) {
        testCases = testCases.filter((tc) => tc.priority === filters.priority)
      }
      if (filters.linkedTicket) {
        testCases = this.testCaseRepository.getByLinkedTicket(filters.linkedTicket)
      }
    }

    // Sort by updatedAt desc
    testCases.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return { testCases, total: testCases.length }
  }

  async getTestCaseById(id: string): Promise<QATestCase> {
    const testCase = this.testCaseRepository.getById(id)
    if (!testCase) {
      throw new NotFoundError(`Test case with id ${id} not found`)
    }
    return testCase
  }

  async createTestCase(data: CreateTestCaseData, createdBy: string): Promise<QATestCase> {
    this.validateTestCaseData(data)

    const testCaseData = {
      ...data,
      status: "pending" as const,
      createdBy,
      tags: data.tags || [],
      linkedTickets: data.linkedTickets || [],
    }

    const testCase = this.testCaseRepository.create(testCaseData)

    // Log activity
    this.activityLogRepository.create({
      userId: createdBy,
      action: "test_case_created",
      entityType: "ticket",
      entityId: testCase.id,
      details: { title: data.title, priority: data.priority, linkedTickets: data.linkedTickets },
    })

    return testCase
  }

  async updateTestCase(id: string, data: UpdateTestCaseData, updatedBy: string): Promise<QATestCase> {
    const existingTestCase = await this.getTestCaseById(id)

    const updatedTestCase = this.testCaseRepository.update(id, data)
    if (!updatedTestCase) {
      throw new NotFoundError(`Failed to update test case with id ${id}`)
    }

    // Log activity for status changes
    if (data.status && data.status !== existingTestCase.status) {
      this.activityLogRepository.create({
        userId: updatedBy,
        action: "test_case_status_changed",
        entityType: "ticket",
        entityId: id,
        details: { from: existingTestCase.status, to: data.status },
      })
    }

    return updatedTestCase
  }

  async executeTestCase(
    id: string,
    actualResult: string,
    status: "passed" | "failed" | "blocked",
    executedBy: string,
  ): Promise<QATestCase> {
    const testCase = await this.getTestCaseById(id)

    const updatedTestCase = this.testCaseRepository.update(id, {
      actualResult,
      status,
      executedAt: new Date(),
    })

    if (!updatedTestCase) {
      throw new NotFoundError(`Failed to execute test case with id ${id}`)
    }

    // Log execution activity
    this.activityLogRepository.create({
      userId: executedBy,
      action: "test_case_executed",
      entityType: "ticket",
      entityId: id,
      details: { status, actualResult: actualResult.substring(0, 100) },
    })

    return updatedTestCase
  }

  private validateTestCaseData(data: CreateTestCaseData): void {
    if (!data.title?.trim()) {
      throw new ValidationError("Title is required")
    }
    if (!data.description?.trim()) {
      throw new ValidationError("Description is required")
    }
    if (!data.steps || data.steps.length === 0) {
      throw new ValidationError("Test steps are required")
    }
    if (!data.expectedResult?.trim()) {
      throw new ValidationError("Expected result is required")
    }
    if (!data.priority) {
      throw new ValidationError("Priority is required")
    }
  }
}
