import type { User, Ticket, Comment, Project, ActivityLog, QATestCase, TestSuite } from "./schema"

// Local storage keys
const STORAGE_KEYS = {
  USERS: "qtrack_users",
  TICKETS: "qtrack_tickets",
  COMMENTS: "qtrack_comments",
  PROJECTS: "qtrack_projects",
  ACTIVITY_LOGS: "qtrack_activity_logs",
  TEST_CASES: "qtrack_test_cases",
  TEST_SUITES: "qtrack_test_suites",
} as const

// Generic storage utilities
class LocalStorageModel<T extends { id: string }> {
  constructor(private storageKey: string) {}

  getAll(): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  getById(id: string): T | null {
    const items = this.getAll()
    return items.find((item) => item.id === id) || null
  }

  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T

    const items = this.getAll()
    items.push(newItem)
    this.saveAll(items)
    return newItem
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll()
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) return null

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date(),
    }

    this.saveAll(items)
    return items[index]
  }

  delete(id: string): boolean {
    const items = this.getAll()
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) return false

    this.saveAll(filteredItems)
    return true
  }

  private saveAll(items: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  query(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate)
  }
}

// Model instances
export const UserModel = new LocalStorageModel<User>(STORAGE_KEYS.USERS)
export const TicketModel = new LocalStorageModel<Ticket>(STORAGE_KEYS.TICKETS)
export const CommentModel = new LocalStorageModel<Comment>(STORAGE_KEYS.COMMENTS)
export const ProjectModel = new LocalStorageModel<Project>(STORAGE_KEYS.PROJECTS)
export const ActivityLogModel = new LocalStorageModel<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS)
export const TestCaseModel = new LocalStorageModel<QATestCase>(STORAGE_KEYS.TEST_CASES)
export const TestSuiteModel = new LocalStorageModel<TestSuite>(STORAGE_KEYS.TEST_SUITES)

// Specialized query methods
export const TicketQueries = {
  getByStatus: (status: Ticket["status"]) => TicketModel.query((ticket) => ticket.status === status),

  getByAssignee: (userId: string) => TicketModel.query((ticket) => ticket.assignedTo === userId),

  getByPriority: (priority: Ticket["priority"]) => TicketModel.query((ticket) => ticket.priority === priority),

  getRecentlyUpdated: (days = 7) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return TicketModel.query((ticket) => new Date(ticket.updatedAt) > cutoff)
  },
}

export const TestCaseQueries = {
  getByStatus: (status: QATestCase["status"]) => TestCaseModel.query((testCase) => testCase.status === status),

  getByAssignee: (userId: string) => TestCaseModel.query((testCase) => testCase.assignedTo === userId),

  getByPriority: (priority: QATestCase["priority"]) =>
    TestCaseModel.query((testCase) => testCase.priority === priority),

  getLinkedToTicket: (ticketId: string) => TestCaseModel.query((testCase) => testCase.linkedTickets.includes(ticketId)),
}
