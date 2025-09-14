import type { Ticket, TestCase, User, ActivityLog } from "../models" // Assuming these models are declared in a separate file

export interface IRepository<T> {
  getAll(): T[]
  getById(id: string): T | null
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): T
  update(id: string, data: Partial<T>): T | null
  delete(id: string): boolean
}

export interface ITicketRepository extends IRepository<Ticket> {
  getByStatus(status: string): Ticket[]
  getByAssignee(assignedTo: string): Ticket[]
  getByPriority(priority: string): Ticket[]
  getByCategory(category: string): Ticket[]
  search(query: string): Ticket[]
}

export interface ITestCaseRepository extends IRepository<TestCase> {
  getBySuite(suiteId: string): TestCase[]
  getByStatus(status: string): TestCase[]
}

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): User | null
  getByRole(role: string): User[]
}

export interface IActivityLogRepository extends IRepository<ActivityLog> {
  getByUser(userId: string): ActivityLog[]
  getByEntity(entityType: string, entityId: string): ActivityLog[]
}
