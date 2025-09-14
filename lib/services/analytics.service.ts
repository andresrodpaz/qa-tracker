import type { ITicketRepository, IUserRepository, IActivityLogRepository } from "@/lib/interfaces/repositories"
import type { ITestCaseRepository } from "@/lib/repositories/test-case.repository"

export interface AnalyticsData {
  period: string
  tickets: TicketStats
  testCases: TestCaseStats
  users: UserStats
  activities: ActivityStats
  metrics: PerformanceMetrics
}

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byPriority: Record<string, number>
  byCategory: Record<string, number>
  recentlyCreated: number
}

interface TestCaseStats {
  total: number
  pending: number
  passed: number
  failed: number
  blocked: number
  byPriority: Record<string, number>
  recentlyCreated: number
  executedInPeriod: number
}

interface UserStats {
  total: number
  active: number
  byRole: Record<string, number>
}

interface ActivityStats {
  totalInPeriod: number
  byAction: Record<string, number>
}

interface PerformanceMetrics {
  overallPassRate: number
  avgResolutionTimeHours: number
  ticketVelocity: number
  testExecutionRate: number
}

export class AnalyticsService {
  constructor(
    private ticketRepository: ITicketRepository,
    private testCaseRepository: ITestCaseRepository,
    private userRepository: IUserRepository,
    private activityLogRepository: IActivityLogRepository,
  ) {}

  async getAnalytics(period = "7d"): Promise<AnalyticsData> {
    const startDate = this.calculateStartDate(period)

    const tickets = this.ticketRepository.getAll()
    const testCases = this.testCaseRepository.getAll()
    const users = this.userRepository.getAll()
    const activities = this.activityLogRepository.getAll()

    // Filter by date range
    const recentTickets = tickets.filter((ticket) => new Date(ticket.createdAt) >= startDate)
    const recentTestCases = testCases.filter((testCase) => new Date(testCase.createdAt) >= startDate)
    const recentActivities = activities.filter((activity) => new Date(activity.createdAt) >= startDate)

    return {
      period,
      tickets: this.calculateTicketStats(tickets, recentTickets),
      testCases: this.calculateTestCaseStats(testCases, recentTestCases, startDate),
      users: this.calculateUserStats(users),
      activities: this.calculateActivityStats(recentActivities),
      metrics: this.calculatePerformanceMetrics(
        tickets,
        testCases,
        recentTickets,
        testCases.filter((tc) => tc.executedAt && new Date(tc.executedAt) >= startDate),
      ),
    }
  }

  private calculateStartDate(period: string): Date {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    return startDate
  }

  private calculateTicketStats(tickets: any[], recentTickets: any[]): TicketStats {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      byPriority: {
        critical: tickets.filter((t) => t.priority === "critical").length,
        high: tickets.filter((t) => t.priority === "high").length,
        medium: tickets.filter((t) => t.priority === "medium").length,
        low: tickets.filter((t) => t.priority === "low").length,
      },
      byCategory: {
        bug: tickets.filter((t) => t.category === "bug").length,
        feature: tickets.filter((t) => t.category === "feature").length,
        support: tickets.filter((t) => t.category === "support").length,
        enhancement: tickets.filter((t) => t.category === "enhancement").length,
      },
      recentlyCreated: recentTickets.length,
    }
  }

  private calculateTestCaseStats(testCases: any[], recentTestCases: any[], startDate: Date): TestCaseStats {
    return {
      total: testCases.length,
      pending: testCases.filter((tc) => tc.status === "pending").length,
      passed: testCases.filter((tc) => tc.status === "passed").length,
      failed: testCases.filter((tc) => tc.status === "failed").length,
      blocked: testCases.filter((tc) => tc.status === "blocked").length,
      byPriority: {
        critical: testCases.filter((tc) => tc.priority === "critical").length,
        high: testCases.filter((tc) => tc.priority === "high").length,
        medium: testCases.filter((tc) => tc.priority === "medium").length,
        low: testCases.filter((tc) => tc.priority === "low").length,
      },
      recentlyCreated: recentTestCases.length,
      executedInPeriod: testCases.filter((tc) => tc.executedAt && new Date(tc.executedAt) >= startDate).length,
    }
  }

  private calculateUserStats(users: any[]): UserStats {
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      byRole: {
        admin: users.filter((u) => u.role === "admin").length,
        manager: users.filter((u) => u.role === "manager").length,
        agent: users.filter((u) => u.role === "agent").length,
      },
    }
  }

  private calculateActivityStats(recentActivities: any[]): ActivityStats {
    return {
      totalInPeriod: recentActivities.length,
      byAction: recentActivities.reduce(
        (acc, activity) => {
          acc[activity.action] = (acc[activity.action] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }

  private calculatePerformanceMetrics(
    tickets: any[],
    testCases: any[],
    recentTickets: any[],
    recentExecutedTestCases: any[],
  ): PerformanceMetrics {
    // Calculate overall pass rate
    const executedTestCases = testCases.filter((tc) => tc.executedAt)
    const passedTestCases = executedTestCases.filter((tc) => tc.status === "passed")
    const overallPassRate = executedTestCases.length > 0 ? (passedTestCases.length / executedTestCases.length) * 100 : 0

    // Calculate average resolution time
    const resolvedTickets = tickets.filter((t) => t.resolvedAt)
    const avgResolutionTime =
      resolvedTickets.length > 0
        ? resolvedTickets.reduce((sum, ticket) => {
            const created = new Date(ticket.createdAt).getTime()
            const resolved = new Date(ticket.resolvedAt).getTime()
            return sum + (resolved - created)
          }, 0) /
          resolvedTickets.length /
          (1000 * 60 * 60) // Convert to hours
        : 0

    return {
      overallPassRate: Math.round(overallPassRate * 100) / 100,
      avgResolutionTimeHours: Math.round(avgResolutionTime * 100) / 100,
      ticketVelocity: recentTickets.length,
      testExecutionRate: recentExecutedTestCases.length,
    }
  }
}
