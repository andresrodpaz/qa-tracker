// Database schema definitions for QTrack
export interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "MANAGER" | "QA" | "DEV" | "USER"
  avatar?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  lastLogin?: Date
  department?: string
  permissions?: string[]
  twoFactorEnabled?: boolean
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  category: "bug" | "feature" | "support" | "enhancement"
  assignedTo?: string
  reportedBy: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  tags: string[]
  attachments: string[]
  estimatedHours?: number
  actualHours?: number
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  isInternal: boolean
  attachments: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "archived"
  createdBy: string
  createdAt: Date
  updatedAt: Date
  members: string[]
  ticketCount: number
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: "ticket" | "comment" | "project" | "user"
  entityId: string
  details: Record<string, any>
  createdAt: Date
}

export interface QATestCase {
  id: string
  title: string
  description: string
  steps: string[]
  expectedResult: string
  actualResult?: string
  status: "pending" | "passed" | "failed" | "blocked"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  executedAt?: Date
  tags: string[]
  linkedTickets: string[]
}

export interface TestSuite {
  id: string
  name: string
  description: string
  testCases: string[]
  status: "draft" | "active" | "archived"
  createdBy: string
  createdAt: Date
  updatedAt: Date
  lastExecuted?: Date
  passRate?: number
}

export type CreateTicketData = Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "reportedBy" | "attachments">
export type UpdateTicketData = Partial<Omit<Ticket, "id" | "createdAt" | "updatedAt" | "reportedBy">>

export type CreateTestCaseData = Omit<
  QATestCase,
  "id" | "createdAt" | "updatedAt" | "status" | "createdBy" | "executedAt"
>
export type UpdateTestCaseData = Partial<Omit<QATestCase, "id" | "createdAt" | "updatedAt" | "createdBy">>

export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt" | "isActive" | "lastLogin">
export type UpdateUserData = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>

export type CreateCommentData = Omit<Comment, "id" | "createdAt" | "updatedAt">
export type UpdateCommentData = Partial<Omit<Comment, "id" | "createdAt" | "updatedAt" | "userId" | "ticketId">>

export type CreateTestSuiteData = Omit<
  TestSuite,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "lastExecuted" | "passRate"
>
export type UpdateTestSuiteData = Partial<Omit<TestSuite, "id" | "createdAt" | "updatedAt" | "createdBy">>
