import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsService } from "@/lib/services/analytics.service"
import { TicketRepository } from "@/lib/repositories/ticket.repository"
import { TestCaseRepository } from "@/lib/repositories/test-case.repository"
import { UserRepository } from "@/lib/repositories/user.repository"
import { ActivityLogRepository } from "@/lib/repositories/activity-log.repository"
import { ErrorHandler } from "@/lib/utils/error-handler"

export class AnalyticsController {
  private analyticsService: AnalyticsService

  constructor() {
    const ticketRepository = new TicketRepository()
    const testCaseRepository = new TestCaseRepository()
    const userRepository = new UserRepository()
    const activityLogRepository = new ActivityLogRepository()

    this.analyticsService = new AnalyticsService(
      ticketRepository,
      testCaseRepository,
      userRepository,
      activityLogRepository,
    )
  }

  async getAnalytics(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const period = searchParams.get("period") || "7d"

      const analytics = await this.analyticsService.getAnalytics(period)
      return NextResponse.json(analytics)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
