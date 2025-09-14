import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/tickets/route"
import { GET as getTicketById, PUT, DELETE } from "@/app/api/tickets/[id]/route"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/tickets", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()

    // Mock empty storage initially
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/tickets", () => {
    it("should return empty array when no tickets exist", async () => {
      const request = new NextRequest("http://localhost:3000/api/tickets")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tickets).toEqual([])
      expect(data.total).toBe(0)
    })

    it("should return tickets with filters", async () => {
      // Mock tickets data
      const mockTickets = [
        {
          id: "ticket-1",
          title: "Test Ticket 1",
          status: "open",
          priority: "high",
          category: "bug",
          assignedTo: "user-1",
          reportedBy: "user-2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["frontend"],
          attachments: [],
        },
        {
          id: "ticket-2",
          title: "Test Ticket 2",
          status: "closed",
          priority: "low",
          category: "feature",
          assignedTo: "user-2",
          reportedBy: "user-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["backend"],
          attachments: [],
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTickets))

      // Test status filter
      const request = new NextRequest("http://localhost:3000/api/tickets?status=open")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tickets).toHaveLength(1)
      expect(data.tickets[0].status).toBe("open")
    })

    it("should filter tickets by search term", async () => {
      const mockTickets = [
        {
          id: "ticket-1",
          title: "Login Bug Fix",
          description: "Fix login validation",
          status: "open",
          priority: "high",
          category: "bug",
          tags: ["authentication"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "ticket-2",
          title: "Dashboard Enhancement",
          description: "Improve dashboard performance",
          status: "open",
          priority: "medium",
          category: "enhancement",
          tags: ["performance"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTickets))

      const request = new NextRequest("http://localhost:3000/api/tickets?search=login")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tickets).toHaveLength(1)
      expect(data.tickets[0].title).toContain("Login")
    })
  })

  describe("POST /api/tickets", () => {
    it("should create a new ticket successfully", async () => {
      const ticketData = {
        title: "New Test Ticket",
        description: "Test ticket description",
        priority: "medium",
        category: "bug",
        reportedBy: "user-1",
        tags: ["test"],
        estimatedHours: 4,
      }

      const request = new NextRequest("http://localhost:3000/api/tickets", {
        method: "POST",
        body: JSON.stringify(ticketData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.ticket).toBeDefined()
      expect(data.ticket.title).toBe(ticketData.title)
      expect(data.ticket.status).toBe("open")
      expect(data.ticket.id).toBeDefined()
    })

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        title: "Incomplete Ticket",
        // Missing required fields
      }

      const request = new NextRequest("http://localhost:3000/api/tickets", {
        method: "POST",
        body: JSON.stringify(incompleteData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing required fields")
    })

    it("should log activity when ticket is created", async () => {
      const ticketData = {
        title: "Activity Test Ticket",
        description: "Test activity logging",
        priority: "high",
        category: "bug",
        reportedBy: "user-1",
      }

      // Mock activity log storage
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "qtrack_activity_logs") return "[]"
        if (key === "qtrack_tickets") return "[]"
        return "[]"
      })

      const request = new NextRequest("http://localhost:3000/api/tickets", {
        method: "POST",
        body: JSON.stringify(ticketData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      expect(response.status).toBe(201)

      // Verify activity was logged
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "qtrack_activity_logs",
        expect.stringContaining("ticket_created"),
      )
    })
  })

  describe("GET /api/tickets/[id]", () => {
    it("should return ticket by id", async () => {
      const mockTicket = {
        id: "ticket-1",
        title: "Test Ticket",
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockTicket]))

      const request = new NextRequest("http://localhost:3000/api/tickets/ticket-1")
      const response = await getTicketById(request, { params: { id: "ticket-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket.id).toBe("ticket-1")
      expect(data.ticket.title).toBe("Test Ticket")
    })

    it("should return 404 for non-existent ticket", async () => {
      localStorageMock.getItem.mockReturnValue("[]")

      const request = new NextRequest("http://localhost:3000/api/tickets/non-existent")
      const response = await getTicketById(request, { params: { id: "non-existent" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Ticket not found")
    })
  })

  describe("PUT /api/tickets/[id]", () => {
    it("should update ticket successfully", async () => {
      const existingTicket = {
        id: "ticket-1",
        title: "Original Title",
        status: "open",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingTicket]))

      const updateData = {
        title: "Updated Title",
        status: "in-progress",
        userId: "user-1",
      }

      const request = new NextRequest("http://localhost:3000/api/tickets/ticket-1", {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await PUT(request, { params: { id: "ticket-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket.title).toBe("Updated Title")
      expect(data.ticket.status).toBe("in-progress")
    })

    it("should set resolvedAt when status changes to resolved", async () => {
      const existingTicket = {
        id: "ticket-1",
        title: "Test Ticket",
        status: "in-progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingTicket]))

      const updateData = {
        status: "resolved",
        userId: "user-1",
      }

      const request = new NextRequest("http://localhost:3000/api/tickets/ticket-1", {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await PUT(request, { params: { id: "ticket-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket.status).toBe("resolved")
      expect(data.ticket.resolvedAt).toBeDefined()
    })
  })

  describe("DELETE /api/tickets/[id]", () => {
    it("should delete ticket successfully", async () => {
      const existingTicket = {
        id: "ticket-1",
        title: "Test Ticket",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingTicket]))

      const request = new NextRequest("http://localhost:3000/api/tickets/ticket-1?userId=user-1", {
        method: "DELETE",
      })

      const response = await DELETE(request, { params: { id: "ticket-1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it("should return 404 for non-existent ticket", async () => {
      localStorageMock.getItem.mockReturnValue("[]")

      const request = new NextRequest("http://localhost:3000/api/tickets/non-existent", {
        method: "DELETE",
      })

      const response = await DELETE(request, { params: { id: "non-existent" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Ticket not found")
    })
  })
})
