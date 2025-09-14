// Comprehensive test users for all roles with realistic data
import { UserModel } from "../lib/database/models"
import type { User } from "../lib/database/schema"

const comprehensiveTestUsers: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  // ADMIN Users
  {
    email: "admin@qtrack.com",
    name: "System Administrator",
    role: "ADMIN",
    avatar: "/admin-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    department: "IT Operations",
    twoFactorEnabled: true,
  },
  {
    email: "superadmin@qtrack.com",
    name: "Super Admin",
    role: "ADMIN",
    avatar: "/admin-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    department: "IT Operations",
    twoFactorEnabled: true,
  },

  // MANAGER Users
  {
    email: "qa.manager@qtrack.com",
    name: "QA Team Manager",
    role: "MANAGER",
    avatar: "/manager-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: true,
  },
  {
    email: "project.manager@qtrack.com",
    name: "Project Manager",
    role: "MANAGER",
    avatar: "/manager-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    department: "Project Management",
    twoFactorEnabled: false,
  },
  {
    email: "team.lead@qtrack.com",
    name: "Team Lead",
    role: "MANAGER",
    avatar: "/manager-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    department: "Development",
    twoFactorEnabled: true,
  },

  // QA Users
  {
    email: "senior.qa@qtrack.com",
    name: "Senior QA Engineer",
    role: "QA",
    avatar: "/senior-tester-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: true,
  },
  {
    email: "qa.analyst@qtrack.com",
    name: "QA Analyst",
    role: "QA",
    avatar: "/qa-agent-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: false,
  },
  {
    email: "automation.tester@qtrack.com",
    name: "Automation Test Engineer",
    role: "QA",
    avatar: "/tester-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: true,
  },
  {
    email: "manual.tester@qtrack.com",
    name: "Manual Test Specialist",
    role: "QA",
    avatar: "/qa-agent-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: false,
  },
  {
    email: "performance.tester@qtrack.com",
    name: "Performance Test Engineer",
    role: "QA",
    avatar: "/senior-tester-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
    department: "Quality Assurance",
    twoFactorEnabled: true,
  },

  // DEV Users
  {
    email: "senior.dev@qtrack.com",
    name: "Senior Developer",
    role: "DEV",
    avatar: "/dev-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    department: "Development",
    twoFactorEnabled: true,
  },
  {
    email: "frontend.dev@qtrack.com",
    name: "Frontend Developer",
    role: "DEV",
    avatar: "/dev-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
    department: "Development",
    twoFactorEnabled: false,
  },
  {
    email: "backend.dev@qtrack.com",
    name: "Backend Developer",
    role: "DEV",
    avatar: "/dev-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 22), // 22 minutes ago
    department: "Development",
    twoFactorEnabled: true,
  },
  {
    email: "fullstack.dev@qtrack.com",
    name: "Full Stack Developer",
    role: "DEV",
    avatar: "/dev-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
    department: "Development",
    twoFactorEnabled: false,
  },

  // USER Users (Basic access)
  {
    email: "business.analyst@qtrack.com",
    name: "Business Analyst",
    role: "USER",
    avatar: "/user-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
    department: "Business Analysis",
    twoFactorEnabled: false,
  },
  {
    email: "product.owner@qtrack.com",
    name: "Product Owner",
    role: "USER",
    avatar: "/user-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
    department: "Product Management",
    twoFactorEnabled: false,
  },
  {
    email: "stakeholder@qtrack.com",
    name: "Business Stakeholder",
    role: "USER",
    avatar: "/user-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    department: "Business",
    twoFactorEnabled: false,
  },

  // Inactive/Test Users
  {
    email: "inactive.user@qtrack.com",
    name: "Inactive User",
    role: "USER",
    avatar: "/user-avatar.png",
    isActive: false,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    department: "Testing",
    twoFactorEnabled: false,
  },
  {
    email: "demo@qtrack.com",
    name: "Demo User",
    role: "QA",
    avatar: "/qa-agent-avatar.png",
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    department: "Demo",
    twoFactorEnabled: false,
  },
]

// Default login credentials for testing
export const testCredentials = {
  admin: { email: "admin@qtrack.com", password: "admin123" },
  manager: { email: "qa.manager@qtrack.com", password: "manager123" },
  qa: { email: "senior.qa@qtrack.com", password: "qa123" },
  dev: { email: "senior.dev@qtrack.com", password: "dev123" },
  user: { email: "business.analyst@qtrack.com", password: "user123" },
  demo: { email: "demo@qtrack.com", password: "demo123" },
}

// Role-based permission mapping
export const rolePermissions = {
  ADMIN: [
    "tickets.create",
    "tickets.read",
    "tickets.update",
    "tickets.delete",
    "users.manage",
    "projects.manage",
    "reports.view",
    "settings.manage",
    "test-cases.create",
    "test-cases.read",
    "test-cases.update",
    "test-cases.delete",
    "test-suites.manage",
    "analytics.view",
    "system.admin",
  ],
  MANAGER: [
    "tickets.create",
    "tickets.read",
    "tickets.update",
    "tickets.assign",
    "reports.view",
    "team.manage",
    "test-cases.read",
    "test-cases.assign",
    "test-suites.read",
    "analytics.view",
    "projects.read",
  ],
  QA: [
    "tickets.create",
    "tickets.read",
    "tickets.update",
    "tickets.test",
    "test-cases.create",
    "test-cases.read",
    "test-cases.update",
    "test-cases.execute",
    "test-suites.create",
    "test-suites.read",
    "test-suites.execute",
    "reports.view",
    "comments.create",
  ],
  DEV: ["tickets.read", "tickets.update", "tickets.resolve", "comments.create", "test-cases.read", "projects.read"],
  USER: ["tickets.create", "tickets.read", "comments.create", "reports.view"],
}

export function seedComprehensiveUsers() {
  console.log("[v0] Seeding comprehensive test users...")

  // Clear existing users
  if (typeof window !== "undefined") {
    localStorage.removeItem("qtrack_users")
  }

  // Create all test users
  const users = comprehensiveTestUsers.map((userData) => {
    const user = UserModel.create({
      ...userData,
      permissions: rolePermissions[userData.role],
    })
    console.log(`[v0] Created ${userData.role} user: ${userData.name} (${userData.email})`)
    return user
  })

  console.log(`[v0] Successfully created ${users.length} test users across all roles`)
  console.log("[v0] Test credentials available in testCredentials export")

  return users
}

// Auto-seed comprehensive users in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const existingUsers = JSON.parse(localStorage.getItem("qtrack_users") || "[]")
  if (existingUsers.length < 10) {
    // Re-seed if we don't have comprehensive users
    seedComprehensiveUsers()
  }
}
