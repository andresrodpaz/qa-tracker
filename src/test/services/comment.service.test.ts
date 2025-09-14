import { CommentService } from "@/lib/services/comment.service"
import type { Comment } from "@/lib/database/schema"

describe("CommentService", () => {
  let commentService: CommentService

  beforeEach(() => {
    commentService = new CommentService()
    localStorage.clear()
  })

  const mockComment: Comment = {
    id: "1",
    content: "Test comment",
    authorId: "user1",
    ticketId: "ticket1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  }

  describe("createComment", () => {
    it("should create a new comment successfully", async () => {
      const newComment = await commentService.createComment({
        content: "New comment",
        authorId: "user1",
        ticketId: "ticket1",
      })

      expect(newComment.content).toBe("New comment")
      expect(newComment.authorId).toBe("user1")
      expect(newComment.ticketId).toBe("ticket1")
      expect(newComment.id).toBeDefined()
    })

    it("should validate required fields", async () => {
      await expect(
        commentService.createComment({
          content: "",
          authorId: "user1",
          ticketId: "ticket1",
        }),
      ).rejects.toThrow("Content is required")
    })

    it("should store comment in localStorage", async () => {
      await commentService.createComment({
        content: "New comment",
        authorId: "user1",
        ticketId: "ticket1",
      })

      const stored = localStorage.getItem("qtrack_comments")
      expect(stored).toBeTruthy()
      const comments = JSON.parse(stored!)
      expect(comments).toHaveLength(1)
    })
  })

  describe("getCommentsByTicket", () => {
    beforeEach(() => {
      localStorage.setItem(
        "qtrack_comments",
        JSON.stringify([mockComment, { ...mockComment, id: "2", ticketId: "ticket2" }]),
      )
    })

    it("should return comments for specific ticket", async () => {
      const comments = await commentService.getCommentsByTicket("ticket1")
      expect(comments).toHaveLength(1)
      expect(comments[0].ticketId).toBe("ticket1")
    })

    it("should return empty array for non-existent ticket", async () => {
      const comments = await commentService.getCommentsByTicket("nonexistent")
      expect(comments).toHaveLength(0)
    })
  })

  describe("updateComment", () => {
    beforeEach(() => {
      localStorage.setItem("qtrack_comments", JSON.stringify([mockComment]))
    })

    it("should update existing comment", async () => {
      const updated = await commentService.updateComment("1", {
        content: "Updated content",
      })

      expect(updated.content).toBe("Updated content")
      expect(updated.updatedAt).not.toEqual(mockComment.updatedAt)
    })

    it("should throw error for non-existent comment", async () => {
      await expect(
        commentService.updateComment("nonexistent", {
          content: "Updated",
        }),
      ).rejects.toThrow("Comment not found")
    })
  })

  describe("deleteComment", () => {
    beforeEach(() => {
      localStorage.setItem("qtrack_comments", JSON.stringify([mockComment]))
    })

    it("should delete existing comment", async () => {
      await commentService.deleteComment("1")

      const stored = localStorage.getItem("qtrack_comments")
      const comments = JSON.parse(stored!)
      expect(comments).toHaveLength(0)
    })

    it("should throw error for non-existent comment", async () => {
      await expect(commentService.deleteComment("nonexistent")).rejects.toThrow("Comment not found")
    })
  })
})
