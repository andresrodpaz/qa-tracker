import { type NextRequest, NextResponse } from "next/server"
import { CommentService } from "@/lib/services/comment.service"
import { CommentRepository } from "@/lib/repositories/comment.repository"
import { ActivityLogRepository } from "@/lib/repositories/activity-log.repository"
import { ErrorHandler } from "@/lib/utils/error-handler"

export class CommentController {
  private commentService: CommentService

  constructor() {
    const commentRepository = new CommentRepository()
    const activityLogRepository = new ActivityLogRepository()
    this.commentService = new CommentService(commentRepository, activityLogRepository)
  }

  async getComments(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const ticketId = searchParams.get("ticketId")

      const result = ticketId
        ? await this.commentService.getCommentsByTicket(ticketId)
        : await this.commentService.getAllComments()

      return NextResponse.json(result)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async createComment(request: NextRequest): Promise<NextResponse> {
    try {
      const commentData = await request.json()
      const comment = await this.commentService.createComment(commentData)
      return NextResponse.json({ comment }, { status: 201 })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
