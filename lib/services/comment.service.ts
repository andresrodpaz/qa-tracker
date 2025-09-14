import type { ICommentRepository, IActivityLogRepository } from "@/lib/interfaces/repositories"
import type { Comment, CreateCommentData, UpdateCommentData } from "@/lib/database/schema"
import { ValidationError, NotFoundError } from "@/lib/errors/custom-errors"

export class CommentService {
  constructor(
    private commentRepository: ICommentRepository,
    private activityLogRepository: IActivityLogRepository,
  ) {}

  async getCommentsByTicket(ticketId: string): Promise<{ comments: Comment[] }> {
    const comments = this.commentRepository.getByTicket(ticketId)

    // Sort by createdAt asc (oldest first)
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return { comments }
  }

  async getAllComments(): Promise<{ comments: Comment[] }> {
    const comments = this.commentRepository.getAll()

    // Sort by createdAt desc (newest first)
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { comments }
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = this.commentRepository.getById(id)
    if (!comment) {
      throw new NotFoundError(`Comment with id ${id} not found`)
    }
    return comment
  }

  async createComment(data: CreateCommentData): Promise<Comment> {
    this.validateCommentData(data)

    const commentData = {
      ...data,
      attachments: data.attachments || [],
    }

    const comment = this.commentRepository.create(commentData)

    // Log activity
    this.activityLogRepository.create({
      userId: data.userId,
      action: "comment_added",
      entityType: "comment",
      entityId: comment.id,
      details: {
        ticketId: data.ticketId,
        contentLength: data.content.length,
        isInternal: data.isInternal,
      },
    })

    return comment
  }

  async updateComment(id: string, data: UpdateCommentData, updatedBy: string): Promise<Comment> {
    const existingComment = await this.getCommentById(id)

    // Only allow updating content and attachments
    const allowedUpdates = {
      content: data.content,
      attachments: data.attachments,
    }

    const updatedComment = this.commentRepository.update(id, allowedUpdates)
    if (!updatedComment) {
      throw new NotFoundError(`Failed to update comment with id ${id}`)
    }

    // Log activity
    this.activityLogRepository.create({
      userId: updatedBy,
      action: "comment_updated",
      entityType: "comment",
      entityId: id,
      details: { ticketId: existingComment.ticketId },
    })

    return updatedComment
  }

  async deleteComment(id: string, deletedBy: string): Promise<void> {
    const comment = await this.getCommentById(id)

    const deleted = this.commentRepository.delete(id)
    if (!deleted) {
      throw new NotFoundError(`Failed to delete comment with id ${id}`)
    }

    // Log activity
    this.activityLogRepository.create({
      userId: deletedBy,
      action: "comment_deleted",
      entityType: "comment",
      entityId: id,
      details: { ticketId: comment.ticketId },
    })
  }

  private validateCommentData(data: CreateCommentData): void {
    if (!data.ticketId?.trim()) {
      throw new ValidationError("Ticket ID is required")
    }
    if (!data.userId?.trim()) {
      throw new ValidationError("User ID is required")
    }
    if (!data.content?.trim()) {
      throw new ValidationError("Comment content is required")
    }
    if (data.content.length > 5000) {
      throw new ValidationError("Comment content too long (max 5000 characters)")
    }
  }
}
