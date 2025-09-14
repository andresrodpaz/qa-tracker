import { createMocks } from "node-mocks-http"
import ticketsHandler from "@/app/api/tickets/route"
import commentsHandler from "@/app/api/comments/route"

describe("API Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("should create ticket and add comment", async () => {
    // Create ticket
    const { req: ticketReq, res: ticketRes } = createMocks({
      method: "POST",
      body: {
        title: "Integration Test Ticket",
        description: "Test description",
        priority: "HIGH",
        assigneeId: "user1",
        reporterId: "user2",
      },
    })

    await ticketsHandler.POST(ticketReq)
    const ticketData = JSON.parse(ticketRes._getData())
    expect(ticketData.title).toBe("Integration Test Ticket")

    // Add comment to ticket
    const { req: commentReq, res: commentRes } = createMocks({
      method: "POST",
      body: {
        content: "Integration test comment",
        authorId: "user1",
        ticketId: ticketData.id,
      },
    })

    await commentsHandler.POST(commentReq)
    const commentData = JSON.parse(commentRes._getData())
    expect(commentData.content).toBe("Integration test comment")
    expect(commentData.ticketId).toBe(ticketData.id)
  })

  test("should handle cascading operations", async () => {
    // Create multiple related entities
    const operations = [
      { type: "ticket", data: { title: "Parent Ticket", priority: "HIGH" } },
      { type: "comment", data: { content: "First comment" } },
      { type: "comment", data: { content: "Second comment" } },
    ]

    let ticketId: string

    for (const operation of operations) {
      if (operation.type === "ticket") {
        const { req, res } = createMocks({
          method: "POST",
          body: operation.data,
        })
        await ticketsHandler.POST(req)
        const data = JSON.parse(res._getData())
        ticketId = data.id
      } else if (operation.type === "comment") {
        const { req, res } = createMocks({
          method: "POST",
          body: { ...operation.data, ticketId, authorId: "user1" },
        })
        await commentsHandler.POST(req)
      }
    }

    // Verify all operations succeeded
    const storedTickets = JSON.parse(localStorage.getItem("qtrack_tickets") || "[]")
    const storedComments = JSON.parse(localStorage.getItem("qtrack_comments") || "[]")

    expect(storedTickets).toHaveLength(1)
    expect(storedComments).toHaveLength(2)
    expect(storedComments.every((c: any) => c.ticketId === ticketId)).toBe(true)
  })
})
