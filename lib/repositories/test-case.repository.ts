import type { IRepository } from "@/lib/interfaces/repositories"
import type { QATestCase } from "@/lib/database/schema"
import { LocalStorageModel } from "@/lib/database/models"

export interface ITestCaseRepository extends IRepository<QATestCase> {
  getByStatus(status: string): QATestCase[]
  getByAssignee(assignedTo: string): QATestCase[]
  getByPriority(priority: string): QATestCase[]
  getByLinkedTicket(ticketId: string): QATestCase[]
  getBySuite(suiteId: string): QATestCase[]
}

export class TestCaseRepository implements ITestCaseRepository {
  private model = new LocalStorageModel<QATestCase>("test_cases")

  getAll(): QATestCase[] {
    return this.model.getAll()
  }

  getById(id: string): QATestCase | null {
    return this.model.getById(id)
  }

  create(data: Omit<QATestCase, "id" | "createdAt" | "updatedAt">): QATestCase {
    return this.model.create(data)
  }

  update(id: string, data: Partial<QATestCase>): QATestCase | null {
    return this.model.update(id, data)
  }

  delete(id: string): boolean {
    return this.model.delete(id)
  }

  getByStatus(status: string): QATestCase[] {
    return this.getAll().filter((testCase) => testCase.status === status)
  }

  getByAssignee(assignedTo: string): QATestCase[] {
    return this.getAll().filter((testCase) => testCase.assignedTo === assignedTo)
  }

  getByPriority(priority: string): QATestCase[] {
    return this.getAll().filter((testCase) => testCase.priority === priority)
  }

  getByLinkedTicket(ticketId: string): QATestCase[] {
    return this.getAll().filter((testCase) => testCase.linkedTickets.includes(ticketId))
  }

  getBySuite(suiteId: string): QATestCase[] {
    // This would need to be implemented based on how test suites link to test cases
    return this.getAll().filter((testCase) => testCase.tags.includes(`suite:${suiteId}`))
  }
}
