import { http, HttpResponse } from "msw"

export const handlers = [
  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as any

    if (email === "test@example.com" && password === "password123") {
      return HttpResponse.json({
        success: true,
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "USER",
        },
        token: "mock-jwt-token",
      })
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const userData = (await request.json()) as any

    if (userData.email === "existing@example.com") {
      return HttpResponse.json({ error: "User already exists" }, { status: 409 })
    }

    return HttpResponse.json({
      success: true,
      user: {
        id: "2",
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: "USER",
      },
    })
  }),

  // Tickets endpoints
  http.get("/api/tickets", () => {
    return HttpResponse.json({
      success: true,
      tickets: [
        {
          id: "1",
          number: 1001,
          title: "Test Ticket",
          description: "This is a test ticket",
          status: "OPEN",
          priority: "HIGH",
          type: "BUG",
          createdAt: "2024-01-15T10:30:00Z",
          reporter: { name: "Test User" },
          assignee: { name: "John Doe" },
          tags: ["test", "bug"],
          _count: { comments: 3, attachments: 1 },
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      },
    })
  }),

  http.post("/api/tickets", async ({ request }) => {
    const ticketData = (await request.json()) as any

    return HttpResponse.json({
      success: true,
      ticket: {
        id: "2",
        number: 1002,
        ...ticketData,
        createdAt: new Date().toISOString(),
        status: "OPEN",
        reporter: { name: "Test User" },
        _count: { comments: 0, attachments: 0 },
      },
    })
  }),

  http.get("/api/tickets/:id", ({ params }) => {
    return HttpResponse.json({
      success: true,
      ticket: {
        id: params.id,
        number: 1001,
        title: "Test Ticket Detail",
        description: "Detailed test ticket description",
        status: "OPEN",
        priority: "HIGH",
        type: "BUG",
        createdAt: "2024-01-15T10:30:00Z",
        reporter: { name: "Test User" },
        assignee: { name: "John Doe" },
        tags: ["test", "bug"],
        comments: [],
        history: [],
        attachments: [],
      },
    })
  }),

  // Dashboard endpoints
  http.get("/api/dashboard/stats", () => {
    return HttpResponse.json({
      success: true,
      overview: {
        totalTickets: 100,
        openTickets: 25,
        myTickets: 5,
        criticalTickets: 3,
        overdueTickets: 2,
        resolvedToday: 8,
      },
      trends: [
        { date: "2024-01-15", created: 5, resolved: 3 },
        { date: "2024-01-16", created: 7, resolved: 4 },
      ],
      distribution: {
        priority: [
          { name: "HIGH", value: 10, color: "#ef4444" },
          { name: "MEDIUM", value: 15, color: "#f59e0b" },
        ],
        status: [
          { name: "OPEN", value: 25, color: "#3b82f6" },
          { name: "IN_PROGRESS", value: 15, color: "#f59e0b" },
        ],
        type: [
          { name: "BUG", value: 30, color: "#ef4444" },
          { name: "FEATURE", value: 20, color: "#10b981" },
        ],
      },
      recentActivity: [],
      topPerformers: [],
    })
  }),
]
