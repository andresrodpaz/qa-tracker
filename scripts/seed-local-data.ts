// Script to seed local storage with sample data for development and testing
import {
  UserModel,
  TicketModel,
  CommentModel,
  ProjectModel,
  ActivityLogModel,
  TestCaseModel,
  TestSuiteModel,
} from "../lib/database/models"
import type { User } from "../lib/database/schema"

// Sample data
const sampleUsers: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    email: "admin@qtrack.com",
    name: "Admin User",
    role: "admin",
    avatar: "/admin-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    email: "manager@qtrack.com",
    name: "QA Manager",
    role: "manager",
    avatar: "/manager-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    email: "agent1@qtrack.com",
    name: "QA Agent 1",
    role: "agent",
    avatar: "/qa-agent-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    email: "agent2@qtrack.com",
    name: "QA Agent 2",
    role: "agent",
    avatar: "/tester-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    email: "tester@qtrack.com",
    name: "Senior Tester",
    role: "agent",
    avatar: "/senior-tester-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
]

export function seedLocalData() {
  console.log("[v0] Starting local data seeding...")

  // Clear existing data
  if (typeof window !== "undefined") {
    Object.values({
      USERS: "qtrack_users",
      TICKETS: "qtrack_tickets",
      COMMENTS: "qtrack_comments",
      PROJECTS: "qtrack_projects",
      ACTIVITY_LOGS: "qtrack_activity_logs",
      TEST_CASES: "qtrack_test_cases",
      TEST_SUITES: "qtrack_test_suites",
    }).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  // Create users
  const users = sampleUsers.map((userData) => UserModel.create(userData))
  console.log("[v0] Created users:", users.length)

  // Create projects
  const projects = [
    {
      name: "E-commerce Platform",
      description: "Main e-commerce application testing",
      status: "active" as const,
      createdBy: users[0].id,
      members: [users[1].id, users[2].id, users[3].id],
      ticketCount: 15,
    },
    {
      name: "Mobile App QA",
      description: "Mobile application quality assurance",
      status: "active" as const,
      createdBy: users[1].id,
      members: [users[2].id, users[4].id],
      ticketCount: 8,
    },
    {
      name: "API Testing Suite",
      description: "Backend API comprehensive testing",
      status: "active" as const,
      createdBy: users[0].id,
      members: [users[3].id, users[4].id],
      ticketCount: 12,
    },
  ].map((projectData) => ProjectModel.create(projectData))
  console.log("[v0] Created projects:", projects.length)

  // Create tickets
  const tickets = [
    {
      title: "Login form validation fails",
      description: "Email validation not working properly on login form",
      status: "open" as const,
      priority: "high" as const,
      category: "bug" as const,
      assignedTo: users[2].id,
      reportedBy: users[1].id,
      tags: ["frontend", "validation"],
      attachments: [],
      estimatedHours: 4,
    },
    {
      title: "Add dark mode support",
      description: "Implement dark mode theme across the application",
      status: "in-progress" as const,
      priority: "medium" as const,
      category: "feature" as const,
      assignedTo: users[3].id,
      reportedBy: users[0].id,
      tags: ["ui", "theme"],
      attachments: [],
      estimatedHours: 8,
      actualHours: 3,
    },
    {
      title: "Performance issue on dashboard",
      description: "Dashboard loads slowly with large datasets",
      status: "resolved" as const,
      priority: "critical" as const,
      category: "bug" as const,
      assignedTo: users[4].id,
      reportedBy: users[1].id,
      tags: ["performance", "dashboard"],
      attachments: [],
      estimatedHours: 6,
      actualHours: 5,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      title: "API rate limiting",
      description: "Implement rate limiting for API endpoints",
      status: "open" as const,
      priority: "medium" as const,
      category: "enhancement" as const,
      assignedTo: users[3].id,
      reportedBy: users[0].id,
      tags: ["api", "security"],
      attachments: [],
      estimatedHours: 12,
    },
    {
      title: "Mobile responsive issues",
      description: "Layout breaks on mobile devices",
      status: "in-progress" as const,
      priority: "high" as const,
      category: "bug" as const,
      assignedTo: users[2].id,
      reportedBy: users[4].id,
      tags: ["mobile", "responsive"],
      attachments: [],
      estimatedHours: 6,
      actualHours: 2,
    },
  ].map((ticketData) => TicketModel.create(ticketData))
  console.log("[v0] Created tickets:", tickets.length)

  // Create test cases
  const testCases = [
    {
      title: "User Login Flow",
      description: "Test complete user login functionality",
      steps: ["Navigate to login page", "Enter valid credentials", "Click login button", "Verify dashboard access"],
      expectedResult: "User successfully logs in and sees dashboard",
      actualResult: "Login successful, dashboard loaded",
      status: "passed" as const,
      priority: "high" as const,
      assignedTo: users[2].id,
      createdBy: users[1].id,
      executedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      tags: ["authentication", "critical-path"],
      linkedTickets: [tickets[0].id],
    },
    {
      title: "Password Reset",
      description: "Test password reset functionality",
      steps: ["Click forgot password", "Enter email", "Check email for reset link", "Follow link and reset password"],
      expectedResult: "Password reset email sent and password updated",
      status: "pending" as const,
      priority: "medium" as const,
      assignedTo: users[3].id,
      createdBy: users[1].id,
      tags: ["authentication", "email"],
      linkedTickets: [],
    },
    {
      title: "Dashboard Performance",
      description: "Test dashboard loading performance",
      steps: ["Login to application", "Navigate to dashboard", "Measure load time", "Check for errors"],
      expectedResult: "Dashboard loads within 2 seconds",
      actualResult: "Dashboard loaded in 1.2 seconds",
      status: "passed" as const,
      priority: "high" as const,
      assignedTo: users[4].id,
      createdBy: users[0].id,
      executedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      tags: ["performance", "dashboard"],
      linkedTickets: [tickets[2].id],
    },
    {
      title: "Mobile Responsiveness",
      description: "Test application on mobile devices",
      steps: ["Open app on mobile", "Test navigation", "Check form layouts", "Verify touch interactions"],
      expectedResult: "All elements properly sized and functional on mobile",
      actualResult: "Some buttons too small on mobile",
      status: "failed" as const,
      priority: "high" as const,
      assignedTo: users[2].id,
      createdBy: users[4].id,
      executedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      tags: ["mobile", "ui"],
      linkedTickets: [tickets[4].id],
    },
  ].map((testCaseData) => TestCaseModel.create(testCaseData))
  console.log("[v0] Created test cases:", testCases.length)

  // Create test suites
  const testSuites = [
    {
      name: "Authentication Suite",
      description: "Complete authentication flow testing",
      testCases: [testCases[0].id, testCases[1].id],
      status: "active" as const,
      createdBy: users[1].id,
      lastExecuted: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      passRate: 50.0,
    },
    {
      name: "Performance Suite",
      description: "Application performance testing",
      testCases: [testCases[2].id],
      status: "active" as const,
      createdBy: users[0].id,
      lastExecuted: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      passRate: 100.0,
    },
    {
      name: "UI/UX Suite",
      description: "User interface and experience testing",
      testCases: [testCases[3].id],
      status: "active" as const,
      createdBy: users[4].id,
      lastExecuted: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      passRate: 0.0,
    },
  ].map((testSuiteData) => TestSuiteModel.create(testSuiteData))
  console.log("[v0] Created test suites:", testSuites.length)

  // Create comments
  const comments = [
    {
      ticketId: tickets[0].id,
      userId: users[2].id,
      content: "I can reproduce this issue. The email regex pattern seems incorrect.",
      isInternal: false,
      attachments: [],
    },
    {
      ticketId: tickets[0].id,
      userId: users[1].id,
      content: "Please check the validation logic in the auth component.",
      isInternal: true,
      attachments: [],
    },
    {
      ticketId: tickets[1].id,
      userId: users[3].id,
      content: "Dark mode implementation is 60% complete. Working on the dashboard components now.",
      isInternal: false,
      attachments: [],
    },
    {
      ticketId: tickets[2].id,
      userId: users[4].id,
      content: "Performance issue resolved by implementing pagination and lazy loading.",
      isInternal: false,
      attachments: [],
    },
  ].map((commentData) => CommentModel.create(commentData))
  console.log("[v0] Created comments:", comments.length)

  // Create activity logs
  const activityLogs = [
    {
      userId: users[2].id,
      action: "ticket_updated",
      entityType: "ticket" as const,
      entityId: tickets[0].id,
      details: { field: "status", old_value: "open", new_value: "in-progress" },
    },
    {
      userId: users[3].id,
      action: "comment_added",
      entityType: "comment" as const,
      entityId: comments[2].id,
      details: { ticket_id: tickets[1].id, content_length: 85 },
    },
    {
      userId: users[4].id,
      action: "ticket_resolved",
      entityType: "ticket" as const,
      entityId: tickets[2].id,
      details: { resolution_time_hours: 144 },
    },
    {
      userId: users[1].id,
      action: "test_case_created",
      entityType: "ticket" as const,
      entityId: testCases[3].id,
      details: { priority: "high", linked_tickets: [tickets[4].id] },
    },
  ].map((activityData) => ActivityLogModel.create(activityData))
  console.log("[v0] Created activity logs:", activityLogs.length)

  console.log("[v0] Local data seeding completed successfully!")

  return {
    users,
    projects,
    tickets,
    testCases,
    testSuites,
    comments,
    activityLogs,
  }
}

// Auto-seed on import in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Check if data already exists
  const existingUsers = JSON.parse(localStorage.getItem("qtrack_users") || "[]")
  if (existingUsers.length === 0) {
    seedLocalData()
  }
}
