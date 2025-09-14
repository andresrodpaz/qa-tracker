import type { IRepository } from "@/lib/interfaces/repositories"
import type { Comment } from "@/lib/database/schema"
import { LocalStorageModel } from "@/lib/database/models"

export interface ICommentRepository extends IRepository<Comment> {
  getByTicket(ticketId: string): Comment[]
  getByUser(userId: string): Comment[]
}

export class CommentRepository implements ICommentRepository {
  private model = new LocalStorageModel<Comment>("comments")

  getAll(): Comment[] {
    return this.model.getAll()
  }

  getById(id: string): Comment | null {
    return this.model.getById(id)
  }

  create(data: Omit<Comment, "id" | "createdAt" | "updatedAt">): Comment {
    return this.model.create(data)
  }

  update(id: string, data: Partial<Comment>): Comment | null {
    return this.model.update(id, data)
  }

  delete(id: string): boolean {
    return this.model.delete(id)
  }

  getByTicket(ticketId: string): Comment[] {
    return this.getAll().filter((comment) => comment.ticketId === ticketId)
  }

  getByUser(userId: string): Comment[] {
    return this.getAll().filter((comment) => comment.userId === userId)
  }
}
