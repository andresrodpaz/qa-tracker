import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/comments/route"
import jest from "jest" // Declare the jest variable

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/comments", () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/comments", () => {
    it("should return all comments when no ticketId provided", async () => {
      const mockComments = [
        {
          id: "comment-1",
          ticketId: "ticket-1",
          userId: "user-1",
          content: "First comment",
          createdAt: new Date("2024-01-01").toISOString(),
        },
        {
          id: "comment-2",
          ticketId: "ticket-2",
          userId: "user-2",
          content: "Second comment",
          createdAt: new Date("2024-01-02").toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockComments))

      const request = new NextRequest("http://localhost:3000/api/comments")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.comments).toHaveLength(2)
      // Should be sorted by createdAt asc (oldest first)
      expect(data.comments[0].id).toBe("comment-1")
      expect(data.comments[1].id).toBe("comment-2")
    })

    it("should filter comments by ticketId", async () => {
      const mockComments = [
        {
          id: "comment-1",
          ticketId: "ticket-1",
          content: "Comment for ticket 1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "comment-2",
          ticketId: "ticket-2",
          content: "Comment for ticket 2",
          createdAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockComments))

      const request = new NextRequest("http://localhost:3000/api/comments?ticketId=ticket-1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.comments).toHaveLength(1)
      expect(data.comments[0].ticketId).toBe("ticket-1")
    })
  })

  describe("POST /api/comments", () => {
    it("should create a new comment successfully", async () => {
      const commentData = {
        ticketId: "ticket-1",
        userId: "user-1",
        content: "This is a test comment",
        isInternal: false,
        attachments: [],
      }

      const request = new NextRequest("http://localhost:3000/api/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.comment).toBeDefined()
      expect(data.comment.ticketId).toBe(commentData.ticketId)
      expect(data.comment.userId).toBe(commentData.userId)
      expect(data.comment.content).toBe(commentData.content)
      expect(data.comment.isInternal).toBe(false)
      expect(data.comment.id).toBeDefined()
    })

    it("should create internal comment", async () => {
      const commentData = {
        ticketId: "ticket-1",
        userId: "user-1",
        content: "Internal comment",
        isInternal: true,
      }

      const request = new NextRequest("http://localhost:3000/api/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.comment.isInternal).toBe(true)
    })

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        ticketId: "ticket-1",
        // Missing userId and content
      }

      const request = new NextRequest("http://localhost:3000/api/comments", {
        method: "POST",
        body: JSON.stringify(incompleteData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing required fields")
    })

    it("should log activity when comment is created", async () => {
      const commentData = {
        ticketId: "ticket-1",
        userId: "user-1",
        content: "Test comment for activity logging",
      }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_comments") return "[]"
        if (key === "qtrack_activity_logs") return "[]"
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      expect(response.status).toBe(201)

      // Verify activity was logged
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "qtrack_activity_logs",
        expect.stringContaining("comment_added"),
      )
    })
  })
})
